import { Routes, Route } from "react-router-dom";
import CreativeGroupsPage from "./pages/CreativeGroupsPage"; 
import CampaignsPage from "./pages/CampaignsPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<CampaignsPage />} />
      <Route path="/creative-groups" element={<CreativeGroupsPage />} />
    </Routes>
  );
}

export default App;
