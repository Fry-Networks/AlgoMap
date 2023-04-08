import { useEffect, useState } from "react";
import MapWindow from "./MapWindow";
import { Row, Col } from "reactstrap";
import Map from "./Map";
import jsonData from "./testdata.json";
import config from "./config.json";
import ReactDOM from "react-dom";
import React from "react";
import axios from 'axios';
interface H3Indice {}

const App = () => {
  const [selectedH3Indices, setH3Indices] = useState(new Set());

  //const points = jsonData.data.map((d) => [d.location.lat, d.location.lng]);
  const baseurl = config.baseurl;
  const [pointsData, setPointsData] = useState<PointData[]>([]);
  const [points, setPoints] = useState([[1]]);

  useEffect(() => {
    const fetchPoints = async () => {
      try {
        const response = await axios.get(baseurl + '/points');
        const data: PointData[] = response.data;
        setPointsData(response.data); // Assuming the API returns an array of points
        console.log("pointsData", pointsData);
        const points = data.map((d) => [d.lat, d.lon]);
        setPoints(points);
      } catch (error) {
        console.error('Error fetching points:', error);
      }
    };

    fetchPoints();

    //refetch them every 5 mins

    const interval = setInterval(() => {
      fetchPoints();
    }
      , 300000);

    return () => clearInterval(interval);
  }, []); // Passing an empty array as dependency to make sure this effect runs only once on component mount



  //@ts-ignore
  return ( <div className="App"><Row><Col><Map
            {...{
              onHexClick: setH3Indices,
              selectedH3Indices: selectedH3Indices,
              points: points,
          
            }}
          ></Map>
          <MapWindow {...{ selectedH3Indices, pointsData }}>
            <h2>Window Title</h2>
            <p>Some content</p>
          </MapWindow>
        </Col>
      </Row>
    </div>
  );
};


ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
)


export default App;

export interface PointData {
  lat: number;
  lon: number;
  hwid: string;
  five: {
    rx: number;
    tx: number;
  };
  sevendays: {
    rx: number;
    tx: number;
  };
  fourteendays: {
    rx: number;
    tx: number;
  };
  month: {
    rx: number;
    tx: number;
  };
  total: {
    rx: number;
    tx: number;
  };
}