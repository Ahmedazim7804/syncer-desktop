use crate::core;
use crate::syncer::{
    message_service_client::MessageServiceClient, ClientMessage, ClipboardMessage,
    ConnectedDevices, DeviceInfo, GenericTextMessage, ServerMessage,
};
use serde::{Deserialize, Serialize};
use serde_with::serde_as;
use std::str::FromStr;
use std::time::{SystemTime, UNIX_EPOCH};
use tauri_plugin_http::reqwest::tls;
use tonic::metadata::{self, MetadataMap, MetadataValue};
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
        let tls_config = core::tls::load_cert()?;
        let endpoint = Endpoint::from_shared(url)?.tls_config(tls_config)?;
        let client = MessageServiceClient::connect(endpoint).await?;
        Ok(Self { client })
    }

    pub async fn listen(&mut self, token: String) -> Result<Streaming<ServerMessage>, GrpcError> {
        println!("sending request");
        let mut request = Request::new(());
        println!("token: {:?}", token);
        let metadata_value = MetadataValue::from_str(&token).map_err(|_| GrpcError {
            message: "Invalid token for metadata".to_string(),
        })?;
        request
            .metadata_mut()
            .insert("authorization", metadata_value);

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
