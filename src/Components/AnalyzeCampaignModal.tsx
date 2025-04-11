import { Campaign, CreativeGroup } from "../types";
import axios from "axios";

type AnalyzeCampaignModalProps = {
    setAnalyzingCampaign: React.Dispatch<React.SetStateAction<Campaign | null>>;
    sortedGroups: CreativeGroup[];
    analyzingCampaign: any
};

const AnalyzeCampaignModal: React.FC<AnalyzeCampaignModalProps> = ({ setAnalyzingCampaign, analyzingCampaign, sortedGroups }) => {

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
    <div className="bg-white p-8 rounded-2xl shadow-xl max-w-3xl w-full space-y-6">
      <h3 className="text-2xl font-bold text-gray-800">
        Results for: {analyzingCampaign.name}
      </h3>

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-700 border">
          <thead className="bg-gray-100 font-medium">
            <tr>
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
      </div>

      <div className="flex justify-between gap-4">
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
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl text-sm"
        >
          Send Top Group to Champion Waitlist
        </button>

        <button
          onClick={() => setAnalyzingCampaign(null)}
          className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-xl text-sm"
        >
          Close
        </button>
      </div>
    </div>
  </div>
  );
};

export default AnalyzeCampaignModal;
