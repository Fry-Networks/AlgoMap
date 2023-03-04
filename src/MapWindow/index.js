import React from "react";
import "./MapWindow.css";
import { polyfill, geoToH3, h3ToParent } from "h3-js";
const jsonData = require("../testdata.json");

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
const MapWindow = ({ selectedH3Indices }) => {
  //selectedH3Indices is a Set
  console.log(selectedH3Indices);
  if (selectedH3Indices.size > 0) {
    const points = jsonData.data.map((d) => [d.location.lat, d.location.lng]);
    console.log("selectedH3Indices", selectedH3Indices);

    const selectedPoints = points.filter((point) =>
      //point is an array of lat and long, make sure that the lat and long are in the selectedH3Indices
      selectedH3Indices.has(geoToH3(point[0], point[1], 8))
    );
    console.log(selectedPoints);
    return (
      <div className="MapWindow">
        <h2>Selected Points</h2>
        <ul>
          {selectedPoints.map((point) => {
            //get the bandwidth for each point
            const data = jsonData.data.filter(
              (d) => d.location.lat === point[0] && d.location.lng === point[1]
            )[0];
            const ip = data.ip;
            const upload = data.bandwidth.upload;
            const download = data.bandwidth.download;
            return (
              <li key={ip}>
                {ip} - Up: {upload} - Down:{download}
              </li>
            );
          })}
        </ul>
      </div>
    );
  }
  return (
    <div className="MapWindow">
      <div className="blurry"> </div>
      <div className="data">
        <h2>Nothing has been selected</h2>
      </div>
    </div>
  );
};

export default MapWindow;
