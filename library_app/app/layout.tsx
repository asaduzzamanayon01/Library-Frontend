import React from "react";
import "@/assets/styles/globals.css";
import NavBar from "@/components/NavBar";
import { AuthProvider } from "@/context/AuthContext";
import { Toaster } from "react-hot-toast";

type children = {
    children: React.ReactNode;
};

const MainLayout = ({ children }: children) => {
    return (
        <AuthProvider>
            <html
                lang="en"
                data-theme="emerald"
                className="h-screen !scroll-smooth"
            >
                <body className="mx-80 bg-slate-100">
                    <NavBar />
                    <Toaster />
                    <main className="mt-20">{children}</main>
                </body>
            </html>
        </AuthProvider>
    );
};

export default MainLayout;
