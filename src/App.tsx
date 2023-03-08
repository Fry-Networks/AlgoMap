import { useState } from "react";
import { H3IndexInput, h3SetToMultiPolygon } from "h3-js";
import MapWindow from "./MapWindow";
import { Row, Col, Container } from "reactstrap";
import Map from "./Map";
import { getGeoJson } from "./Map/utility";
import { Source, Layer, LayerProps } from "react-map-gl";
import jsonData from "./testdata.json";
interface H3Indice {}

const App = () => {
  const [selectedH3Indices, setH3Indices] = useState(new Set());

  const coordinates = h3SetToMultiPolygon(
    Array.from(selectedH3Indices) as H3IndexInput[],
    true
  );
  const geoJson = getGeoJson(coordinates);

  const points = jsonData.data.map((d) => [d.location.lat, d.location.lng]);

  const data = {
    type: "FeatureCollection",
    features: points.map((point) => ({
      type: "Feature",
      properties: { mag: 1 },
      geometry: { type: "Point", coordinates: [point[1], point[0]] },
    })),
  };

  console.log(data);
  //@ts-ignore
  return ( <div className="App"><Row><Col><Map
            {...{
              onHexClick: setH3Indices,
              selectedH3Indices: selectedH3Indices,
              points: points,
            }}
          ></Map>
          <MapWindow {...{ selectedH3Indices }}>
            <h2>Window Title</h2>
            <p>Some content</p>
          </MapWindow>
        </Col>
      </Row>
    </div>
  );
};

export default App;
