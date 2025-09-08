import { Navigate, useNavigate, useParams } from "react-router-dom";
import { locations } from "@/api/locations";
import { useEffect, useState } from "react";
import { getAdvisoryByLocationFromStore } from "@/api/database";
import { type Advisory } from "@/api/database";
import DisplayItem from "@/components/page/DisplayItem";

function Display() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [advisories, setAdvisories] = useState<Advisory[]>([]);

  useEffect(() => {
    const setup = async () => {
      const location = locations.find((location) => {
        return location.code === id;
      });
      if (!location) {
        navigate("/login");
        return;
      }

      const result = await getAdvisoryByLocationFromStore(location.id);
      setAdvisories(result);
    };
    setup();
  }, [id]);

  if (!id) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="bg-black text-[#FFFF00] h-screen">
      <DisplayItem items={advisories} />
    </div>
  );
}

export default Display;
