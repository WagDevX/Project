import React, { createContext, useReducer, ReactNode, Dispatch } from "react";
import { Ride, RideOptions, RidesResponse } from "../core/types/ride";
import { Driver } from "../core/types/driver";

interface State {
  drivers: Driver[];
  rides: Ride[];
  rideOptions: RideOptions | null;
  ridesResponse: RidesResponse | null;
}

const initialState: State = {
  drivers: [],
  rides: [],
  rideOptions: null,
  ridesResponse: null,
};

type Action =
  | { type: "SET_DRIVERS"; payload: Driver[] }
  | { type: "SET_RIDES"; payload: Ride[] }
  | { type: "SET_RIDE_OPTIONS"; payload: RideOptions }
  | { type: "SET_RIDES_RESPONSE"; payload: RidesResponse }
  | { type: "CLEAR_RIDE_OPTIONS" };

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "SET_DRIVERS":
      return { ...state, drivers: action.payload };
    case "SET_RIDES":
      return { ...state, rides: action.payload };
    case "SET_RIDE_OPTIONS":
      return { ...state, rideOptions: action.payload };
    case "SET_RIDES_RESPONSE":
      return { ...state, ridesResponse: action.payload };
    case "CLEAR_RIDE_OPTIONS":
      return { ...state, rideOptions: null };
    default:
      return state;
  }
};

interface RideProviderProps {
  children: ReactNode;
}

const RideContext = createContext<{ state: State; dispatch: Dispatch<Action> }>(
  {
    state: initialState,
    dispatch: () => null,
  }
);

const RideProvider: React.FC<RideProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <RideContext.Provider value={{ state, dispatch }}>
      {children}
    </RideContext.Provider>
  );
};

export { RideContext, RideProvider };
