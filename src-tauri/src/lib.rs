mod commands;
mod grpc;
mod state;
mod syncer;
use crate::state::Storage;
use futures::lock::Mutex;
use grpc::message_client::GrpcMessageClient;

#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    let client = GrpcMessageClient::default();

    tauri::Builder::default()
        .manage(Storage {
            client: Mutex::new(client),
        })
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_http::init())
        .invoke_handler(tauri::generate_handler![
            commands::syncer::is_connected,
            commands::syncer::stream_messages,
            greet
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
