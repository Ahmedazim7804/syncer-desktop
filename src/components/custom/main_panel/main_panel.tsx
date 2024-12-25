import React, { Component } from "react";
import MenuBar from "./menu_bar";
import { FaClipboard } from "react-icons/fa";

export default class MainPanel extends Component {
    render() {
        return (
            <div className="flex flex-col gap-2 w-full h-full">
                <MenuBar />
            </div>
        );
    }
}
