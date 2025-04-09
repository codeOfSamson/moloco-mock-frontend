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
  impressions?: number;
  clicks?: number;
  conversions?: number;
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
  const [analyzingCampaign, setAnalyzingCampaign] = useState<Campaign | null>(null);
  const [sortedGroups, setSortedGroups] = useState<CreativeGroup[]>([]);


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
                  className="flex items-center gap-2 text-left text-lg text-white font-bold text-gray-800 hover:underline"
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
                <button
                    onClick={() => {
                      const groups = [...(expandedData[campaign.campaign_id]?.creative_groups || [])];
                      const sorted = groups.sort((a, b) => (b.conversions || 0) - (a.conversions || 0));
                      setSortedGroups(sorted);
                      setAnalyzingCampaign(expandedData[campaign.campaign_id]);
                    }}
                    className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm transition mt-2"
                  >
                    Analyze Campaign Results
                  </button>
                {expandedData[campaign.campaign_id].creative_groups?.map((group) => (
                  <div key={group.creative_group_id} className="mb-3">
                    <h4 className="font-semibold text-black">Group: {group.name}</h4>
                    <table className="w-full text-sm text-left border mt-2">
                      <thead>
                        <tr className="bg-gray-400">
                          <th className="p-2 border">Creative ID</th>
                          <th className="p-2 border">Type</th>
                          <th className="p-2 border">File URL</th>
                          <th className="p-2 border">Auto Endcard</th>
                        </tr>
                      </thead>
                      <tbody>
                        {group.creatives?.map((creative) => (
                          <tr key={creative.creative_id} className="text-black">
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
      {analyzingCampaign && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
    <div className="bg-white p-6 rounded-xl shadow-lg max-w-2xl w-full">
      <h3 className="text-xl font-bold mb-4">Results for: {analyzingCampaign.name}</h3>
      <table className="w-full text-sm text-left text-black border mb-4">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2 border">Group Name</th>
            <th className="p-2 border">Impressions</th>
            <th className="p-2 border">Clicks</th>
            <th className="p-2 border">Conversions</th>
          </tr>
        </thead>
        <tbody>
          {sortedGroups.map((group) => (
            <tr key={group.creative_group_id}>
              <td className="p-2 border">{group.name}</td>
              <td className="p-2 border">{group.impressions}</td>
              <td className="p-2 border">{group.clicks}</td>
              <td className="p-2 border">{group.conversions}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex justify-between">
        <button
          onClick={async () => {
            const topGroup = sortedGroups[0];
            try {
              await axios.post("http://127.0.0.1:8000/campaigns/champion-waitlist/add", {
                group_id: topGroup.creative_group_id,
              });
              alert(`Added ${topGroup.name} to Champion Waitlist!`);
            } catch (error) {
              console.error("Error adding to Champion Waitlist", error);
              alert("Failed to add to waitlist.");
            }
          }}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm"
        >
          Send Top Group to Champion Waitlist
        </button>

        <button
          onClick={() => setAnalyzingCampaign(null)}
          className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg text-sm"
        >
          Close
        </button>
      </div>
    </div>
  </div>
)}

    </div>
  );
};

export default CampaignList;
