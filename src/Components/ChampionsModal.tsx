import { CreativeGroup } from "../types";

type ChampionsModalProps = {
    setShowChampionsModal: React.Dispatch<React.SetStateAction<boolean>>;
    champions: CreativeGroup[];
};

const ChampionsModal: React.FC<ChampionsModalProps> = ({ setShowChampionsModal, champions }) => {

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
    <div className="bg-white p-8 rounded-2xl shadow-xl max-w-3xl w-full space-y-6">
      <h3 className="text-2xl font-bold text-gray-800">Champion Creative Groups</h3>

      {champions?.length === 0 ? (
        <p className="text-gray-600">No champions have been added yet...</p>
      ) : (
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
              {champions?.map((group) => (
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
      )}

      <div className="flex justify-end">
        <button
          onClick={() => setShowChampionsModal(false)}
          className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-xl text-sm"
        >
          Close
        </button>
      </div>
    </div>
  </div>
  );
};

export default ChampionsModal;
