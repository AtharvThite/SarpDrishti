import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import HomePage from "./pages/HomePage";
import IdentifyPage from "./pages/IdentifyPage";
import SnakeBrowserPage from "./pages/SnakeBrowserPage";
import SnakeDetailPage from "./pages/SnakeDetailPage";
import EmergencyPage from "./pages/EmergencyPage";
import RescuersPage from "./pages/RescuersPage";
import RescuerRegisterPage from "./pages/RescuerRegisterPage";
import AwarenessPage from "./pages/AwarenessPage";

function App() {
  return (
    <BrowserRouter>
      <div className="flex min-h-screen flex-col" data-testid="app-root">
        <Navbar />

        <main className="flex-1">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/identify" element={<IdentifyPage />} />
            <Route path="/snakes" element={<SnakeBrowserPage />} />
            <Route path="/snakes/:id" element={<SnakeDetailPage />} />
            <Route path="/emergency" element={<EmergencyPage />} />
            <Route path="/rescuers" element={<RescuersPage />} />
            <Route
              path="/rescuer/register"
              element={<RescuerRegisterPage />}
            />
            <Route path="/awareness" element={<AwarenessPage />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;