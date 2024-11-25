import { useContext, useEffect, useState } from "react";
import { BottomNav } from "../../components/bottom_nav/bottom_nav";

import GoogleMapReact from "google-map-react";
import { RideContext } from "../../context/ride_context";
import { Navigation } from "../../components/navigation";

export const Estimate = () => {
  const { state } = useContext(RideContext);

  const [center, setCenter] = useState({ lat: -25.441105, lng: -49.276855 });

  function updateGeoLocation() {
    const success = (position: GeolocationPosition) => {
      setCenter({
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      });
    };

    const error = () => {
      alert("Sorry, no position available.");
    };

    const options = {
      enableHighAccuracy: true,
      maximumAge: 30000,
      timeout: 27000,
    };

    navigator.geolocation.watchPosition(success, error, options);
  }

  useEffect(() => {
    if (center.lat === 0 && center.lng === 0) updateGeoLocation();
  }, [center]);

  const [origin, setOrigin] = useState<google.maps.LatLngLiteral>({
    lat: state.rideOptions?.origin?.latitude || center.lat,
    lng: state.rideOptions?.origin?.longitude || center.lng,
  });

  const [destination, setDestination] = useState<google.maps.LatLngLiteral>({
    lat: state.rideOptions?.destination?.latitude || 0,
    lng: state.rideOptions?.destination?.longitude || 0,
  });

  useEffect(() => {
    setOrigin({
      lat: state.rideOptions?.origin?.latitude || center.lat,
      lng: state.rideOptions?.origin?.longitude || center.lng,
    });
    setDestination({
      lat: state.rideOptions?.destination?.latitude || 0,
      lng: state.rideOptions?.destination?.longitude || 0,
    });
  }, [state.rideOptions]);

  return (
    <div className="relative h-full w-full">
      <div className=" relative w-full">
        <div className="absolute top-0 w-full z-10">
          <Navigation />
        </div>
      </div>
      <MapWithADirectionsRenderer
        center={center}
        zoom={12}
        origin={origin}
        destination={destination}
      />
      <div className="absolute bottom-0 w-full">
        <BottomNav />
      </div>
    </div>
  );
};

function MapWithADirectionsRenderer(props: {
  center: google.maps.LatLngLiteral;
  zoom: number;
  origin: google.maps.LatLngLiteral;
  destination: google.maps.LatLngLiteral;
}) {
  const [map, setMap] = useState<google.maps.Map | null>(null);

  async function handleApiLoaded(mapInstance: google.maps.Map) {
    setMap(mapInstance);

    const directionsService = new google.maps.DirectionsService();
    const directionsRenderer = new google.maps.DirectionsRenderer();

    const getRoute = async (
      origin: google.maps.LatLngLiteral,
      destination: google.maps.LatLngLiteral
    ): Promise<google.maps.DirectionsResult> => {
      return new Promise(function (resolve, reject) {
        directionsService.route(
          {
            origin: origin,
            destination: destination,
            travelMode: google.maps.TravelMode.DRIVING,
          },
          (result: any, status: google.maps.DirectionsStatus) => {
            if (status === google.maps.DirectionsStatus.OK) {
              resolve(result);
            } else {
              reject(result);
            }
          }
        );
      });
    };

    const renderRoute = async () => {
      const directions = await getRoute(props.origin, props.destination);
      directionsRenderer.setMap(mapInstance);
      directionsRenderer.setDirections(directions);
    };

    renderRoute().catch((err) => {
      console.log(err);
    });
  }

  useEffect(() => {
    if (map) {
      handleApiLoaded(map);
    }
  }, [props.origin, props.destination]);

  return (
    <div style={{ height: "70vh", width: "100%", marginTop: "100px" }}>
      <GoogleMapReact
        bootstrapURLKeys={{ key: import.meta.env.VITE_GOOGLE_API_KEY }}
        defaultCenter={props.center}
        defaultZoom={props.zoom}
        onGoogleApiLoaded={({ map }) => handleApiLoaded(map)}
      />
    </div>
  );
}
