"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const typed_1 = __importDefault(require("@deck.gl/react/typed"));
const react_map_gl_1 = __importDefault(require("react-map-gl"));
const typed_2 = require("@deck.gl/geo-layers/typed");
const react_1 = require("react");
const prop_types_1 = require("prop-types");
const utility_1 = require("./utility");
// const token = process.env.REACT_APP_MAPBOX_TOKEN
const token = "REDACTED_ROTATE_ME";
//make the map full screen, not only the inner part
const HEIGHT = window.innerHeight;
const WIDTH = window.innerWidth;
// Viewport settings for Conservatory of Flowers
const INITIAL_VIEW_STATE = {
    longitude: -1.98313,
    latitude: 48.66777,
    zoom: 18,
    height: HEIGHT,
    width: WIDTH,
};
const Map = ({ selectedH3Indices, onHexClick, points }) => {
    let layers = [];
    const [viewState, setViewState] = (0, react_1.useState)(INITIAL_VIEW_STATE);
    if (viewState.zoom > 11) {
        const boundingBox = (0, utility_1.bboxFromViewport)(viewState);
        const h3Indices = (0, utility_1.getH3IndicesForBB)(boundingBox, 8, points);
        //if the zoom level is too low, don't show the hexagons
        console.log("h3Indices", h3Indices);
        layers = [
            new typed_2.H3HexagonLayer({
                id: "h3-hexagon-layer",
                data: h3Indices,
                pickable: true,
                wireframe: true,
                cellSide: 100,
                filled: true,
                extruded: true,
                elevationScale: 0,
                getHexagon: (d) => d,
                autoHighlight: true,
                getLineColor: [0, 0, 0],
                getFillColor: (d) => {
                    const isSelected = selectedH3Indices.has(d);
                    // rgba - rgb=0, but a=1 to make the hex clickable
                    return isSelected ? [242, 141, 59, 50] : [139, 211, 71, 50];
                },
                opacity: 1,
                //   onHover: (info) => console.log("hover", info),
                onClick: (info) => {
                    console.log(info);
                    const isAlreadySelected = selectedH3Indices.has(info.object);
                    if (isAlreadySelected) {
                        selectedH3Indices.delete(info.object);
                    }
                    else {
                        //if there is already a hexagon selected, remove it
                        if (selectedH3Indices.size > 0) {
                            selectedH3Indices.clear();
                        }
                        selectedH3Indices.add(info.object);
                    }
                    // Set is a mutable data structure so modifying won't trigger a state update
                    // so you have to create a new one - https://stackoverflow.com/questions/58806883/how-to-use-set-with-reacts-usestate
                    onHexClick(new Set(selectedH3Indices));
                },
            }),
        ];
    }
    else {
        layers = [];
    }
    return ((0, jsx_runtime_1.jsx)(typed_1.default, Object.assign({ style: { position: "relative" }, height: HEIGHT, width: WIDTH, initialViewState: viewState, onViewStateChange: ({ viewState }) => setViewState(viewState), controller: true, layers: layers }, { children: (0, jsx_runtime_1.jsx)(react_map_gl_1.default, { mapboxApiAccessToken: token, mapStyle: "mapbox://styles/mapbox/dark-v10" }) })));
};
Map.propTypes = {
    selectedH3Indices: prop_types_1.object,
};
exports.default = Map;
