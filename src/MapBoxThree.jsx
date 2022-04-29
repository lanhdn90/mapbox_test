import mapboxgl from "!mapbox-gl"; // eslint-disable-line import/no-webpack-loader-syntax
import React, { useEffect, useRef, useState } from "react";
import { convertData } from "./commont";
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
        title: "128 CMT8",
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
        title: "14 Tran Tu Binh",
        description: "A northside park that is home to the Lincoln Park Zoo",
      },
      geometry: {
        coordinates: [108.19971, 15.99413],
        type: "Point",
      },
    },
    {
      type: "Feature",
      properties: {
        title: "193 Nguyen Luong Bang",
        description: "A northside park that is home to the Lincoln Park Zoo",
      },
      geometry: {
        coordinates: [108.147060, 16.079700],
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

  const start = [108.20746, 16.05902];
  useEffect(() => {
    assetList.map((feature) =>
      new mapboxgl.Marker()
        .setLngLat(feature.geometry.coordinates)
        .setPopup(
          new mapboxgl.Popup().setHTML(`<h1>${feature.properties.title}</h1>`)
        )
        .addTo(map.current)
    );

    async function getRoute(end) {
      // thực hiện yêu cầu chỉ đường bằng cách sử dụng hồ sơ đi xe đạp
      // một khởi đầu tùy ý sẽ luôn giống nhau
      // chỉ điểm cuối hoặc điểm đến mới thay đổi
      const query = await fetch(
        // `https://api.mapbox.com/directions/v5/mapbox/driving/${end}?steps=true&geometries=geojson&access_token=${mapboxgl.accessToken}`,
        `https://api.mapbox.com/directions/v5/mapbox/driving-traffic/${end}?steps=true&geometries=geojson&access_token=${mapboxgl.accessToken}`,
        { method: "GET" }
      );
      const json = await query.json();
      const data = json.routes[0];
      const route = data.geometry.coordinates;
      const geojson = {
        type: "Feature",
        properties: {},
        geometry: {
          type: "LineString",
          coordinates: route,
        },
      };
      // nếu tuyến đường đã tồn tại trên bản đồ, chúng tôi sẽ đặt lại nó bằng cách sử dụng setData
      if (map.current.getSource("route")) {
        map.current.getSource("route").setData(geojson);
      }
      // nếu không, chúng tôi sẽ đưa ra một yêu cầu mới
      else {
        map.current.addLayer({
          id: "route",
          type: "line",
          source: {
            type: "geojson",
            data: geojson,
          },
          layout: {
            "line-join": "round",
            "line-cap": "round",
          },
          paint: {
            "line-color": "#3887be",
            "line-width": 5,
            "line-opacity": 0.75,
          },
        });
      }
      // thêm hướng dẫn rẽ vào đây ở cuối
    }
    map.current.on("load", () => {
      // thực hiện yêu cầu chỉ đường ban đầu
      // bắt đầu và kết thúc tại cùng một vị trí
      getRoute(convertData(start, assetList));
    });
  }, [assetList]);

  useEffect(() => {
    map.current.on("load", () => {
      map.current.addLayer({
        id: "car",
        type: "circle",
        source: {
          type: "geojson",
          data: {
            type: "FeatureCollection",
            features: [
              {
                type: "Feature",
                properties: {},
                geometry: {
                  type: "Point",
                  coordinates: start,
                },
              },
            ],
          },
        },
        paint: {
          "circle-radius": 10,
          "circle-color": "#3887be",
        },
      });
    });
  }, [start]);

  return (
    <div>
      <div
        ref={mapContainer}
        className="map-container"
        // style={{ height: "100vh", width: "100vw" }}
        style={{ height: "400px", width: "600px" }}
      />
    </div>
  );
}

export default MapBoxThree;
