import DeckGL from "@deck.gl/react/typed";
import { H3HexagonLayer } from "@deck.gl/geo-layers/typed";
import { HeatmapLayer } from "@deck.gl/aggregation-layers/typed";
import { useEffect, useState } from "react";
import { object } from "prop-types";
//@ts-ignore
import mapboxgl from 'mapbox-gl/dist/mapbox-gl-csp';
//@ts-ignore
// eslint-disable-next-line import/no-webpack-loader-syntax
import MapboxWorker from 'worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker';


import { bboxFromViewport, getH3IndicesForBB } from "./utility";
import { PickingInfo } from "@deck.gl/core/typed";
import { geoToH3 } from "h3-js";
import ReactMapGL from 'react-map-gl';
// const token = process.env.REACT_APP_MAPBOX_TOKEN
const token =
  "REDACTED_ROTATE_ME";

//make the map full screen, not only the inner part
const HEIGHT = window.innerHeight;
const WIDTH = window.innerWidth;
let firstRender = true;
// Viewport settings for Conservatory of Flowers
const INITIAL_VIEW_STATE = {
  longitude: -1.98313,
  latitude: 48.66777,
  zoom: 8,
  height: HEIGHT,
  width: WIDTH,
};

mapboxgl.workerClass = MapboxWorker; // Wire up loaded worker to be used instead of the default
const Map = ({
  selectedH3Indices,
  onHexClick,
  points,
}: {
  selectedH3Indices: Set<string>;
  onHexClick: (selectedH3Indices: Set<string>) => void;
  points: number[][];
}) => {
  let getTooltip;
  const [viewState, setViewState] = useState(INITIAL_VIEW_STATE);
  const [h3Indices, setH3Indices] = useState([]);
  const [layers, setLayers] = useState([{}]);
  const [heatmapPoints, setHeatmapPoints] = useState([[0]]);

 


  const renderLayers = () => {
    const boundingBox = bboxFromViewport(viewState);
    setH3Indices(getH3IndicesForBB(boundingBox, 8, points));

    setHeatmapPoints(points.map((point) => [point[1], point[0] ]));
    console.log("effect")
    setLayers([
      new H3HexagonLayer({
        id: "h3-hexagon-layer",
        data: h3Indices,
        wireframe: true,
        autoHighlight: true,
        pickable: true,
        cellSide: 100,
        filled: true,
        extruded: true,
        elevationScale: 0,
        getHexagon: (d) => d,
        getLineColor: [0, 0, 0],
        getFillColor: (d) => {
          const isSelected = selectedH3Indices.has(d);
          // rgba - rgb=0, but a=1 to make the hex clickable
          return isSelected ? [242, 141, 59, 50] : [139, 211, 71, 50];
        },
        opacity: 1,
        onClick: (info) => {
          console.log(info);
          const isAlreadySelected = selectedH3Indices.has(info.object);
          if (isAlreadySelected) {
            selectedH3Indices.delete(info.object);
          } else {
            //if there is already a hexagon selected, remove it
            if (selectedH3Indices.size > 0) {
              selectedH3Indices.clear();
            }
            selectedH3Indices.add(info.object);
          }
          onHexClick(new Set(selectedH3Indices));
        },
      }),
      
      new HeatmapLayer({
        id: "heatmapLayer",
        data: heatmapPoints,
        getPosition: (d) => {
          console.log(d)
          return d;
        },
        getWeight: 1,
        visible: viewState.zoom < 11,
        aggregation: "SUM",
        intensity: 1,
        radiusPixels: 20,
        debounceTimeout: 500,
        colorRange: [
          [0, 0, 0, 0],
          //green 
          [139, 211, 71, 255],
          //orange

        ],
      }),
    

    ]);
  };
  //if the zoom level is too low, don't show the hexagons
  useEffect(() => {
    renderLayers();
  }, [points]);

    //@ts-ignore
  if (layers[0].props?.data.length == 0) renderLayers();




  getTooltip = (info: PickingInfo) => {
    if (info.object) {
      const pointsInHex = points.filter((point) => {
        const h3Index = geoToH3(point[0], point[1], 8);
        return h3Index === info.object;
      });
      return {
        html: `<div>
          <h5>${pointsInHex.length} miner${pointsInHex.length > 1 ? 's' : ''} in hexagon</h5>
          </div>`,
      };
    }
    return null;
  };
  return (
    <DeckGL
      height={HEIGHT}
      width={WIDTH}

      initialViewState={viewState}
      onViewStateChange={({ viewState }) => setViewState(viewState as any)}
      controller={{
        scrollZoom: {
          smooth: true,
        }
      }}
      layers={layers as any}

      
    // getTooltip={getTooltip}
    >

      <ReactMapGL
        {...{
          mapboxAccessToken: token,
          mapStyle: "mapbox://styles/mapbox/dark-v10?optimize=true",
        }}
      />

    </DeckGL>
  );
};

Map.propTypes = {
  selectedH3Indices: object,
};

export default Map;
/*
  <ReactMapGL
        {...{
          mapboxAccessToken: token,
          scrollZoom: false,
          mapStyle: "mapbox://styles/mapbox/dark-v10?optimize=true",
        }}
      />
      */