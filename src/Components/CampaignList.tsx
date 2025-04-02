import { useEffect, useState } from "react";
import axios from "axios";

const CampaignList = () => {
    type Campaign = {
        campaign_id: string;  
        name: string;  
      };
      
      const [campaigns, setCampaigns] = useState<Campaign[]>([]);

  const fetchCampaigns = async () => {
    try {
      const { data } = await axios.get("http://127.0.0.1:8000/campaigns/");
      setCampaigns(data.campaigns);
    } catch (error) {
      console.error("Error fetching campaigns", error);
    }
  };

  const runCampaign = async (campaignId: string) => {
    try {
      await axios.post(`http://127.0.0.1:8000/campaigns/${campaignId}/run`);
      alert("Campaign run successfully!");
      fetchCampaigns(); // Refresh list after running
    } catch (error) {
      alert("Error running campaign");
      console.error(error);
    }
  };

  useEffect(() => {
    fetchCampaigns();
  }, []);

  return (
    <div className="p-4">
      <h2>Campaigns</h2>
      <ul>
        {campaigns?.map((campaign) => (
          <li key={campaign.campaign_id} className="border p-2 my-2">
            <strong>{campaign.name}</strong> - {campaign.status} - {campaign.impressions} impressions
            <button
              onClick={() => runCampaign(campaign.campaign_id)}
              className="bg-green-500 text-white p-2 ml-2"
            >
              Run Campaign
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CampaignList;
