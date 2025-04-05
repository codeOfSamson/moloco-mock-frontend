import { useState } from "react";
import CreativeGroupForm from "./CreativeGroupForm";

const CreativeGroupsPage = () => {
  const [groupCount, setGroupCount] = useState(1);
  const [groupIds, setGroupIds] = useState<string[]>(["Creative_Group_1"]);

  const handleAddGroup = () => {
    const newId = `Creative_Group_${groupCount + 1}`;
    setGroupIds([...groupIds, newId]);
    setGroupCount(groupCount + 1);
  };

  const handleSaveGroup = (groupId: string, creatives: any[]) => {
    console.log("Saving group:", groupId);
    console.log("Creatives:", creatives);

    // TODO: POST to backend
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Creative Groups</h1>

      {groupIds.map((id) => (
        <CreativeGroupForm groupId={id} onSubmit={handleSaveGroup} />
      ))}

      <button onClick={handleAddGroup} className="mt-4 text-blue-600">
        + Add New Creative Group
      </button>
    </div>
  );
};

export default CreativeGroupsPage;
