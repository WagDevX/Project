import {
  AdvancedMarker,
  Map,
  useAdvancedMarkerRef,
} from "@vis.gl/react-google-maps";
import { useEffect, useState } from "react";
import { BottomNav } from "../../components/bottom_nav";

export const Estimate = () => {
  const [center, setCenter] = useState({ lat: 0, lng: 0 });

  const [markerRef, marker] = useAdvancedMarkerRef();

  useEffect(() => {
    if (!marker) {
      return;
    }
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
    <div className="relative h-full w-full">
      <Map
        mapId={"map"}
        style={{ width: "100%", height: "100%" }}
        center={center}
        defaultZoom={16}
        gestureHandling={"greedy"}
        disableDefaultUI={true}
      />
      <AdvancedMarker ref={markerRef} position={center} />
      <div className="absolute bottom-0 w-full">
        <BottomNav />
      </div>
    </div>
  );
};
