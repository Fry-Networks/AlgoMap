import { jsx as _jsx } from "react/jsx-runtime";
import React from "react";
import ReactDOM from "react-dom";
import "mapbox-gl/dist/mapbox-gl.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "./index.css";
import App from "./App";
//import reportWebVitals from "./reportWebVitals";
ReactDOM.render(_jsx(React.StrictMode, { children: _jsx(App, {}) }), document.getElementById("root"));
