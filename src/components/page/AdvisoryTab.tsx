import { type Location } from "@/api/locations";
import { type Advisory, getAdvisoriesByLocation} from "@/api/database";
import { useEffect, useState } from "react";
import AdvisoryItem from "./AdvisoryItem";

function AdvisoryTab(location: Location) {
  const [advisories, setAdvisories] = useState<Advisory[]>([]);

  useEffect(() => {
    const setup = async () => {
      const result = await getAdvisoriesByLocation(location.id);
      setAdvisories(result);
    };
    setup();
  }, [location.id]);

  return(
    <div>
        <header className="font-semibold">{ location.name }</header>
        <div className="space-y-2">
            {advisories.map(item => {
                return <AdvisoryItem {...item}/>
            })}
        </div>
    </div>
  );
}

export default AdvisoryTab;
