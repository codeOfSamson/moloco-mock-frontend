import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import { useSearchParams } from "react-router-dom";


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
  console.log('here,', campaignId)
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

  console.log(99, creativeGroups)

  const handleSubmit = async () => {

    //const campaign_id = campaignId;


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

      // Upload campaign last, linking creative group IDs
      await axios.put(`http://localhost:8000/campaigns/${campaignId}/attach-groups`, {
        creative_group_ids: creativeGroups.map((g) => g.group_id),
      });

      alert("Campaign and assets uploaded successfully!");
      // Reset form
      //setCampaignName("");
      setCreativeGroups([]);
    } catch (err) {
      console.error("Upload error:", err);
      alert("Something went wrong during upload.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Create Campaign</h1>
        <button
          onClick={handleSubmit}
          className="bg-green-600 text-white px-6 py-2 rounded shadow hover:bg-green-700"
        >
          Submit All
        </button>
      </div>

      <div className="space-y-8">
        {creativeGroups.map((group, groupIndex) => (
          <div key={group.group_id} className="border p-4 rounded shadow">
            <input
              type="text"
              placeholder="Creative Group Name"
              value={group.group_name}
              onChange={(e) =>
                updateCreativeGroup(groupIndex, "group_name", e.target.value)
              }
              className="border p-2 w-full mb-4"
            />
            {group.creatives.map((creative, creativeIndex) => (
              <div key={creative.creative_id} className="mb-4 space-y-2">
                <input
                  type="text"
                  placeholder="File URL"
                  value={creative.file_url}
                  onChange={(e) =>
                    updateCreative(groupIndex, creativeIndex, "file_url", e.target.value)
                  }
                  className="border p-2 w-full"
                />
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={creative.auto_endcard}
                    onChange={(e) =>
                      updateCreative(groupIndex, creativeIndex, "auto_endcard", e.target.checked)
                    }
                  />
                  <span>Auto Endcard</span>
                </label>
              </div>
            ))}
            <button
              onClick={() => addCreativeToGroup(groupIndex)}
              className="bg-blue-500 text-white px-4 py-1 rounded"
            >
              + Add Creative
            </button>
          </div>
        ))}
      </div>

      <div className="pt-4">
        <button
          onClick={addCreativeGroup}
          className="bg-indigo-500 text-white px-6 py-2 rounded hover:bg-indigo-600"
        >
          + Add Creative Group
        </button>
      </div>
    </div>
  );
}
