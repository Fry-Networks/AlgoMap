import "./MapWindow.scss";
import { geoToH3 } from "h3-js";
import jsonData from "../testdata.json";
import { useState } from "react";
import { PointData } from "App";

type MapWindowProps = {
  selectedH3Indices: Set<string>;
  pointsData: PointData[];
};

const MapWindow: React.FC<MapWindowProps> = ({ selectedH3Indices, pointsData }) => {
  console.log("pointsData", pointsData);

  const [selectedRate, setSelectedRate] = useState("five");

  const bytesToMbits = (bytes: number) => {
    return bytes / 125000; // 1 byte = 0.008 Mbits, so divide by 125000 to get Mbits
  };

  const getBandwidth = (point: PointData, key: string) => {
    switch (key) {
      case "five":
        return point.five;
      case "sevendays":
        return point.sevendays;
      case "fourteendays":
        return point.fourteendays;
      case "month":
        return point.month;
      default:
        return point.five;
    }
  };

  if (selectedH3Indices.size > 0) {
    const selectedPoint = pointsData.filter((point) =>
      selectedH3Indices.has(geoToH3(point.lat, point.lon, 8))
    );

    return (
      <div className="MapWindow">
        <div className="blurry"></div>
        <div className="data">
          <h2>Selected Hex ({Array.from(selectedH3Indices).join(', ')})</h2>
          <ul className="check-list">
            {selectedPoint.map((point) => {
              const h3id = geoToH3(point.lat, point.lon, 8);
              const bandwidth = getBandwidth(point, selectedRate); // Use the getBandwidth function here


              return (
                <li key={h3id}>
                  <div className="point-box">
                    <h3>Point: {h3id}</h3>
                    <p>Download: {bytesToMbits(bandwidth.rx)} Mbits</p>
                    <p>Upload: {bytesToMbits(bandwidth.tx)} Mbits</p>
                    <div className="rate-buttons">
                      <div className="rate-buttons">
                        <button
                          className={selectedRate === "five" ? "selected" : ""}
                          onClick={() => setSelectedRate("five")}
                        >
                          5 mins
                        </button>
                        <button
                          className={selectedRate === "sevendays" ? "selected" : ""}
                          onClick={() => setSelectedRate("sevendays")}
                        >
                          7 days
                        </button>
                        <button
                          className={selectedRate === "fourteendays" ? "selected" : ""}
                          onClick={() => setSelectedRate("fourteendays")}
                        >
                          14 days
                        </button>
                        <button
                          className={selectedRate === "month" ? "selected" : ""}
                          onClick={() => setSelectedRate("month")}
                        >
                          1 month
                        </button>
                      </div>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    );
  }
  return (
    <div className="MapWindow">
      <div className="blurry"></div>
      <div className="data">
        <h2>Nothing has been selected</h2>
      </div>
    </div>
  );
};

export default MapWindow;