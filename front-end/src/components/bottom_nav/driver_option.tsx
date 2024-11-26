import { Tooltip } from "react-tooltip";
import { DriverOption } from "../../core/types/ride";
import { CarIcon } from "../icons/car";
import StarsRating from "./driver_stars";
import { useContext } from "react";
import { RideContext } from "../../context/ride_context";
import { rideRequests } from "../../api/instance";
import { ConfirmRideParams } from "../../core/types/params";
import { useNavigate } from "react-router-dom";

import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
const MySwal = withReactContent(Swal);

interface DriverOptionsProps {
  option: DriverOption;
}

export const DriverOptionView = ({ option }: DriverOptionsProps) => {
  const navigate = useNavigate();

  const { state } = useContext(RideContext);

  const handleChooseDriver = async () => {
    try {
      const params: ConfirmRideParams = {
        customer_id: state.customer_id,
        origin:
          state.rideOptions?.routeResponse.routes[0].legs[0].start_address ??
          "",
        destination:
          state.rideOptions?.routeResponse.routes[0].legs[0].end_address ?? "",
        distance: state.rideOptions?.distance ?? 0,
        duration: state.rideOptions?.duration ?? "",
        driver: {
          id: option.id,
          name: option.name,
        },
        value: option.value,
      };

      await rideRequests
        .confirm(params)
        .then((_) => {
          MySwal.fire({
            title: "Sucesso!",
            icon: "success",
            text: "Corrida solicitada com sucesso!",
            timer: 2000,
          });
          navigate("/history");
        })
        .catch((error) => {
          MySwal.fire({
            title: "OPS!",
            icon: "error",
            text: error.response.data.error_description,
          });
        });
    } catch (error) {
      console.log(error);
      MySwal.fire({
        title: "OPS!",
        icon: "error",
        text: "Erro ao solicitar corrida",
      });
    }
  };
  return (
    <div className="relative p-3 border-b-[1px] rounded-lg w-full">
      <div className="flex flex-col gap-3 lg:flex-row">
        <div className="lg:flex hidden ">
          <CarIcon
            props={{
              width: 100,
              height: 100,
              color: "black",
            }}
          />
        </div>
        <div className="flex flex-col w-full ">
          <div className="flex gap-2">
            <h1 className="text-lg font-bold">{option.name}</h1>
            <div
              data-tooltip-id="my-tooltip-multiline"
              data-tooltip-place="top"
              data-tooltip-html={option.review.comment
                ?.split(" ")
                .map(
                  (word, index) => `${word}${index % 4 === 2 ? "<br />" : " "}`
                )
                .join("")}
            >
              <StarsRating
                size="sm"
                defaultHowMany={option.review.rating}
                disabled={true}
              />
              <Tooltip id="my-tooltip-multiline" />
            </div>
          </div>

          <div className="mb-4">{option.description}</div>
        </div>

        <button
          onClick={() => handleChooseDriver()}
          className="flex mb-4 items-center text-xl text-center font-bold justify-center bg-primary text-white rounded-lg p-2 px-4"
        >
          R$ {option.value.toFixed(2)} <br />
          Escolher
        </button>
      </div>

      <span className="absolute bottom-1 text-sm truncate w-full">
        {option.vehicle}
      </span>
    </div>
  );
};
