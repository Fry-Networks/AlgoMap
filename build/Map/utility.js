"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getGeoJson = exports.getH3IndicesForBB = exports.bboxFromViewport = void 0;
const viewport_mercator_project_1 = __importDefault(require("viewport-mercator-project"));
const h3_js_1 = require("h3-js");
/**
 * Taken from https://stackoverflow.com/questions/56646664/how-can-i-get-the-h3-hexagons-on-a-react-map-gl-deck-gl-viewport
 *
 * @param {Object} viewport
 *
 * @returns - bounding box for the given viewport
 */
function bboxFromViewport(viewport) {
    const projection = new viewport_mercator_project_1.default(viewport);
    //@ts-ignore
    const { height, width } = viewport;
    const [west, north] = projection.unproject([0, 0]);
    const [east, south] = projection.unproject([width, height]);
    return { north, south, east, west };
}
exports.bboxFromViewport = bboxFromViewport;
/**
 *
 * @param {Object} - bounding box dimensions
 * @param {Number} resolution - resolution of hexagons
 
* @returns - an array of h3 indices within the given bounding box
 */
function getH3IndicesForBB({ north, south, east, west }, resolution = 8, points) {
    const nw = [north, west];
    const ne = [north, east];
    const sw = [south, west];
    const se = [south, east];
    const hexes = (0, h3_js_1.polyfill)([nw, ne, se, sw], resolution);
    //const hexIndex = geoToH3(point[0], point[1], resolution);
    const hexIndexes = points.map((point) => (0, h3_js_1.geoToH3)(point[0], point[1], resolution));
    return hexIndexes;
}
exports.getH3IndicesForBB = getH3IndicesForBB;
/**
 *
 * @param {*} multipolygon
 * @returns
 */
function getGeoJson(multipolygon) {
    const geoJsonFormat = {
        type: "FeatureCollection",
        features: [
            {
                type: "Feature",
                properties: {},
                geometry: {
                    type: "MultiPolygon",
                    coordinates: multipolygon,
                },
            },
        ],
    };
    return JSON.stringify(geoJsonFormat);
}
exports.getGeoJson = getGeoJson;
