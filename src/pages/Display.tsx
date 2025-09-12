import { Navigate, useNavigate, useParams } from "react-router-dom";
import { locations } from "@/api/locations";
import { useEffect, useState } from "react";
import { type Advisory } from "@/api/database";
import DisplayItem from "@/components/page/DisplayItem";
import { collection, onSnapshot, orderBy, query, where } from "firebase/firestore";
import { db } from "@/api/firebase";

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

      const q = query(
        collection(db, "advisories"),
        where("location", "==", location.id),
        where("enabled", "==", 1),
        where("isDeleted", "==", 0),
        orderBy("order", "asc"),
      );
  
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const results = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Advisory[];
        setAdvisories(results.sort((a, b) => a.order - b.order));
      });
  
      return () => unsubscribe();
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
