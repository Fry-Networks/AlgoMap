"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const h3_js_1 = require("h3-js");
const MapWindow_1 = __importDefault(require("./MapWindow"));
const reactstrap_1 = require("reactstrap");
const Map_1 = __importDefault(require("./Map"));
const utility_1 = require("./Map/utility");
const testdata_json_1 = __importDefault(require("./testdata.json"));
const App = () => {
    const [selectedH3Indices, setH3Indices] = (0, react_1.useState)(new Set());
    const coordinates = (0, h3_js_1.h3SetToMultiPolygon)(Array.from(selectedH3Indices), true);
    const geoJson = (0, utility_1.getGeoJson)(coordinates);
    const points = testdata_json_1.default.data.map((d) => [d.location.lat, d.location.lng]);
    const data = {
        type: "FeatureCollection",
        features: points.map((point) => ({
            type: "Feature",
            properties: { mag: 1 },
            geometry: { type: "Point", coordinates: [point[1], point[0]] },
        })),
    };
    const testData = {
        type: "FeatureCollection",
        features: [
            {
                type: "Feature",
                properties: { mag: 1 },
                geometry: { type: "Point", coordinates: [-122.4, 37.7] },
            },
            {
                type: "Feature",
                properties: { mag: 2 },
                geometry: { type: "Point", coordinates: [-122.4, 37.7] },
            },
            {
                type: "Feature",
                properties: { mag: 3 },
                geometry: { type: "Point", coordinates: [-122.4, 37.7] },
            },
        ],
    };
    console.log(data);
    return ((0, jsx_runtime_1.jsx)("div", Object.assign({ className: "App" }, { children: (0, jsx_runtime_1.jsx)(reactstrap_1.Row, { children: (0, jsx_runtime_1.jsxs)(reactstrap_1.Col, { children: [(0, jsx_runtime_1.jsx)(Map_1.default, Object.assign({}, {
                        onHexClick: setH3Indices,
                        selectedH3Indices: selectedH3Indices,
                        points: points,
                    })), (0, jsx_runtime_1.jsxs)(MapWindow_1.default, Object.assign({}, { selectedH3Indices }, { children: [(0, jsx_runtime_1.jsx)("h2", { children: "Window Title" }), (0, jsx_runtime_1.jsx)("p", { children: "Some content" })] }))] }) }) })));
};
exports.default = App;
