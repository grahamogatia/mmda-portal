import { Button } from "../components/ui/button.tsx";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs.tsx";
import { locations } from "../api/locations.ts";
import { useNavigate } from "react-router-dom";
import AddAdvisory from "@/components/page/AddAdvisory.tsx";
import AdvisoryTab from "@/components/page/AdvisoryTab.tsx";
import SelectInterval from "@/components/page/SelectInterval.tsx";

function Home() {
  const navigate = useNavigate();

  const onClick = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };
  return (
    <div className="flex flex-col items-center justify-center">
      <header className="container  flex justify-between items-center p-4 bg-[#04173D] text-white">
        <p className="text-xl font-semibold">MMDA Admin Portal</p>
        <div className="flex items-center gap-x-4">
          <div className="flex items-center gap-x-2">
            <strong>Display Interval:</strong>
            <SelectInterval />
          </div>

          <Button type="button" onClick={onClick} className="cursor-pointer" variant="destructive">
            Logout
          </Button>
        </div>
      </header>
      <main className="relative container p-4 rounded-lg space-y-4">
        <Tabs
          orientation="vertical"
          defaultValue={locations[0].name}
          className="flex-row h-full"
        >
          <TabsList className="flex-col h-auto gap-2 shadow-md border bg-[#04173D]">
            {locations.map((location) => {
              return (
                <TabsTrigger value={location.name} className="w-full text-white data-[state=active]:text-[#04173D]">
                  {location.name}
                </TabsTrigger>
              );
            })}
          </TabsList>
          {locations.map((location) => {
            return (
              <TabsContent
                key={location.id}
                value={location.name}
                className="border rounded-lg p-2 shadow-md"
              >
                <AdvisoryTab {...location} />
              </TabsContent>
            );
          })}
          <Button className="absolute bottom-6 right-6 p-0 flex items-center justify-center">
            <AddAdvisory />
          </Button>
        </Tabs>
      </main>
    </div>
  );
}

export default Home;
