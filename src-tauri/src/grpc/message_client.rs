use crate::core;
use crate::syncer::message_service_client::MessageServiceClient;
use crate::syncer::server_message::Payload;
use crate::syncer::{ClientMessage, ServerMessage};
use serde::{Deserialize, Serialize};
use std::time::{SystemTime, UNIX_EPOCH};
use tauri_plugin_http::reqwest::tls;
use tonic::transport::{Channel, ClientTlsConfig, Endpoint};
use tonic::{Request, Streaming};
use uuid::Uuid;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct GrpcError {
    pub message: String,
}

#[derive(Debug, Clone)]
pub struct GrpcMessageClient {
    client: MessageServiceClient<Channel>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct SerializableClipboardMessage {
    pub text: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct SerializableGenericTextMessage {
    pub text: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct SerializableAuthMessage {
    pub text: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum SerializablePayload {
    Clipboard(SerializableClipboardMessage),
    GenericText(SerializableGenericTextMessage),
    Auth(SerializableAuthMessage),
    Empty(()),
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase", tag = "event")]
pub struct SerializableServerMessage {
    pub id: String,
    pub sender_id: String,
    pub created_at: i64,
    pub r#type: i32,
    pub payload: SerializablePayload,
}

impl From<ServerMessage> for SerializableServerMessage {
    fn from(message: ServerMessage) -> Self {
        Self {
            id: message.id,
            sender_id: message.sender_id,
            created_at: message.created_at,
            r#type: message.r#type,
            payload: match message.payload {
                Some(payload) => match payload {
                    Payload::Clipboard(message) => {
                        SerializablePayload::Clipboard(SerializableClipboardMessage {
                            text: message.content,
                        })
                    }
                    Payload::GenericText(message) => {
                        SerializablePayload::GenericText(SerializableGenericTextMessage {
                            text: message.text,
                        })
                    }
                    Payload::Auth(message) => SerializablePayload::Auth(SerializableAuthMessage {
                        text: message.message,
                    }),
                },
                None => SerializablePayload::Empty(()),
            },
        }
    }
}

impl GrpcMessageClient {
    pub fn new(tls_config: ClientTlsConfig) -> Self {
        Self {
            client: MessageServiceClient::new(Endpoint::connect_lazy(
                &Endpoint::from_static("https://localhost:50051")
                    .tls_config(tls_config)
                    .unwrap(),
            )),
        }
    }

    pub async fn is_connected(&mut self) -> bool {
        let request = Request::new(());
        let response = self.client.is_connected(request).await;

        if let Ok(response) = response {
            *response.get_ref()
        } else {
            false
        }
    }

    pub async fn connect(url: String) -> Result<Self, Box<dyn std::error::Error>> {
        let tls_config = core::tls::load_cert()?;
        let endpoint = Endpoint::from_shared(url)?.tls_config(tls_config)?;
        let client = MessageServiceClient::connect(endpoint).await?;
        Ok(Self { client })
    }

    pub async fn listen(&mut self, token: String) -> Result<Streaming<ServerMessage>, GrpcError> {
        println!("sending request");
        let request = Request::new(ClientMessage {
            id: Uuid::new_v4().to_string(),
            token,
            created_at: SystemTime::now()
                .duration_since(UNIX_EPOCH)
                .unwrap()
                .as_millis() as i64,
            r#type: 1,
            payload: None,
        });
        println!("request sent");

        let response = self.client.stream_messages(request).await;
        println!("response received");

        if let Ok(response) = response {
            println!("response: {:?}", "good response");
            return Ok(response.into_inner());
        } else {
            println!("error: {:?}", "bad response");
            return Err(GrpcError {
                message: response.unwrap_err().to_string(),
            });
        }
    }
}
