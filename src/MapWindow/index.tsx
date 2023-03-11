import "./MapWindow.scss";
import { geoToH3 } from "h3-js";
import jsonData from "../testdata.json";

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

type PointData = {
  ip: string;
  upload: number;
  download: number;
};
const MapWindow = ({ selectedH3Indices }: any) => {
  //selectedH3Indices is a Set
  console.log(selectedH3Indices);
  if (selectedH3Indices.size > 0) {
    const points = jsonData.data.map((d) => [
      d.location.lat,
      d.location.lng,
      { ip: d.ip, upload: d.bandwidth.upload, download: d.bandwidth.download },
    ]);
    console.log("selectedH3Indices", selectedH3Indices);

    const selectedPoint = points.filter((point) =>
      //point is an array of lat and long, make sure that the lat and long are in the selectedH3Indices
      selectedH3Indices.has(geoToH3(point[0] as number, point[1] as number, 8))
    );

    console.log("selectedPoint", selectedPoint);
    return (
      <div className="MapWindow">
        <div className="blurry"></div>
        <div className="data">
          <h2>Selected Hex ({selectedH3Indices})</h2>
          <ul className="check-list">
            {selectedPoint.map((point) => {
              //get the bandwidth for each point
              const { ip, upload, download } = point[2] as PointData;
              return (
                <li key={ip}>
                  {ip} - ⬆ {upload} mbits/s  ⬇:{download} mbits/s
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
