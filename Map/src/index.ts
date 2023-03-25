import "mapbox-gl/dist/mapbox-gl.css"
import "bootstrap/dist/css/bootstrap.min.css"

import "./index.css"
import "./App"
import Server from "acquireData/server"

Server.start(3001);


//import reportWebVitals from "./reportWebVitals";

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
//reportWebVitals()
