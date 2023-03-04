import DeckGL from "@deck.gl/react/typed";
import ReactMapGL from "react-map-gl";
import { H3HexagonLayer } from "@deck.gl/geo-layers/typed";
import { useState } from "react";
import { object } from "prop-types";

import { bboxFromViewport, getH3IndicesForBB } from "./utility";
import { PickingInfo, LayersList } from "@deck.gl/core/typed";

// const token = process.env.REACT_APP_MAPBOX_TOKEN
const token =
  "REDACTED_ROTATE_ME";

//make the map full screen, not only the inner part
const HEIGHT = window.innerHeight;
const WIDTH = window.innerWidth;
// Viewport settings for Conservatory of Flowers
const INITIAL_VIEW_STATE = {
  longitude: -1.98313,
  latitude: 48.66777,
  zoom: 18,
  height: HEIGHT,
  width: WIDTH,
};

const Map = ({ selectedH3Indices, onHexClick, points }: any) => {
  let layers:
    | H3HexagonLayer<
        any,
        {
          id: "h3-hexagon-layer";
          data: any;
          pickable: true;
          wireframe: true;
          cellSide: number;
          filled: true;
          extruded: true;
          elevationScale: 0;
          getHexagon: (d: any) => any;
          autoHighlight: true;
          getLineColor: [number, number, number];
          getFillColor: (d: any) => [number, number, number, number];
          opacity: 1;
          onClick: (info: PickingInfo) => void;
        }
      >[]
    | LayersList
    | undefined = [];
  const [viewState, setViewState] = useState(INITIAL_VIEW_STATE);
  if (viewState.zoom > 11) {
    const boundingBox = bboxFromViewport(viewState);
    const h3Indices = getH3IndicesForBB(boundingBox, 8, points);
    //if the zoom level is too low, don't show the hexagons
    console.log("h3Indices", h3Indices);
    layers = [
      new H3HexagonLayer({
        id: "h3-hexagon-layer",
        data: h3Indices,
        pickable: true,
        wireframe: true,
        cellSide: 100,
        filled: true,
        extruded: true,
        elevationScale: 0,
        getHexagon: (d) => d,
        autoHighlight: true,
        getLineColor: [0, 0, 0],
        getFillColor: (d) => {
          const isSelected = selectedH3Indices.has(d);
          // rgba - rgb=0, but a=1 to make the hex clickable
          return isSelected ? [242, 141, 59, 50] : [139, 211, 71, 50];
        },
        opacity: 1,
        //   onHover: (info) => console.log("hover", info),
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

          // Set is a mutable data structure so modifying won't trigger a state update
          // so you have to create a new one - https://stackoverflow.com/questions/58806883/how-to-use-set-with-reacts-usestate
          onHexClick(new Set(selectedH3Indices));
        },
      }),
    ];
  } else {
    layers = [];
  }

  return (
    <DeckGL
      style={{ position: "relative" }}
      height={HEIGHT}
      width={WIDTH}
      initialViewState={viewState}
      onViewStateChange={({ viewState }) => setViewState(viewState as any)}
      controller={true}
      layers={layers}
    >
      <ReactMapGL
        mapboxApiAccessToken={token}
        mapStyle="mapbox://styles/mapbox/dark-v10"
      />
    </DeckGL>
  );
};

Map.propTypes = {
  selectedH3Indices: object,
};

export default Map;
