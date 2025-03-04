import React from "react";
import { AuthProvider } from "./context/AuthContext";
import Router from "./Router";
import "./styles/index.css";

function App() {
    return (
        <AuthProvider>
            <Router />
        </AuthProvider>
    );
}

export default App;
