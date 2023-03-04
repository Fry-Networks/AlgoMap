import { useState } from "react";
import { h3SetToMultiPolygon } from "h3-js";
import MapWindow from './MapWindow';
import { Row, Col, Container } from "reactstrap";

import Map from "./Map";
import { getGeoJson } from "./Map/utility";
import GeoJSONInput from "./GeoJSONInput";
const App = () => {
  const [h3Indices, setH3Indices] = useState(new Set());

  const coordinates = h3SetToMultiPolygon(Array.from(h3Indices), true);
  const geoJson = getGeoJson(coordinates);
  //my data is in a json file
  const jsonData = require("./testdata.json");
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
  const points = jsonData.data.map((d) => [d.location.lat, d.location.lng]);

  return (
    <div className="App">
      <Row>
        <Col>
          <Map
            onHexClick={setH3Indices}
            selectedH3Indices={h3Indices}
            points={points}
          />
          <MapWindow
          selectedH3Indices={h3Indices}
          >
            <h2>Window Title</h2>
            <p>Some content</p>
          </MapWindow>
        </Col>
      </Row>
    </div>
  );
};

export default App;
