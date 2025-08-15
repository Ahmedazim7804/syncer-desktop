use crate::grpc::message_client::GrpcMessageClient;
use futures::lock::Mutex;

pub struct Storage {
    pub client: Mutex<GrpcMessageClient>,
}
