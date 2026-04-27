import { BrowserRouter, Routes, Route } from "react-router-dom";
import RootLayout from "./layouts/RootLayout";
import Home from "./pages/Home/Home";
import Stats from "./pages/Stats/Stats";
import Analytics from "./pages/Analytics/Analytics";
import "./styles/main.scss";
import Animation from "./pages/animations/animations";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<RootLayout />}>
          <Route index element={<Home />} />
          <Route path="stats" element={<Stats />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="animation" element={<Animation />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
