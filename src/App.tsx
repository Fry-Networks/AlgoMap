import { useState } from "react";
import MapWindow from "./MapWindow";
import { Row, Col } from "reactstrap";
import Map from "./Map";
import jsonData from "./testdata.json";
interface H3Indice {}

const App = () => {
  const [selectedH3Indices, setH3Indices] = useState(new Set());

  const points = jsonData.data.map((d) => [d.location.lat, d.location.lng]);


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
