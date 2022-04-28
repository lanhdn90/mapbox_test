import axios from "axios";
import PropTypes from "prop-types";
import * as React from "react";
import { useEffect, useMemo } from "react";
import Map, { Marker } from "react-map-gl";

function TextMapBox(props) {
  const { newAddressMarker, setNewAddressMarker } = props;
  const viewport = {
    longitude: 108.20746,
    latitude: 16.05902,
    zoom: 11,
  };

  useEffect(() => {
    console.log(
      "Log: ~ file: TestMaBox.jsx ~ line 22 ~ TextMapBox ~ newAddressMarker",
      newAddressMarker
    );
  }, [newAddressMarker]);

  useEffect(() => {
    const timer = setTimeout(() => {
      let newAddress = "377 Nguyen Van Linh - Da Nang - Viet Nam";
      axios
        .get(
          `https://rsapi.goong.io/geocode?address=${newAddress}&api_key=P5Mv9lHQknc0Bqk61702l8ic4SHlQkegNAo6qgAX`
        )
        .then(function (response) {
          // handle success
          setNewAddressMarker([
            {
              id: 1,
              address: newAddress,
              longitude: response.data.results[0].geometry.location.lng,
              latitude: response.data.results[0].geometry.location.lat,
            },
            ...newAddressMarker,
          ]);
        })
        .catch(function (error) {
          // handle error
          console.log(error);
        })
        .then(function () {
          // always executed
        });
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const markers = useMemo(
    () =>
      newAddressMarker.map((vehicle) => {
        return (
          <Marker
            key={vehicle.id}
            longitude={vehicle.longitude}
            latitude={vehicle.latitude}
          >
            <img src="https://img.icons8.com/color/48/000000/marker.png" />
          </Marker>
        );
      }),

    [newAddressMarker]
  );

  return (
    <Map
      initialViewState={viewport}
      style={{ width: 600, height: 600 }}
      mapStyle="mapbox://styles/mapbox/streets-v11"
      mapboxAccessToken="pk.eyJ1IjoibGFuaGRuOTAiLCJhIjoiY2wyYTYza3N5MDFvZTNibzJrZ2ppcDE2aCJ9.2fZveTirvuQBrh_f8bVIPA"
    >
      {markers}
    </Map>
  );
}

TextMapBox.propTypes = {
  newAddressMarker: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      address: PropTypes.string.isRequired,
      longitude: PropTypes.number.isRequired,
      latitude: PropTypes.number.isRequired,
    })
  ).isRequired,
  setNewAddressMarker: PropTypes.func,
};
export default TextMapBox;
