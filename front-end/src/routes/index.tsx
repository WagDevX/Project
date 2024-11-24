import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Estimate } from "../pages/estimate";
import { Confirm } from "../pages/confirm";
import { Search } from "../pages/search";

export const DefaultRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Estimate />} />
        <Route path="/confirm" element={<Confirm />} />
        <Route path="/search" element={<Search />} />
      </Routes>
    </BrowserRouter>
  );
};
