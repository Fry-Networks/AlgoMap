import { useState } from "react";
import { h3SetToMultiPolygon } from "h3-js";
import MapWindow from "./MapWindow";
import { Row, Col, Container } from "reactstrap";

import Map from "./Map";
import { getGeoJson } from "./Map/utility";
import GeoJSONInput from "./GeoJSONInput";
import MapGL, {Source, Layer} from 'react-map-gl';

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
  const points = jsonData.data.map((d) => [d.location.lng, d.location.lat]);
  //create a heat map of the points
  const maxZoom = 15;
  const data = points.map((p) => ({
    position: [p[0], p[1]],
    weight: 1,
  }));
console.log(data);
console.log(Source)
  return (
    <div className="App">
      <Row>
        <Col>
          <Map
            onHexClick={setH3Indices}
            selectedH3Indices={h3Indices}
            points={points}
          >
            {data && (
              <Source type="geojson" data={data}>
                <Layer
                  {...{
                    id: "heatmap",
                    type: "heatmap",
                    paint: {
                      // Increase the heatmap weight based on frequency and property magnitude
                      "heatmap-weight": [
                        "interpolate",
                        ["linear"],
                        ["get", "mag"],
                        0,
                        0,
                        6,
                        1,
                      ],
                      // Increase the heatmap color weight weight by zoom level
                      // heatmap-intensity is a multiplier on top of heatmap-weight
                      "heatmap-intensity": [
                        "interpolate",
                        ["linear"],
                        ["zoom"],
                        0,
                        1,

                        3,
                      ],
                      // Color ramp for heatmap.  Domain is 0 (low) to 1 (high).
                      // Begin color ramp at 0-stop with a 0-transparancy color
                      // to create a blur-like effect.
                      "heatmap-color": [
                        "interpolate",
                        ["linear"],
                        ["heatmap-density"],
                        0,
                        "rgba(33,102,172,0)",
                        0.2,
                        "rgb(103,169,207)",
                        0.4,
                        "rgb(209,229,240)",
                        0.6,
                        "rgb(253,219,199)",
                        0.8,
                        "rgb(239,138,98)",
                        0.9,
                        "rgb(255,201,101)",
                      ],
                      // Adjust the heatmap radius by zoom level
                      "heatmap-radius": [
                        "interpolate",
                        ["linear"],
                        ["zoom"],
                        0,
                        2,
                        20,
                      ],
                      // Transition from heatmap to circle layer by zoom level
                      "heatmap-opacity": [
                        "interpolate",
                        ["linear"],
                        ["zoom"],
                        7,
                        1,
                        9,
                        0,
                      ],
                    },
                  }}
                />
              </Source>
            )}
          </Map>
          <MapWindow selectedH3Indices={h3Indices}>
            <h2>Window Title</h2>
            <p>Some content</p>
          </MapWindow>
        </Col>
      </Row>
    </div>
  );
};

export default App;
