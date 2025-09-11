import { type Location } from "@/api/locations";
import { type Advisory } from "@/api/database";
import { useEffect, useState } from "react";
import AdvisoryItem from "./AdvisoryItem";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { db } from "@/api/firebase";

function AdvisoryTab(location: Location) {
  const [advisories, setAdvisories] = useState<Advisory[]>([]);

  useEffect(() => {
    const q = query(
      collection(db, "advisories"),
      where("location", "==", location.id),
      where("isDeleted", "==", 0)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const results = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Advisory[];
      setAdvisories(results);
    });

    return () => unsubscribe(); // Clean up listener on unmount
  }, [location.id]);

  return (
    <div>
      <header className="font-semibold"><a href={`http://localhost:9209/${location.code}`} rel="noopener noreferrer" target="_blank">{location.name}</a></header>
      <div className="space-y-2">
        {advisories.map((item) => {
          return <AdvisoryItem {...item} />;
        })}
      </div>
    </div>
  );
}

export default AdvisoryTab;
