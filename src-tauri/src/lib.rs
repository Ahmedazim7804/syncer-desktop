mod commands;
mod grpc;
mod state;
mod syncer;
use crate::state::Storage;
use dotenv;
use futures::lock::Mutex;
use grpc::message_client::GrpcMessageClient;
mod core;

#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() -> Result<(), Box<dyn std::error::Error>> {
    dotenv::from_path("../.env").ok();
    let tls_config = core::tls::load_cert()?;

    let client = GrpcMessageClient::new(tls_config);

    tauri::Builder::default()
        .manage(Storage {
            client: Mutex::new(client),
        })
        .plugin(tauri_plugin_store::Builder::new().build())
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_http::init())
        .invoke_handler(tauri::generate_handler![
            commands::syncer::is_reachable,
            commands::syncer::stream_messages,
            greet
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");

    Ok(())
}
