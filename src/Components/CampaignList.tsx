import axios from "axios";
import { useNavigate } from "react-router-dom";

type Campaign = {
  campaign_id: string;
  name: string;
  creative_group_ids: string[];
  status: string;
  impressions: number;
};

type CampaignListProps = {
  campaigns: Campaign[];
  setCampaigns: React.Dispatch<React.SetStateAction<Campaign[]>>;
  fetchCampaigns: () => Promise<void>;
};

const CampaignList = ({ campaigns, fetchCampaigns }: CampaignListProps) => {
  const navigate = useNavigate();

  const runCampaign = async (campaignId: string) => {
    try {
      await axios.post(`http://127.0.0.1:8000/campaigns/${campaignId}/run`);
      alert("Campaign run successfully!");
      fetchCampaigns();
    } catch (error) {
      alert("Error running campaign");
      console.error(error);
    }
  };

  const handleAttachCreativeGroup = (campaignId: string) => {
    navigate(`/creative-groups?campaignId=${campaignId}`);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-semibold mb-4">Campaigns</h2>
      <div className="space-y-4">
        {campaigns?.map((campaign) => (
          <div
            key={campaign.campaign_id}
            className="bg-white shadow-md rounded-xl p-5 border border-gray-200"
          >
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
              <div>
                <h3 className="text-lg font-bold text-gray-800">{campaign.name}</h3>
                <p className="text-sm text-gray-600">
                  Status: {campaign.status} | Impressions: {campaign.impressions}
                </p>
              </div>
              <div className="flex flex-wrap gap-3 mt-3 sm:mt-0">
                <button
                  onClick={() => handleAttachCreativeGroup(campaign.campaign_id)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm transition"
                >
                  Attach Creative Group
                </button>
                <button
                  onClick={() => runCampaign(campaign.campaign_id)}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm transition"
                >
                  Run Campaign
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CampaignList;
