import { Navigation } from "./components/navigation";
import { Wrapper } from "./components/wrapper";
import { RideProvider } from "./context/ride_context";
import { DefaultRoutes } from "./routes";
import { APIProvider } from "@vis.gl/react-google-maps";

function App() {
  const apiKey = import.meta.env.VITE_GOOGLE_API_KEY ?? "";

  return (
    <RideProvider>
      <APIProvider apiKey={apiKey}>
        <Wrapper>
          <div className=" relative w-full">
            <div className="absolute top-0 w-full z-10">
              <Navigation />
            </div>
          </div>
          <DefaultRoutes />
        </Wrapper>
      </APIProvider>
    </RideProvider>
  );
}

export default App;
