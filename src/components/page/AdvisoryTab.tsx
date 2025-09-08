import { type Location } from "@/api/locations";
import { type Advisory, getAdvisoryByLocationFromStore } from "@/api/database";
import { useEffect, useState } from "react";

function AdvisoryTab(location: Location) {
  const [advisories, setAdvisories] = useState<Advisory[]>([]);

  useEffect(() => {
    const setup = async () => {
      const result = await getAdvisoryByLocationFromStore(location.id);
      setAdvisories(result);
    };
    setup();
  }, [location.id]);

  return(
    <div>
        <header className="font-semibold">{ location.name }</header>
        <div>
            {advisories.map(item => {
                return <p key={item.id}>
                    {item.content}
                </p>
            })}
        </div>
    </div>
  );
}

export default AdvisoryTab;
