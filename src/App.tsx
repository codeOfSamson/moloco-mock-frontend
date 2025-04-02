import CampaignForm from "./Components/CampaignForm"
import CampaignList from "./Components/CampaignList";

function App() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">Moloco Ad Campaign Manager</h1>
      <CampaignForm />
      <CampaignList />
    </div>
  );
}

export default App;
