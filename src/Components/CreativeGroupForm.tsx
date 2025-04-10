import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import { useSearchParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";



type Creative = {
  creative_id: string;
  file_url: string;
  auto_endcard: boolean;
  type: string;
};

type CreativeGroup = {
  group_id: string;
  group_name: string;
  creatives: Creative[];
};

export default function CampaignCreativeForm() {
  const [creativeGroups, setCreativeGroups] = useState<CreativeGroup[]>([]);
  const [searchParams] = useSearchParams();
  const campaignId = searchParams?.get("campaignId")
  const navigate = useNavigate();

  const addCreativeGroup = () => {
    setCreativeGroups((prev) => [
      ...prev,
      {
        group_id: uuidv4(),
        group_name: "",
        creatives: [
          {
            creative_id: uuidv4(),
            file_url: "",
            auto_endcard: true,
            type: "VIDEO",
          },
        ],
      },
    ]);
  };

  const updateCreativeGroup = (
    groupIndex: number,
    field: "group_name",
    value: string
  ) => {
    const updatedGroups = [...creativeGroups];
    updatedGroups[groupIndex][field] = value;
    setCreativeGroups(updatedGroups);
  };

  const updateCreative = (
    groupIndex: number,
    creativeIndex: number,
    field: "file_url" | "auto_endcard" | "type",
    value: string | boolean
  ) => {
    const updatedGroups = [...creativeGroups];
    const creative = updatedGroups[groupIndex].creatives[creativeIndex];
  
    // Assign with type guards
    if (field === "file_url" && typeof value === "string") {
      creative.file_url = value;
    } else if (field === "type" && typeof value === "string") {
      creative.type = value;
    } else if (field === "auto_endcard" && typeof value === "boolean") {
      creative.auto_endcard = value;
    }
  
    setCreativeGroups(updatedGroups);
  };
  

  const addCreativeToGroup = (groupIndex: number) => {
    const updatedGroups = [...creativeGroups];
    updatedGroups[groupIndex].creatives.push({
      creative_id: uuidv4(),
      file_url: "",
      auto_endcard: true,
      type: "VIDEO",
    });
    setCreativeGroups(updatedGroups);
  };

  const handleSubmit = async () => {

    try {
      // Upload creatives one by one
      for (const group of creativeGroups) {
        for (const creative of group.creatives) {
          console.log('prepost',creative)
          await axios.post("http://localhost:8000/creatives", creative);
        }

        await axios.post("http://localhost:8000/creative-groups", {
          creative_group_id: group.group_id,
          name: group.group_name,
          creative_ids: group.creatives.map((c) => c.creative_id),
        });
      }

      await axios.put(`http://localhost:8000/campaigns/${campaignId}/attach-groups`, {
        creative_group_ids: creativeGroups.map((g) => g.group_id),
      });

      alert("Campaign and assets uploaded successfully!");
    
      setCreativeGroups([]);
      navigate(`/`);

    } catch (err) {
      console.error("Upload error:", err);
      alert("Something went wrong during upload.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold">{ creativeGroups?.length <= 0 ? 'No groups added yet...' : ''} </h1>
        <button
          onClick={handleSubmit}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl text-sm"
        >
          Submit All
        </button>
      </div>
  
      {creativeGroups.map((group, groupIndex) => (
        <div key={group.group_id} className="bg-white shadow rounded-xl p-6 space-y-4 border">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold underline">Group: {group.group_name || "Untitled"}</h2>
          </div>
  
          <input
            type="text"
            placeholder="Enter Creative Group Name"
            value={group.group_name}
            onChange={(e) => updateCreativeGroup(groupIndex, "group_name", e.target.value)}
            className="w-full border p-2 rounded"
          />
  
          <table className="w-full text-sm border mt-2">
            <thead className="bg-gray-100">
              <tr>
                <th className="text-left p-2 border">File URL</th>
                <th className="text-left p-2 border">Type</th>
                <th className="text-left p-2 border">Auto Endcard</th>
              </tr>
            </thead>
            <tbody>
              {group.creatives.map((creative, creativeIndex) => (
                <tr key={creative.creative_id}>
                  <td className="p-2 border">
                    <input
                      type="text"
                      value={creative.file_url}
                      onChange={(e) =>
                        updateCreative(groupIndex, creativeIndex, "file_url", e.target.value)
                      }
                      className="w-full border p-1 rounded"
                    />
                  </td>
                  <td className="p-2 border">
                    <select
                      value={creative.type}
                      onChange={(e) =>
                        updateCreative(groupIndex, creativeIndex, "type", e.target.value)
                      }
                      className="border rounded p-1 w-full"
                    >
                      <option value="VIDEO">VIDEO</option>
                      <option value="IMAGE">IMAGE</option>
                    </select>
                  </td>
                  <td className="p-2 border">
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={creative.auto_endcard}
                        onChange={(e) =>
                          updateCreative(groupIndex, creativeIndex, "auto_endcard", e.target.checked)
                        }
                      />
                      <span>Yes</span>
                    </label>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
  
          <div className="text-right">
            <button
              onClick={() => addCreativeToGroup(groupIndex)}
              className="bg-blue-500 text-white px-4 py-1 rounded-xl shadow hover:bg-blue-600"
            >
              + Add Creative
            </button>
          </div>
        </div>
      ))}
  
      <div className="text-right">
        <button
          onClick={addCreativeGroup}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm"
        >
          + Add Creative Group
        </button>
      </div>
    </div>
  );
  
}
