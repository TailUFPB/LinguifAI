import React, { ReactNode } from "react";
import { Menu } from "../../components/menu/menu";
import logo from "../../assets/images/tailLogo.svg";
import Header from "./header";
import ChatBot from "../../components/chatbot/chatbot";

interface LayoutProps {
    children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
    return (
        <div className="bg-white text-blue-950 min-h-screen flex flex-col">
            <Header title="LinguifAI" />
            <main className="flex-grow">{children}</main>
            <ChatBot />
        </div>
    );
}
