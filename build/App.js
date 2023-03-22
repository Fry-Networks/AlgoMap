import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import MapWindow from "./MapWindow";
import { Row, Col } from "reactstrap";
import Map from "./Map";
import jsonData from "./testdata.json";
const App = () => {
    const [selectedH3Indices, setH3Indices] = useState(new Set());
    const points = jsonData.data.map((d) => [d.location.lat, d.location.lng]);
    //@ts-ignore
    return (_jsx("div", Object.assign({ className: "App" }, { children: _jsx(Row, { children: _jsxs(Col, { children: [_jsx(Map, Object.assign({}, {
                        onHexClick: setH3Indices,
                        selectedH3Indices: selectedH3Indices,
                        points: points,
                    })), _jsxs(MapWindow, Object.assign({}, { selectedH3Indices }, { children: [_jsx("h2", { children: "Window Title" }), _jsx("p", { children: "Some content" })] }))] }) }) })));
};
export default App;
