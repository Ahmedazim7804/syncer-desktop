use crate::syncer::message_service_client::MessageServiceClient;
use crate::syncer::server_message::Payload;
use crate::syncer::{ClientMessage, GenericTextMessage, ServerMessage};
use prost_types::Enum;
use serde::{Deserialize, Serialize};
use serde_json;
use std::time::{SystemTime, UNIX_EPOCH};
use tonic::transport::{Channel, Endpoint, Error};
use tonic::{client, Request, Status, Streaming};
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

impl Default for GrpcMessageClient {
    fn default() -> Self {
        // Create a dummy client for default - this will need to be properly initialized
        // when actually connecting to a server
        Self {
            client: MessageServiceClient::new(Endpoint::connect_lazy(&Endpoint::from_static(
                "http://localhost:50051",
            ))),
        }
    }
}

impl GrpcMessageClient {
    pub async fn is_connected(&mut self) -> bool {
        let request = Request::new(());
        let response = self.client.is_connected(request).await;

        if let Ok(response) = response {
            *response.get_ref()
        } else {
            false
        }
    }

    pub async fn connect(url: String) -> Result<Self, Error> {
        let endpoint = Endpoint::from_shared(url)?;
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
