// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod core;
mod grpc;
mod state;
mod syncer;

use grpc::message_client::GrpcMessageClient;

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    // let mut client = GrpcMessageClient::connect("http://localhost:50051".to_string())
    //     .await
    //     .unwrap();

    // client.listen("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3NTQ2NjI5OTMsImlkIjoiOWJmOWRkOTAtZmIzNC00OGI4LTg1NGItMWRlYzBhNjk3NzE1IiwiZGV2aWNlIjoiMjJwYyJ9.IFmfuEJMOWevzwPQD4r-SuDH_hukNJrf_c3VTkXZQN4".to_string())
    //     .await?;

    // Ok(())

    syncer_lib::run();
    Ok(())
}
