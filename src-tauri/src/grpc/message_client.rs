use crate::core;
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
}

impl GrpcMessageClient {
    pub fn new(tls_config: ClientTlsConfig) -> Self {
        let (tx, _rx) = broadcast::channel::<ServerMessage>(16);
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
        let tls_config = core::tls::load_cert()?;
        let endpoint = Endpoint::from_shared(url)?.tls_config(tls_config)?;
        let client = MessageServiceClient::connect(endpoint).await?;
        Ok(Self {
            client,
            connected: true,
            listening: Arc::new(AtomicBool::new(false)),
            tx,
            rx: _rx,
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
}
