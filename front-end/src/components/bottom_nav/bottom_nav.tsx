import { useContext, useState } from "react";
import { rideRequests } from "../../api/instance";
import { EstimateRideParams } from "../../core/types/params";
import { RideOptionsView } from "./ride_options";
import { RideContext } from "../../context/ride_context";

import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
const MySwal = withReactContent(Swal);

export const BottomNav = () => {
  const { state, dispatch } = useContext(RideContext);

  const [formData, setFormData] = useState<EstimateRideParams>({
    customer_id: "",
    origin: "",
    destination: "",
  });

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    await rideRequests
      .estimate(formData)
      .then((response) => {
        dispatch({ type: "SET_RIDE_OPTIONS", payload: response.data });
      })
      .catch((error) => {
        MySwal.fire({
          title: "OPS!",
          icon: "error",
          text: error.response.data.error_description,
        });
      });
  };

  const rideOptions = state.rideOptions;

  return (
    <div className="flex flex-col max-h-[30vh] sm:max-h-[40vh] w-full justify-center items-center bg-white rounded-t-3xl p-5 shadow-lg">
      {rideOptions && <RideOptionsView />}
      {!rideOptions && (
        <>
          <h2 className="text-lg font-bold">Estimar corrida</h2>
          <form
            onSubmit={handleSearch}
            className=" mt-2 flex flex-col gap-2 w-full"
          >
            <label className="text-sm">Identificação do cliente</label>
            <input
              className="rounded-md p-2 border-2 "
              required
              type="text"
              placeholder="Identificação do cliente"
              value={formData.customer_id}
              onChange={(e) =>
                setFormData({ ...formData, customer_id: e.target.value })
              }
            />
            <label className="text-sm">Origem</label>
            <input
              className="rounded-md p-2  border-2"
              required
              type="text"
              placeholder="Origem"
              value={formData.origin}
              onChange={(e) =>
                setFormData({ ...formData, origin: e.target.value })
              }
            />
            <label className="text-sm">Destino</label>
            <input
              className="rounded-md p-2  border-2"
              required
              type="text"
              placeholder="Destino"
              value={formData.destination}
              onChange={(e) =>
                setFormData({ ...formData, destination: e.target.value })
              }
            />
            <button
              className="mt-2 px-4 sm:px-10 py-1 bg-[#07a776] text-white text-center lg:text-lg sm:text-sm  font-bold rounded-md"
              type="submit"
            >
              Buscar
            </button>
          </form>
        </>
      )}
    </div>
  );
};
