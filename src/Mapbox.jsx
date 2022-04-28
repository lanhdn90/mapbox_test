import React, { useState } from "react";
import ReactMapGL, { Marker } from "react-map-gl";
import Map from "react-map-gl";
function Mapbox() {
  const [viewport, setViewport] = useState({
    latitude: 16.05902,
    longitude: 108.20746,
    zoom: 13,
  });
  return (
    <Map
      {...viewport}
      mapStyle="mapbox://styles/mapbox/streets-v11"
      style={{ width: 600, height: 400 }}
      onViewportChange={(viewport) => {
        setViewport(viewport);
        console.log(
          "Log: ~ file: Mapbox.jsx ~ line 16 ~ Mapbox ~ viewport",
          viewport
        );
      }}
      // onMove={(evt) => setViewport(evt.viewState)}
      mapboxApiAccessToken="pk.eyJ1IjoibGFuaGRuOTAiLCJhIjoiY2wyYTYza3N5MDFvZTNibzJrZ2ppcDE2aCJ9.2fZveTirvuQBrh_f8bVIPA"
    />
    //   <Marker
    //     latitude={viewport.latitude}
    //     longitude={viewport.longitude}
    //     // offset={-20}
    //     anchor="bottom"
    //     draggable={true}
    //   >
    //     <div>hello</div>
    //   </Marker>
    // </Map>
  );
}

export default Mapbox;
