"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
require("./MapWindow.css");
const h3_js_1 = require("h3-js");
const testdata_json_1 = __importDefault(require("../testdata.json"));
/*
   {
    data: {
      ip: string,
      location: {
        lat: number,
        lng: number
      },
      bandwidth: {
        upload: number,
        download: number
      }
    }[]
  }
  */
const MapWindow = ({ selectedH3Indices }) => {
    //selectedH3Indices is a Set
    console.log(selectedH3Indices);
    if (selectedH3Indices.size > 0) {
        const points = testdata_json_1.default.data.map((d) => [d.location.lat, d.location.lng]);
        console.log("selectedH3Indices", selectedH3Indices);
        const selectedPoints = points.filter((point) => 
        //point is an array of lat and long, make sure that the lat and long are in the selectedH3Indices
        selectedH3Indices.has((0, h3_js_1.geoToH3)(point[0], point[1], 8)));
        console.log(selectedPoints);
        return ((0, jsx_runtime_1.jsxs)("div", Object.assign({ className: "MapWindow" }, { children: [(0, jsx_runtime_1.jsx)("div", { className: "blurry" }), (0, jsx_runtime_1.jsxs)("div", Object.assign({ className: "data" }, { children: [(0, jsx_runtime_1.jsx)("h2", { children: "Selected Points" }), (0, jsx_runtime_1.jsx)("ul", { children: selectedPoints.map((point) => {
                                //get the bandwidth for each point
                                const data = testdata_json_1.default.data.filter((d) => d.location.lat === point[0] && d.location.lng === point[1])[0];
                                const ip = data.ip;
                                const upload = data.bandwidth.upload;
                                const download = data.bandwidth.download;
                                return ((0, jsx_runtime_1.jsxs)("li", { children: [ip, " - Up: ", upload, " - Down:", download] }, ip));
                            }) })] }))] })));
    }
    return ((0, jsx_runtime_1.jsxs)("div", Object.assign({ className: "MapWindow" }, { children: [(0, jsx_runtime_1.jsx)("div", { className: "blurry" }), (0, jsx_runtime_1.jsx)("div", Object.assign({ className: "data" }, { children: (0, jsx_runtime_1.jsx)("h2", { children: "Nothing has been selected" }) }))] })));
};
exports.default = MapWindow;
