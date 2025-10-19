use crate::core;
use crate::syncer::client_message::Payload;
use crate::syncer::MessageType;
use crate::syncer::{
    message_service_client::MessageServiceClient, ClientMessage, ClipboardMessage,
    ConnectedDevices, DeviceInfo, GenericTextMessage, ServerMessage,
};
use serde::{Deserialize, Serialize};
use serde_with::serde_as;
use std::pin::Pin;
use std::str::FromStr;
use std::sync::atomic::Ordering;
use std::sync::{atomic::AtomicBool, Arc, Mutex};
use std::time::{SystemTime, UNIX_EPOCH};
use tauri_plugin_http::reqwest::tls;
use tokio::sync::broadcast;
use tokio_stream::wrappers::ReceiverStream;
use tonic::metadata::{self, MetadataMap, MetadataValue};
use tonic::transport::{Channel, ClientTlsConfig, Endpoint};
use tonic::{Request, Streaming};
use uuid::Uuid;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct GrpcError {
    pub message: String,
}

#[derive(Debug)]
pub struct GrpcMessageClient {
    client: MessageServiceClient<Channel>,
    pub connected: bool,
    listening: Arc<AtomicBool>,
    tx: broadcast::Sender<ServerMessage>,
    pub rx: broadcast::Receiver<ServerMessage>,
    pub tx2: tokio::sync::mpsc::Sender<ClientMessage>,
    pub rx2: Arc<tokio::sync::Mutex<tokio::sync::mpsc::Receiver<ClientMessage>>>,
}

impl GrpcMessageClient {
    pub fn new(tls_config: ClientTlsConfig) -> Self {
        let (tx, _rx) = broadcast::channel::<ServerMessage>(16);
        let (tx2, _rx2) = tokio::sync::mpsc::channel(16);
        Self {
            connected: false,
            client: MessageServiceClient::new(Endpoint::connect_lazy(
                &Endpoint::from_static("https://localhost:50051")
                    .tls_config(tls_config)
                    .unwrap(),
            )),
            listening: Arc::new(AtomicBool::new(false)),
            tx,
            rx: _rx,
            tx2,
            rx2: Arc::new(tokio::sync::Mutex::new(_rx2)),
        }
    }

    pub async fn is_reachable(&mut self) -> bool {
        let request = Request::new(());
        let response = self.client.is_reachable(request).await;

        if let Ok(response) = response {
            *response.get_ref()
        } else {
            false
        }
    }

    pub async fn connect(url: String) -> Result<Self, Box<dyn std::error::Error>> {
        let (tx, _rx) = broadcast::channel::<ServerMessage>(16);
        let (tx2, _rx2) = tokio::sync::mpsc::channel(16);
        let tls_config = core::tls::load_cert()?;
        let endpoint = Endpoint::from_shared(url)?.tls_config(tls_config)?;
        let client = MessageServiceClient::connect(endpoint).await?;
        Ok(Self {
            client,
            connected: true,
            listening: Arc::new(AtomicBool::new(false)),
            tx,
            rx: _rx,
            tx2,
            rx2: Arc::new(tokio::sync::Mutex::new(_rx2)),
        })
    }

    pub async fn listen(&self, token: String) -> Result<(), GrpcError> {
        if self.listening.load(Ordering::Relaxed) {
            return Err(GrpcError {
                message: "Already listening".to_string(),
            });
        }
        println!("sending request");
        let mut request = Request::new(());
        println!("token: {:?}", token);
        let metadata_value: MetadataValue<metadata::Ascii> = MetadataValue::from_str(&token)
            .map_err(|_| GrpcError {
                message: "Invalid token for metadata".to_string(),
            })?;
        request
            .metadata_mut()
            .insert("authorization", metadata_value);

        let response = self.client.clone().stream_messages(request).await;
        println!("response received");

        if let Ok(response) = response {
            let stream1: Pin<Box<_>> = Box::pin(response.into_inner());
            let tx = self.tx.clone();
            let listening = self.listening.clone();

            tokio::spawn(async move {
                let mut stream = *Pin::into_inner(stream1);
                while let Ok(option) = stream.message().await {
                    if let Some(message) = option {
                        println!("Received message");
                        let _ = tx.send(message);
                    }
                }
                listening.store(false, Ordering::Relaxed);
            });
            println!("response: {:?}", "good response");
            return Ok(());
        } else {
            println!("error: {:?}", "bad response");
            return Err(GrpcError {
                message: response.unwrap_err().to_string(),
            });
        }
    }

    pub async fn transmit(&self, token: String) -> Result<(), GrpcError> {
        let rx2 = self.rx2.clone();
        let mut client = self.client.clone();

        tokio::spawn(async move {
            // Create a bridge channel
            let (tx, rx) = tokio::sync::mpsc::channel(16);

            // Forward messages from the mutex-protected receiver to our channel
            let rx2_clone = rx2.clone();
            tokio::spawn(async move {
                let mut rx2_guard = rx2_clone.lock().await;
                while let Some(msg) = rx2_guard.recv().await {
                    println!("Transmitting message: {:?}", msg);
                    if tx.send(msg).await.is_err() {
                        break; // Channel closed
                    }
                }
            });

            // Use the bridge channel for the gRPC stream
            let metadata_value = MetadataValue::from_str(&token).map_err(|_| GrpcError {
                message: "Invalid token for metadata".to_string(),
            });

            let mut request = Request::new(ReceiverStream::new(rx));
            if let Ok(metadata_value) = metadata_value {
                request
                    .metadata_mut()
                    .insert("authorization", metadata_value);
            } else {
                return Err(GrpcError {
                    message: "Invalid token for metadata".to_string(),
                });
            }

            let response = client.send_message(request).await;

            if let Ok(response) = response {
                println!("Messages transmitted successfully");
                Ok(())
            } else {
                let error = response.unwrap_err();
                eprintln!("Failed to transmit message: {:?}", error);
                Err(GrpcError {
                    message: error.to_string(),
                })
            }
        });
        Ok(())
    }
}
