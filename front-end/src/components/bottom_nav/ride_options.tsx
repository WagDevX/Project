import { useContext } from "react";
import { DriverOptionView } from "./driver_option";
import { RideContext } from "../../context/ride_context";

export const RideOptionsView = () => {
  const { state } = useContext(RideContext);
  const { rideOptions } = state;

  if (!rideOptions) {
    return null;
  }

  return (
    <div className="flex flex-col gap-3 w-full max-h-[40vh] overflow-y-scroll overflow-x-hidden ">
      <div className="flex justify-between">
        <label htmlFor="">Distância: {rideOptions.distance / 1000} km</label>
        <label htmlFor="">Tempo: {rideOptions.duration}</label>
      </div>
      {rideOptions.options.length === 0 && (
        <h1 className="text-bold text-2xl mt-10 mb-20">
          Nenhum motorista disponível para este trajeto
        </h1>
      )}
      {rideOptions.options.length > 0 &&
        rideOptions.options.map((option) => (
          <DriverOptionView key={option.id} option={option} />
        ))}
    </div>
  );
};
