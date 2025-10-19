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
    syncer::{ClientMessage, ServerMessage},
};

#[tauri::command]
pub async fn connect(state: State<'_, Storage>, token: String) -> Result<bool, GrpcError> {
    let client: futures::lock::MutexGuard<'_, GrpcMessageClient> = state.client.lock().await;
    if client.connected {
        return Ok(true);
    } else {
        let rest = client.listen(token.clone()).await;
        let transmit = client.transmit(token).await;
        if rest.is_ok() && transmit.is_ok() {
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
    let mut handle_guard = state.streamThreadHandle.lock().await;

    if let Some(handle) = handle_guard.take() {
        handle.abort();
        let _ = handle.await;
    }

    // Subscribe to the broadcast channel
    let mut rx: tokio::sync::broadcast::Receiver<ServerMessage>;
    {
        let client = state.client.lock().await;
        rx = client.rx.resubscribe();
    }

    let handle = tokio::spawn(async move {
        while let Ok(message) = rx.recv().await {
            // on_event.send(message).unwrap();
            if let Err(e) = on_event.send(message) {
                eprintln!("Error sending message: {:?}", e);
                break;
            }
        }
    });
    *handle_guard = Some(handle);

    Ok(())
}

#[tauri::command]
pub async fn send_message(
    state: State<'_, Storage>,
    message: ClientMessage,
) -> Result<(), GrpcError> {
    let client: futures::lock::MutexGuard<'_, GrpcMessageClient> = state.client.lock().await;
    let resp = client.tx2.send(message).await;
    if resp.is_ok() {
        Ok(())
    } else {
        Err(GrpcError {
            message: resp.unwrap_err().to_string(),
        })
    }
}
