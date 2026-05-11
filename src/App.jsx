import { BrowserRouter, Routes, Route } from "react-router-dom";
import RootLayout from "./layouts/RootLayout";
import Home from "./pages/Home/Home";
import Stats from "./pages/Stats/Stats";
import Analytics from "./pages/Analytics/Analytics";
import Teams from "./pages/Teams/Teams";
import TeamDetail from "./pages/Teams/TeamDetail";
import ComingSoon from "./pages/ComingSoon/ComingSoon";
import NotFound from "./pages/NotFound/NotFound";
import "./styles/main.scss";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<RootLayout />}>
          <Route index element={<Home />} />
          <Route path="stats"        element={<Stats />} />
          <Route path="analytics"    element={<Analytics />} />
          <Route path="teams"        element={<Teams />} />
          <Route path="teams/:slug"  element={<TeamDetail />} />
          <Route path="about"        element={<ComingSoon title="About" />} />
          <Route path="news"         element={<ComingSoon title="News" />} />
          <Route path="match-center" element={<ComingSoon title="Match Center" />} />
          <Route path="players"      element={<ComingSoon title="Players" />} />
          <Route path="media"        element={<ComingSoon title="Media Channel" />} />
          <Route path="*"            element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
