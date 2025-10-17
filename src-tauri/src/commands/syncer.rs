use futures::lock::Mutex;
use serde::{Deserialize, Serialize};
use serde_json::Value;
use tauri::{
    ipc::{Channel, IpcResponse},
    State,
};

use crate::{
    grpc::message_client::{GrpcError, GrpcMessageClient},
    state::Storage,
    syncer::ServerMessage,
};

#[tauri::command]
pub async fn is_reachable(state: State<'_, Storage>) -> Result<bool, bool> {
    let mut client = state.client.lock().await;
    let res = client.is_reachable().await;
    println!("HELLO is_reachable: {:?}", res);

    Ok(res)
}

#[tauri::command]
pub async fn stream_messages(
    state: State<'_, Storage>,
    token: String,
    on_event: Channel<ServerMessage>,
) -> Result<(), GrpcError> {
    let mut client = state.client.lock().await;
    let mut res = client.listen(token).await?;

    while let Ok(option) = res.message().await {
        if let Some(message) = option {
            println!("{:?}", message);
            on_event.send(message).unwrap();
        }
    }

    Ok(())
}
