import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Campaign, CreativeGroup } from "../types";
import ChampionsModal from './ChampionsModal'
import AnalyzeCampaignModal from "./AnalyzeCampaignModal";


type CampaignListProps = {
  campaigns: Campaign[];
  setCampaigns: React.Dispatch<React.SetStateAction<Campaign[]>>;
  fetchCampaigns: () => Promise<void>;
};

const CampaignList = ({ campaigns, fetchCampaigns }: CampaignListProps) => {
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState<string | null>(null);
  const [expandedData, setExpandedData] = useState<Record<string, Campaign>>({});
  const [analyzingCampaign, setAnalyzingCampaign] = useState<Campaign | null>(null);
  const [sortedGroups, setSortedGroups] = useState<CreativeGroup[]>([]);
  const [showChampionsModal, setShowChampionsModal] = useState(false);
  const [champions, setChampions] = useState<CreativeGroup[]>([]);

  const runCampaign = async (campaignId: string) => {
    try {
      await axios.post(`http://127.0.0.1:8000/campaigns/${campaignId}/run`);
      alert("Campaign run successfully!");
      fetchCampaigns();
      setExpanded(null);
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

  const fetchChampions = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:8000/campaigns/champion-waitlist");
      setChampions(res.data?.groups);
      setShowChampionsModal(true);
    } catch (error) {
      console.error("Failed to fetch champions", error);
      alert("Could not load champions list.");
    }
  };

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-6">
      <h2 className="text-xl font-bold text-gray-800">Campaigns List:</h2>

      {campaigns?.map((campaign) => (
        <div
          key={campaign.campaign_id}
          className="bg-white border border-gray-200 rounded-xl shadow-md p-4 mb-4"
        >
          <div className="flex justify-between items-center">
            <button
              onClick={() => toggleExpand(campaign.campaign_id)}
              className="flex items-center gap-2 text-xl font-semibold text-gray-900 hover:underline"
            >
              {expanded === campaign.campaign_id ? <ChevronUp /> : <ChevronDown />}
              {campaign.name}
            </button>

            <div className="flex gap-3 flex-wrap">
              <button
                onClick={() => handleAttachCreativeGroup(campaign.name, campaign.campaign_id)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm"
              >
                Attach Creative Group
              </button>
              <button
                onClick={() => runCampaign(campaign.campaign_id)}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl text-sm"
              >
                Run Campaign
              </button>
            </div>
          </div>

          <p className="text-sm text-gray-600">
            Status: <span className="font-medium">{campaign.status}</span> | Total Impressions:{" "}
            <span className="font-medium">{campaign.impressions}</span>
          
          </p>
          <p className="text-sm text-gray-600">
          {expanded === null ? (
              'Expand to see more Campaign details...'
            ) : (
              ""
            )}
            </p>
          {expanded === campaign.campaign_id && expandedData[campaign.campaign_id] && (
            <div className="pt-4 border-t space-y-4">
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => {
                    const groups = [
                      ...(expandedData[campaign.campaign_id]?.creative_groups || []),
                    ];
                    const sorted = groups.sort(
                      (a, b) => (b.conversions || 0) - (a.conversions || 0)
                    );
                    setSortedGroups(sorted);
                    setAnalyzingCampaign(expandedData[campaign.campaign_id]);
                  }}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-xl text-sm"
                >
                  Analyze Campaign Results
                </button>

                <button
                  onClick={fetchChampions}
                  className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-xl text-sm"
                >
                  See Champions List
                </button>
              </div>

              {expandedData[campaign.campaign_id].creative_groups?.map((group) => (
                <div key={group.creative_group_id} className="border rounded-lg p-4 bg-gray-50">
                  <h4 className="text-lg font-semibold text-gray-800 mb-2">Group: {group.name}</h4>
                  <div className="overflow-x-auto">
                    <table className="min-w-full border-separate border-spacing-y-2">
                        <thead className="bg-gray-200 rounded-lg text-gray-700 text-sm font-medium">
                          <tr>
                            <th className="px-4 py-2 text-left">Creative ID</th>
                            <th className="px-4 py-2 text-left">Type</th>
                            <th className="px-4 py-2 text-left">File URL</th>
                            <th className="px-4 py-2 text-left">Auto Endcard</th>
                          </tr>
                        </thead>
                        <tbody>
                          {group.creatives?.map((creative) => (
                            <tr
                              key={creative.creative_id}
                              className="bg-white shadow-md rounded-lg text-sm text-gray-800"
                            >
                              <td className="px-4 py-2">{creative.creative_id}</td>
                              <td className="px-4 py-2">{creative.type}</td>
                              <td className="px-4 py-2">{creative.file_url}</td>
                              <td className="px-4 py-2">{creative.auto_endcard ? "Yes" : "No"}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>

                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}

      {analyzingCampaign && (
       <AnalyzeCampaignModal sortedGroups={sortedGroups} analyzingCampaign={analyzingCampaign} setAnalyzingCampaign={setAnalyzingCampaign}  />
      )}

      {showChampionsModal && (
       <ChampionsModal setShowChampionsModal={setShowChampionsModal} champions={champions} />
      )}
    </div>
  );
};

export default CampaignList;
