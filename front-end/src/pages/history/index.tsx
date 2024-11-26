import { useContext, useState } from "react";
import { Navigation } from "../../components/navigation";
import { RideContext } from "../../context/ride_context";
import { rideRequests } from "../../api/instance";
import { GetRidesParams } from "../../core/types/params";
import { HistoryCard } from "../../components/history_card";

import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
const MySwal = withReactContent(Swal);

export const History = () => {
  const { state, dispatch } = useContext(RideContext);

  const [customer_id, setCustomerId] = useState("");
  const [driver_id, setDriverId] = useState(0);

  const [norides, setNoRides] = useState(false);

  const handleSearch = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const params: GetRidesParams = {
      customer_id: customer_id,
      driver_id: driver_id ?? undefined,
    };
    await rideRequests
      .getRides(params)
      .then((res) => {
        dispatch({ type: "SET_RIDES_RESPONSE", payload: res.data });
        if (res.data.rides.length === 0) {
          setNoRides(true);
        } else {
          setNoRides(false);
        }
      })
      .catch((error) => {
        console.log(error.response.data);
        if (error.response.data.error_code === "NO_RIDES_FOUND") {
          setNoRides(true);
          dispatch({
            type: "SET_RIDES_RESPONSE",
            payload: { customer_id, rides: [] },
          });
        }
        MySwal.fire({
          title: "OPS!",
          icon: "error",
          text: error.response.data.error_description,
        });
      });
  };
  return (
    <div className="relative h-full w-full">
      <div className=" relative w-full">
        <div className="absolute top-0 w-full z-10">
          <Navigation />
        </div>
      </div>
      <div className="flex flex-col h-full w-full shadow-lg p-6">
        <h1 className=" mt-[150px] text-black font-bold text-3xl">
          Histórico de corridas
        </h1>
        <form
          className="mt-2 flex flex-col sm:flex-row gap-3 min-w-32"
          onSubmit={handleSearch}
        >
          <input
            required
            className="rounded-md p-2  border-2 min-w-72"
            type="text"
            placeholder="ID do cliente"
            value={customer_id}
            onChange={(e) => setCustomerId(e.target.value)}
          />
          <input
            className="rounded-md p-2  border-2 min-w-72"
            type="number"
            placeholder="ID do motorista"
            value={driver_id}
            onChange={(e) => setDriverId(parseInt(e.target.value))}
          />
          <button className="px-4 sm:px-10 py-1 bg-primary text-white lg:text-lg  text-center  sm:text-sm font-bold rounded-md">
            Pesquisar
          </button>
        </form>
        {norides && (
          <div className="mt-2 bg-red-100 p-2 text-red-500 rounded-md">
            Nenhuma corrida encontrada
          </div>
        )}
        <div className="flex flex-col gap-3 mt-3">
          {!norides &&
            state.ridesResponse?.rides?.length &&
            state.ridesResponse?.rides?.length > 0 &&
            state.ridesResponse.rides.map((ride) => (
              <HistoryCard ride={ride} />
            ))}
        </div>
      </div>
    </div>
  );
};
