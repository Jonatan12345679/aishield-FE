import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import NotFoundPage from "./pages/NotFoundPage";
import PrivacyDetectionPage from "./pages/PrivacyDetectionPage";

// import PrivacyDetection from "./pages/PrivacyDetection";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route
        path="/privacy-detection"
        element={<PrivacyDetectionPage />}
      />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;