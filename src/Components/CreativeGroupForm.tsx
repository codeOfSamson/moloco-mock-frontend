import { useState } from "react";

type Creative = {
  type: string;
  auto_endcard: boolean;
  file_url: string;
};

type CreativeGroupFormProps = {
  groupId: string;
  onSubmit: (groupId: string, creatives: Creative[]) => void;
};


export default function CreativeGroupForm({ groupId, onSubmit }: CreativeGroupFormProps) {
    console.log('creative group form:', groupId)
  const [groupName, setGroupName] = useState("");
  const [creatives, setCreatives] = useState<Creative[]>([
    { type: "VIDEO", auto_endcard: true, file_url: "" },
  ]);

  const handleCreativeChange = (index: number, field: keyof Creative, value: any) => {
    const updated = creatives.map((c, i) => (i === index ? { ...c, [field]: value } : c));
    setCreatives(updated);
  };

  const addCreative = () => {
    setCreatives([...creatives, { type: "VIDEO", auto_endcard: true, file_url: "" }]);
  };

  const handleSubmit = () => {
    if (!groupName.trim()) return alert("Group name is required");
    onSubmit(groupName, creatives);
    setGroupName("");
    setCreatives([{ type: "VIDEO", auto_endcard: true, file_url: "" }]);
  };

  return (
    <div className="border p-4 rounded shadow">
      <h2 className="text-lg font-bold mb-2">Create Creative Group</h2>
      <input
        type="text"
        placeholder="Group Name"
        value={groupName}
        onChange={(e) => setGroupName(e.target.value)}
        className="border p-2 mb-4 w-full"
      />
      {creatives.map((creative, idx) => (
        <div key={idx} className="mb-4">
          <input
            type="text"
            placeholder="File URL"
            value={creative.file_url}
            onChange={(e) => handleCreativeChange(idx, "file_url", e.target.value)}
            className="border p-2 mr-2 w-2/3"
          />
          <label className="mr-2">
            <input
              type="checkbox"
              checked={creative.auto_endcard}
              onChange={(e) => handleCreativeChange(idx, "auto_endcard", e.target.checked)}
            />{" "}
            Auto Endcard
          </label>
        </div>
      ))}
      <button onClick={addCreative} className="bg-blue-500 text-white px-2 py-1 rounded mr-2">+ Add Creative</button>
      <button onClick={handleSubmit} className="bg-green-600 text-white px-4 py-2 rounded">Create Group</button>
    </div>
  );
}
