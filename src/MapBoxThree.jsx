import mapboxgl from "!mapbox-gl"; // eslint-disable-line import/no-webpack-loader-syntax
import React, { useEffect, useRef, useState } from "react";
mapboxgl.accessToken =
  "pk.eyJ1IjoibGFuaGRuOTAiLCJhIjoiY2wyYTYza3N5MDFvZTNibzJrZ2ppcDE2aCJ9.2fZveTirvuQBrh_f8bVIPA";
function MapBoxThree(props) {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [lng, setLng] = useState(108.20746);
  const [lat, setLat] = useState(16.05902);
  const [zoom, setZoom] = useState(12);

  const assetList = [
    {
      type: "Feature",
      properties: {
        title: "Lincoln Park 1",
        description: "A northside park that is home to the Lincoln Park Zoo",
      },
      geometry: {
        coordinates: [108.21248, 16.02153],
        type: "Point",
      },
    },
    {
      type: "Feature",
      properties: {
        title: "Lincoln Park 2",
        description: "A northside park that is home to the Lincoln Park Zoo",
      },
      geometry: {
        coordinates: [108.19971, 15.99413],
        type: "Point",
      },
    },
  ];

  useEffect(() => {
    if (map.current) return; // initialize map only once
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [lng, lat],
      zoom: zoom,
    });
  });
  
  useEffect(() => {
    if (!map.current) return; // wait for map to initialize
    map.current.on("move", () => {
      setLng(map.current.getCenter().lng.toFixed(4));
      setLat(map.current.getCenter().lat.toFixed(4));
      setZoom(map.current.getZoom().toFixed(2));
    });
  });

  useEffect(() => {
    assetList.map((feature) =>
      new mapboxgl.Marker()
        .setLngLat(feature.geometry.coordinates)
        .setPopup(
          new mapboxgl.Popup().setHTML(`<h1>${feature.properties.title}</h1>`)
        )
        .addTo(map.current)
    );
  }, [assetList]);

  return (
    <div>
      <div
        ref={mapContainer}
        className="map-container"
        style={{ height: "100vh", width: "100vw" }}
        // style={{ height: "400px", width: "600px" }}
      />
    </div>
  );
}

export default MapBoxThree;
