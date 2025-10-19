use std::sync::Arc;

use futures::lock::Mutex;
use rand::Rng;
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
pub async fn connect(state: State<'_, Storage>, token: String) -> Result<bool, GrpcError> {
    let client: futures::lock::MutexGuard<'_, GrpcMessageClient> = state.client.lock().await;
    if client.connected {
        return Ok(true);
    } else {
        let rest = client.listen(token).await;
        if rest.is_ok() {
            return Ok(true);
        } else {
            return Ok(false);
        }
    }
}

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
    on_event: Channel<ServerMessage>,
) -> Result<(), GrpcError> {
    let client = state.client.lock().await;
    let mut handle_guard = state.streamThreadHandle.lock().await;

    if let Some(handle) = handle_guard.take() {
        handle.abort();
    }

    // Subscribe to the broadcast channel
    let mut rx: tokio::sync::broadcast::Receiver<ServerMessage> = client.rx.resubscribe();
    let mut rng = rand::thread_rng();
    let id: u32 = rng.gen_range(1..=100000);
    let handle = tokio::spawn(async move {
        while let Ok(message) = rx.recv().await {
            println!("ID: {:?}", id);
            on_event.send(message).unwrap();
        }
    });
    *handle_guard = Some(handle);

    Ok(())
}
