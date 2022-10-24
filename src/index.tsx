import React from "react";
import ReactDOM from "react-dom/client";
import { Game } from "./components/game/game";
import "./index.scss";

const root = ReactDOM.createRoot(document.getElementById("root")!);
root.render(
  <React.StrictMode>
    <p>App Test Variable: {process.env.REACT_APP_TEST_VARIABLE}</p>
    <p>Node Env: {process.env.NODE_ENV}</p>
    <Game />
  </React.StrictMode>
);
