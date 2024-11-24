import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Estimate } from "../pages/estimate";
import { History } from "../pages/history";

export const DefaultRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Estimate />} />
        <Route path="/search" element={<History />} />
      </Routes>
    </BrowserRouter>
  );
};
