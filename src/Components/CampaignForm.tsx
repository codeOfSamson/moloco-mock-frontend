import { useState } from "react";
import axios from "axios";

type CampaignFormProps = {
  fetchCampaigns: () => Promise<void>;
};

const CampaignForm: React.FC<CampaignFormProps> = ({ fetchCampaigns }) => {

  const [name, setName] = useState("");

  const createCampaign = async () => {
    if (!name) return alert("Campaign name required");

    try {
      await axios.post("http://127.0.0.1:8000/campaigns/", {
        campaign_id: name.replace(/\s+/g, "_").toLowerCase(),
        name,
        creative_group_ids: [],
        status: "paused",
        impressions: 0,
      });
      alert("Campaign created!");
      setName("");
      fetchCampaigns()
    } catch (error) {
      alert("Error creating campaign");
      console.error(error);
    }
  };

  return (
    <div className="p-4">
      <h2>Create Campaign</h2>
      <input
        type="text"
        placeholder="Campaign Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="border p-2"
      />
      <button onClick={()=>{createCampaign()}} className="bg-blue-500 text-white p-2 ml-2">
        Create
      </button>
    </div>
  );
};

export default CampaignForm;
