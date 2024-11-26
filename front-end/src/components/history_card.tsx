import { Ride } from "../core/types/ride";
import { ArrowsLRIcon } from "./icons/arows_left_right";
import { BankNotes } from "./icons/bank_notes";
import { ClockIcon } from "./icons/clock";
import { DateIcon } from "./icons/date";
import { DriverIcon } from "./icons/driver";
import { MapPinIcon } from "./icons/map_pin";

export const HistoryCard = ({ ride }: { ride: Ride }) => {
  return (
    <div className="flex justify-between gap-2 p-4 bg-white rounded-lg shadow-md">
      <div className="flex flex-col w-full">
        <div className="flex gap-1 items-center">
          <DateIcon />
          <label className="font-bold">
            {new Date(ride.date).toLocaleDateString()}
          </label>
        </div>

        <div className="flex gap-1 items-center">
          <MapPinIcon props={{ height: 20, width: 20, color: "none" }} />
          <label htmlFor="">Origem: {ride.origin}</label>
        </div>
        <div className="flex gap-1 items-center mt-2">
          <MapPinIcon props={{ height: 20, width: 20, color: "none" }} />
          <label htmlFor="">Destino: {ride.destination}</label>
        </div>
        <hr className="mt-2 mb-2" />
        <div className="flex justify-between w-full">
          <div className="flex flex-col ">
            <div className="flex gap-1 items-center">
              <ArrowsLRIcon />
              <label htmlFor="">Distância: {ride.distance / 1000} km</label>
            </div>
            <div className="flex gap-1 items-center">
              <ClockIcon props={{ height: 20, width: 20, color: "none" }} />
              <label htmlFor="">Tempo: {ride.duration}</label>
            </div>
          </div>
          <div className="flex flex-col">
            <div className="flex gap-1 items-center">
              <BankNotes />
              <label htmlFor="">R$ {ride.value}</label>
            </div>
            <div className="flex gap-1 items-center">
              <DriverIcon />
              <label htmlFor="">{ride.driver.name}</label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
