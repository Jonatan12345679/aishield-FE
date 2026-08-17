import { Routes, Route } from "react-router-dom";
import AiShieldPage from "@/pages/AiShieldPage";
import LandingPage from '@/pages/LandingPage'
import NotFoundPage from "@/pages/NotFoundPage";
import BlurAiPage from "@/pages/BlurAiPage";
import RealtimeDetectionPage from "@/pages/RealtimeDetectionPage";

// import PrivacyDetection from "./pages/PrivacyDetection";

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage/>} />
      <Route path="/aishield" 
      element={<AiShieldPage />}
       />
      <Route
        path="/blurai"
        element={<BlurAiPage />}
      />
      <Route
          path="/realtime-detection"
          element={<RealtimeDetectionPage />}
      />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;