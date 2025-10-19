use std::env;
use std::path::PathBuf;

pub fn main() -> Result<(), Box<dyn std::error::Error>> {
    tauri_build::build();
    let proto_files = ["./protos/syncer.proto"];
    let out_dir = PathBuf::from(".");
    let proto_package = "syncer";

    tonic_build::configure()
        .protoc_arg("--experimental_allow_proto3_optional") // for older systems
        .build_client(true)
        .build_server(false)
        .type_attribute(".", "#[derive(serde::Serialize, serde::Deserialize)]")
        .type_attribute(
            &format!("{}.ServerMessage", proto_package),
            "#[serde(rename_all = \"camelCase\")]",
        )
        .type_attribute(
            &format!("{}.ClientMessage", proto_package),
            "#[serde(rename_all = \"camelCase\")]",
        )
        .type_attribute(
            &format!("{}.DeviceInfo", proto_package),
            "#[serde(rename_all = \"camelCase\")]",
        )
        // Add this for your other messages too, just in case
        .type_attribute(
            &format!("{}.ClipboardMessage", proto_package),
            "#[serde(rename_all = \"camelCase\")]",
        )
        .type_attribute(
            &format!("{}.ConnectedDevices", proto_package),
            "#[serde(rename_all = \"camelCase\")]",
        )
        .type_attribute(
            &format!("{}.GenericTextMessage", proto_package),
            "#[serde(rename_all = \"camelCase\")]",
        )
        // --- ServerMessage oneof ---
        .field_attribute(
            &format!("{}.ServerMessage.payload", proto_package),
            "#[serde(flatten)]",
        )
        .type_attribute(
            // This renames the *variants* (Clipboard -> clipboard)
            // CORRECTED PATH: Use PascalCase 'ServerMessage'
            &format!("{}.ServerMessage.Payload", proto_package),
            "#[serde(rename_all = \"snake_case\")]",
        )
        // --- ClientMessage oneof ---
        .field_attribute(
            &format!("{}.ClientMessage.payload", proto_package),
            "#[serde(flatten)]",
        )
        .type_attribute(
            // CORRECTED PATH: Use PascalCase 'ClientMessage'
            &format!("{}.ClientMessage.Payload", proto_package),
            "#[serde(rename_all = \"snake_case\")]",
        )
        .file_descriptor_set_path(out_dir.join("store_descriptor.bin"))
        .out_dir("./src")
        .compile_protos(&proto_files, &["protos"])?;

    Ok(())
}
