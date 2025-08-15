use futures::lock::Mutex;
use serde_json::Value;
use tauri::{ipc::Channel, State};

use crate::{
    grpc::message_client::{GrpcError, GrpcMessageClient, SerializableServerMessage},
    state::Storage,
    syncer::ServerMessage,
};

#[tauri::command]
pub async fn is_connected(state: State<'_, Storage>) -> Result<bool, bool> {
    let mut client = state.client.lock().await;
    let res = client.is_connected().await;

    Ok(res)
}

#[tauri::command]
pub async fn stream_messages(
    state: State<'_, Storage>,
    token: String,
    on_event: Channel<SerializableServerMessage>,
) -> Result<(), GrpcError> {
    let mut client = state.client.lock().await;
    let mut res = client.listen(token).await?;

    while let Ok(option) = res.message().await {
        if let Some(message) = option {
            let new_message = SerializableServerMessage::from(message);
            println!("{:?}", new_message);
            on_event.send(new_message).unwrap();
        }
    }

    Ok(())
}
