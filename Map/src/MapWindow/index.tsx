import "./MapWindow.scss";
import { geoToH3 } from "h3-js";
import jsonData from "../testdata.json";
import { useState } from "react";
import { PointData } from "App";
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
  type MapWindowProps = {
    selectedH3Indices: any; // Replace 'any' with the appropriate type if possible
    pointsData: PointData[];
  };
  
  const MapWindow: React.FC<MapWindowProps> = ({ selectedH3Indices, pointsData }) => {
  
  //selectedH3Indices is a Set
  console.log("pointsData", pointsData);
  if (selectedH3Indices.size > 0) {
    const points = pointsData.map((d) => {

      return {
        lat: d.lat,
        lon: d.lon,
        bandwidth: {
          five: d.five,
          sevendays: d.sevendays,
          fourteendays: d.fourteendays,
          month: d.month,
          total: d.total
        }
      }
    }
    );
    const selectedPoint = points.filter((point) =>
      //point is an array of lat and long, make sure that the lat and long are in the selectedH3Indices
      selectedH3Indices.has(geoToH3(point.lat as number, point.lon as number, 8))
    );


    return (
      <div className="MapWindow">
        <div className="blurry"></div>
        <div className="data">
          <h2>Selected Hex ({selectedH3Indices})</h2>
          <ul className="check-list">
            
            {selectedPoint.map((point) => {
              console.log("a");
              //get the bandwidth for each point
              const h3id = geoToH3(point.lat as number, point.lon as number, 8);
              return (
                <li key={h3id}>
                 ⬆ {point.bandwidth.sevendays.tx} mbits/s  ⬇:{point.bandwidth.sevendays.rx} mbits/s
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
