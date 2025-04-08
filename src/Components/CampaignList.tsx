import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

interface Creative {
  creative_id: string;
  type: string;
  auto_endcard: boolean;
  file_url: string;
}

interface CreativeGroup {
  creative_group_id: string;
  name: string;
  creative_ids: string[];
  creatives?: Creative[];
}

interface Campaign {
  campaign_id: string;
  name: string;
  creative_group_ids: string[];
  status: string;
  impressions: number;
  creative_groups?: CreativeGroup[];
}

type CampaignListProps = {
  campaigns: Campaign[];
  setCampaigns: React.Dispatch<React.SetStateAction<Campaign[]>>;
  fetchCampaigns: () => Promise<void>;
};

const CampaignList = ({ campaigns, setCampaigns, fetchCampaigns }: CampaignListProps) => {
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState<string | null>(null);
  const [expandedData, setExpandedData] = useState<Record<string, Campaign>>({});

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

  const handleAttachCreativeGroup = (name: string, campaignId: string) => {
    navigate(`/creative-groups?name=${name}&campaignId=${campaignId}`);
  };

  const toggleExpand = async (campaignId: string) => {
    if (expanded === campaignId) {
      setExpanded(null);
      return;
    }

    try {
      const res = await axios.get<Campaign>(`http://127.0.0.1:8000/campaigns/${campaignId}/full`);
      setExpanded(campaignId);
      setExpandedData((prev) => ({ ...prev, [campaignId]: res.data }));
    } catch (error) {
      console.error("Failed to fetch full campaign data", error);
    }
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
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <button
                  onClick={() => toggleExpand(campaign.campaign_id)}
                  className="flex items-center gap-2 text-left text-lg font-bold text-gray-800 hover:underline"
                >
                  {expanded === campaign.campaign_id ? <ChevronUp /> : <ChevronDown />}
                  {campaign.name}
                </button>
                <p className="text-sm text-gray-600">
                  Status: {campaign.status} | Impressions: {campaign.impressions}
                </p>
              </div>
              <div className="flex flex-wrap gap-3 mt-3 sm:mt-0">
                <button
                  onClick={() => handleAttachCreativeGroup(campaign.name, campaign.campaign_id)}
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

            {expanded === campaign.campaign_id && expandedData[campaign.campaign_id] && (
              <div className="mt-4 border-t pt-4">
                
                {expandedData[campaign.campaign_id].creative_groups?.map((group) => (
                  <div key={group.creative_group_id} className="mb-3">
                    <h4 className="font-semibold">Group: {group.name}</h4>
                    <table className="w-full text-sm text-left border mt-2">
                      <thead>
                        <tr className="bg-gray-100">
                          <th className="p-2 border">Creative ID</th>
                          <th className="p-2 border">Type</th>
                          <th className="p-2 border">File URL</th>
                          <th className="p-2 border">Auto Endcard</th>
                        </tr>
                      </thead>
                      <tbody>
                        {group.creatives?.map((creative) => (
                          <tr key={creative.creative_id}>
                            <td className="p-2 border">{creative.creative_id}</td>
                            <td className="p-2 border">{creative.type}</td>
                            <td className="p-2 border">{creative.file_url}</td>
                            <td className="p-2 border">{creative.auto_endcard ? "Yes" : "No"}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CampaignList;
