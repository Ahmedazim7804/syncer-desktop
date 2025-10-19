use crate::grpc::message_client::GrpcMessageClient;
use futures::lock::Mutex;
use tokio::task::JoinHandle;

pub struct Storage {
    pub client: Mutex<GrpcMessageClient>,
    pub streamThreadHandle: Mutex<Option<JoinHandle<()>>>,
}
