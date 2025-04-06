//import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSearchParams } from "react-router-dom";
import CreativeGroupForm from "../Components/CreativeGroupForm";

const CreativeGroupsPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  console.log('serParam:', searchParams.get("campaignId"))
  const name = searchParams?.get("name")


  const handleBack = () => {
    navigate(`/`);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Campaign {name}</h1>
      <button onClick={handleBack} className="mt-4 text-blue-600">
        Go Back
      </button>
     
        <CreativeGroupForm />
     
    </div>
  );
};

export default CreativeGroupsPage;
