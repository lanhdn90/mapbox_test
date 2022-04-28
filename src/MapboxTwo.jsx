import mapboxgl from "!mapbox-gl"; // eslint-disable-line import/no-webpack-loader-syntax
import React, { useEffect, useRef, useState } from "react";
mapboxgl.accessToken =
  "pk.eyJ1IjoibGFuaGRuOTAiLCJhIjoiY2wyYTYza3N5MDFvZTNibzJrZ2ppcDE2aCJ9.2fZveTirvuQBrh_f8bVIPA";
function MapboxTwo(props) {
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
    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [lng, lat],
      zoom: zoom,
    });

    const start = [108.20746, 16.05902];

    async function getRoute(end) {
      // thực hiện yêu cầu chỉ đường bằng cách sử dụng hồ sơ đi xe đạp
      // một khởi đầu tùy ý sẽ luôn giống nhau
      // chỉ điểm cuối hoặc điểm đến mới thay đổi
      const query = await fetch(
        `https://api.mapbox.com/directions/v5/mapbox/driving-traffic/${start[0]},${start[1]};${end[0]},${end[1]}?steps=true&geometries=geojson&access_token=${mapboxgl.accessToken}`,
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
      if (map.getSource("route")) {
        map.getSource("route").setData(geojson);
      }
      // nếu không, chúng tôi sẽ đưa ra một yêu cầu mới
      else {
        map.addLayer({
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

    map.on("load", () => {
      // thực hiện yêu cầu chỉ đường ban đầu
      // bắt đầu và kết thúc tại cùng một vị trí
      getRoute(start);
      assetList.map((feature) =>
        new mapboxgl.Marker()
          .setLngLat(feature.geometry.coordinates)
          .setPopup(
            new mapboxgl.Popup().setHTML(`<h1>${feature.properties.title}</h1>`)
          )
          .addTo(map)
      );
      // Thêm điểm xuất phát vào bản đồ
      map.addLayer({
        id: "point",
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
      // đây là nơi mã từ bước tiếp theo sẽ chuyển đến
    });

    map.on("click", (event) => {
      const coords = Object.keys(event.lngLat).map((key) => event.lngLat[key]);
      const end = {
        type: "FeatureCollection",
        features: [
          {
            type: "Feature",
            properties: {},
            geometry: {
              type: "Point",
              coordinates: coords,
            },
          },
        ],
      };
      if (map.getLayer("end")) {
        map.getSource("end").setData(end);
      } else {
        map.addLayer({
          id: "end",
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
                    coordinates: coords,
                  },
                },
              ],
            },
          },
          paint: {
            "circle-radius": 10,
            "circle-color": "#f30",
          },
        });
      }
      getRoute(coords);
    });
    return () => map.remove();
  });

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

export default MapboxTwo;
