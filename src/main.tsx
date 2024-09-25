import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./styles/style.scss";
import { BrowserRouter as Router } from "react-router-dom";
import { UserProvider } from "./context/UserContext.tsx";
import ScrollManager from "./components/ScrollManager/ScrollManager.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
    <Router>
        <UserProvider>
            <ScrollManager>
                <App />
            </ScrollManager>
        </UserProvider>
    </Router>
);
