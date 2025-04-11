import { useState } from "react";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";


type CampaignFormProps = {
  fetchCampaigns: () => Promise<void>;
};

const CampaignForm: React.FC<CampaignFormProps> = ({ fetchCampaigns }) => {

  const [name, setName] = useState("");

  const createCampaign = async () => {
    if (!name) return alert("Campaign name required");

    try {
      await axios.post("http://127.0.0.1:8000/campaigns/", {
        campaign_id: uuidv4(),
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
    <div className="pl-9  ">
      <h1 className="font-bold ">Create New Campaign:</h1>
      <input
        type="text"
        placeholder="Campaign Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="border rounded p-2"
      />
      <button onClick={()=>{createCampaign()}} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm m-2">
        Create
      </button>
    </div>
  );
};

export default CampaignForm;
