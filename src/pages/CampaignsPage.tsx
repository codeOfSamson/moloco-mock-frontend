import CampaignForm from "../Components/CampaignForm"
import CampaignList from "../Components/CampaignList";
import { useState, useEffect } from "react";
import axios from "axios";


function CampaignsPage() {
  type Campaign = {
    campaign_id: string;  
    name: string;  
    creative_group_ids: string[];
    status: string;
    impressions: number;

  };
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);

  const fetchCampaigns = async () => {
    try {
      const { data } = await axios.get("http://127.0.0.1:8000/campaigns/");
      setCampaigns(data as Campaign[]);
    } catch (error) {
      console.error("Error fetching campaigns", error);
    }
  };

  useEffect(() => {
    fetchCampaigns(); 
  }, []); 


  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">Moloco Ad Campaign Manager</h1>
      <CampaignForm fetchCampaigns={fetchCampaigns} />
     <CampaignList campaigns={campaigns} setCampaigns={setCampaigns} fetchCampaigns={fetchCampaigns} />
     <p className="text-green-400 text-lg font-bold">Tailwind works!</p>
     </div>

  );
}

export default CampaignsPage;
