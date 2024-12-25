import { useState } from "react";
import reactLogo from "./assets/react.svg";
import { Button } from "@/components/ui/button";
import { invoke } from "@tauri-apps/api/core";
import Sidepanel from "./components/custom/sidepanel/sidepanel";
import MainPanel from "./components/custom/main_panel/main_panel";

function App() {
    const [greetMsg, setGreetMsg] = useState("");
    const [name, setName] = useState("");

    async function greet() {
        // Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
        setGreetMsg(await invoke("greet", { name }));
    }

    return (
        <div className="flex flex-row h-[100vh] w-[100vw] bg-stone-800 align">
            <Sidepanel />
            <MainPanel />
        </div>
    );
}

export default App;
