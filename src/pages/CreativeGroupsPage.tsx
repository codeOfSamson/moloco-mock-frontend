import { useNavigate, useSearchParams } from "react-router-dom";
import CreativeGroupForm from "../Components/CreativeGroupForm";

const CreativeGroupsPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const campaignName = searchParams.get("name");

  const handleBack = () => {
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-10">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-800 align-center">Campaign Setup for: {campaignName}</h1>
            <p className="text-gray-500 mt-1">
              Add a new creative groups to <span className="font-larg text-blue-600">{campaignName}</span>
            </p>
          </div>
          <button
            onClick={handleBack}
            className="text-sm text-blue-600 hover:underline"
          >
            ← Back to Campaigns
          </button>
        </div>
        <h1 className="text-xl font-bold p-2">Creative Groups List:</h1>

        <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-200">
          
          <CreativeGroupForm />
        </div>
      </div>
    </div>
  );
};

export default CreativeGroupsPage;
