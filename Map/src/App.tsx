import { useEffect, useState } from "react";
import MapWindow from "./MapWindow";
import { Row, Col } from "reactstrap";
import Map from "./Map";
import jsonData from "./testdata.json";
import config from "./config.json";
import ReactDOM from "react-dom";
import React from "react";
import axios from 'axios';
import './App.css'; // Import the CSS file

interface H3Indice { }

const App = () => {
  const [selectedH3Indices, setH3Indices] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null); // Add a state to track errors
  const [hideWaitingScreen, setHideWaitingScreen] = useState(false); // Add the new state

  const baseurl = config.baseurl;
  const [pointsData, setPointsData] = useState<PointData[]>([]);
  const [points, setPoints] = useState([[1]]);

  const fetchPoints = async () => {
    try {
      console.log(isLoading)
      const response = await axios.get(baseurl + '/points');
      const data: PointData[] = response.data;
      setPointsData(response.data);
      const points = data.map((d) => [d.lat, d.lon]);
      setPoints(points);

      if (points) {
        setIsLoading(false);
        setError(null);
        setTimeout(() => setHideWaitingScreen(true), 500); // Trigger the fade effect
      }
      setError(null); // Reset error state when data is fetched successfully
    } catch (error: any) {
      console.error('Error fetching points:', error);
      setError(error); // Set error state when an error occurs
    }
  };

  useEffect(() => {
    fetchPoints();

    const interval = setInterval(() => {
      fetchPoints();
    }, 300000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="App">
      {isLoading && !hideWaitingScreen && <div className="waiting-screen">Loading...</div>}
      {error && (
        <div className="error-screen">
          <p>Error fetching points. Please try again.</p>
          <button onClick={fetchPoints}>Retry</button>
        </div>
      )}
      {!isLoading && !error && (
        <Row>
          <Col>
            <Map
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
      )}
    </div>
  );
};

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);

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
