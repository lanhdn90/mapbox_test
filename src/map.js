mapboxgl.accessToken =
  "pk.eyJ1IjoibGFuaGRuOTAiLCJhIjoiY2wyYTYza3N5MDFvZTNibzJrZ2ppcDE2aCJ9.2fZveTirvuQBrh_f8bVIPA";
const map = new mapboxgl.Map({
  container: "map",
  style: "mapbox://styles/mapbox/streets-v11",
  center: [-122.662323, 45.523751], // điểm xuất phát
  zoom: 12,
});
// thiết lập các giới hạn của bản đồ
const bounds = [
  [-123.069003, 45.395273],
  [-122.303707, 45.612333],
];
map.setMaxBounds(bounds);

// một khởi đầu tùy ý sẽ luôn giống nhau
// chỉ điểm cuối hoặc điểm đến mới thay đổi
const start = [-122.662323, 45.523751];

// đây là nơi mã cho bước tiếp theo sẽ đi

// tạo một hàm để thực hiện yêu cầu chỉ đường
async function getRoute(end) {
  // thực hiện yêu cầu chỉ đường bằng cách sử dụng hồ sơ đi xe đạp
  // một khởi đầu tùy ý sẽ luôn giống nhau
  // chỉ điểm cuối hoặc điểm đến mới thay đổi
  const query = await fetch(
    `https://api.mapbox.com/directions/v5/mapbox/cycling/${start[0]},${start[1]};${end[0]},${end[1]}?steps=true&geometries=geojson&access_token=${mapboxgl.accessToken}`,
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
