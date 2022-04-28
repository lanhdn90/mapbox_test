import axios from "axios";
import "mapbox-gl/dist/mapbox-gl.css";
import React, { useEffect } from "react";
import "./App.css";
import MapBoxThree from "./MapBoxThree";
import MapboxTwo from "./MapboxTwo";
import TextMapBox from "./TestMaBox";
function App() {
  const addressData = [
    // {
    //   id: 1,
    //   address: "377 Nguyen Van Linh - Da Nang - Viet Nam",
    // },
    {
      id: 2,
      address: "128 Cach Mang Thang Tam - Da Nang - Viet Nam",
    },
    {
      id: 3,
      address: "14 Tran Tu Binh - Da Nang - Viet Nam",
    },
  ];

  const [newAddressMarker, setNewAddressMarker] = React.useState();

  React.useEffect(() => {
    let newAddress = [];
    (async () => {
      addressData.map((address) => {
        axios
          .get(
            `https://rsapi.goong.io/geocode?address=${address.address}&api_key=P5Mv9lHQknc0Bqk61702l8ic4SHlQkegNAo6qgAX`
          )
          .then(function (response) {
            // handle success
            newAddress.push({
              ...address,
              longitude: response.data.results[0].geometry.location.lng,
              latitude: response.data.results[0].geometry.location.lat,
            });
          })
          .catch(function (error) {
            // handle error
            console.log(error);
          })
          .then(function () {
            // always executed
          });
      });
    })();
    setNewAddressMarker(newAddress);
  }, []);

  return (
    <div className="App">
      {/* {newAddressMarker && (
        <TextMapBox
          newAddressMarker={newAddressMarker}
          setNewAddressMarker={setNewAddressMarker}
        />
      )} */}
      {/* <MapboxTwo /> */}
      <MapBoxThree/>
    </div>
  );
}

export default App;
