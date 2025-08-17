use dotenv;
use std::fs;
use tonic::transport::{Certificate, ClientTlsConfig, Identity};

pub fn load_cert() -> Result<ClientTlsConfig, std::io::Error> {
    let base_path = dotenv::var("CERTS_PATH").unwrap();

    let ca_cert_path = format!("{}/ca.crt", base_path);
    let client_cert_path = format!("{}/client.crt", base_path);
    let client_key_path: String = format!("{}/client.key", base_path);

    let ca_cert = Certificate::from_pem(fs::read(ca_cert_path)?);
    let client_cert = fs::read(client_cert_path)?;
    let client_key = fs::read(client_key_path)?;

    let identity = Identity::from_pem(client_cert, client_key);

    let tls = ClientTlsConfig::new()
        .ca_certificate(ca_cert)
        .identity(identity)
        .domain_name("localhost");

    Ok(tls)
}
