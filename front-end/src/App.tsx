import { Navigation } from "./components/navigation";
import { Wrapper } from "./components/wrapper";
import { DefaultRoutes } from "./routes";
import { APIProvider } from "@vis.gl/react-google-maps";

function App() {
  const apiKey = import.meta.env.VITE_GOOGLE_API_KEY ?? "";

  return (
    <APIProvider apiKey={apiKey}>
      <Wrapper>
        <Navigation />
        <DefaultRoutes />
      </Wrapper>
    </APIProvider>
  );
}

export default App;
