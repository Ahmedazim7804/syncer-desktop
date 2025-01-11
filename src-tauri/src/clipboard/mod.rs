use tauri::{AppHandle, Emitter};
use wayland_clipboard_listener::ClipBoardListenContext;
use wayland_clipboard_listener::WlClipboardPasteStream;
use wayland_clipboard_listener::WlListenType;
use wl_clipboard_rs::copy::{MimeType, Options, Source};

#[tauri::command]
pub async fn ClipboardListener(app: AppHandle) {
    let mut stream = WlClipboardPasteStream::init(WlListenType::ListenOnCopy).unwrap();
    for context in stream.paste_stream().flatten().flatten() {
        let data = context.context;

        if let ClipBoardListenContext::Text(text) = data {
            println!("{}", text);
        }
    }
}

fn send_clipboard_data(app: AppHandle, data: String) {
    app.emit("clipboard_data", Some(data));
}
