import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import "./MapWindow.scss";
import { geoToH3 } from "h3-js";
import jsonData from "../testdata.json";
const MapWindow = ({ selectedH3Indices }) => {
    //selectedH3Indices is a Set
    if (selectedH3Indices.size > 0) {
        const points = jsonData.data.map((d) => [
            d.location.lat,
            d.location.lng,
            { ip: d.ip, upload: d.bandwidth.upload, download: d.bandwidth.download },
        ]);
        const selectedPoint = points.filter((point) => 
        //point is an array of lat and long, make sure that the lat and long are in the selectedH3Indices
        selectedH3Indices.has(geoToH3(point[0], point[1], 8)));
        return (_jsxs("div", Object.assign({ className: "MapWindow" }, { children: [_jsx("div", { className: "blurry" }), _jsxs("div", Object.assign({ className: "data" }, { children: [_jsxs("h2", { children: ["Selected Hex (", selectedH3Indices, ")"] }), _jsx("ul", Object.assign({ className: "check-list" }, { children: selectedPoint.map((point) => {
                                //get the bandwidth for each point
                                const { ip, upload, download } = point[2];
                                return (_jsxs("li", { children: [ip, " - \u2B06 ", upload, " mbits/s  \u2B07:", download, " mbits/s"] }, ip));
                            }) }))] }))] })));
    }
    return (_jsxs("div", Object.assign({ className: "MapWindow" }, { children: [_jsx("div", { className: "blurry" }), _jsx("div", Object.assign({ className: "data" }, { children: _jsx("h2", { children: "Nothing has been selected" }) }))] })));
};
export default MapWindow;
