import { Map, Marker, useMarkerRef } from "@vis.gl/react-google-maps";

import { useEffect, useState } from "react";

export const Estimate = () => {
  const [center, setCenter] = useState({ lat: 0, lng: 0 });

  const [markerRef, marker] = useMarkerRef();

  useEffect(() => {
    if (!marker) {
      return;
    }

    // do something with marker instance here
  }, [marker]);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCenter({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      (error) => {
        console.error("Error getting location: ", error);
      }
    );
  }, []);

  return (
    <div className="flex h-full w-full">
      <Map
        style={{ width: "100vw", height: "100vh" }}
        center={center}
        defaultZoom={16}
        gestureHandling={"greedy"}
        disableDefaultUI={true}
      />
      <Marker ref={markerRef} position={center} />
    </div>
  );
};
