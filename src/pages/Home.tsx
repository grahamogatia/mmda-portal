import { Button } from "../components/ui/button.tsx";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs.tsx";
import { locations } from "../api/locations.ts";
import { useNavigate } from "react-router-dom"
import AddAdvisory from "@/components/page/AddAdvisory.tsx";



function Home() {

    const navigate = useNavigate();

    const onClick = () => {
        localStorage.removeItem("user");
        navigate("/login");
    }

    return (
        <div className="flex flex-col items-center justify-center">
            <header className="container  flex justify-between items-center p-4">
                <p className="text-xl font-semibold">MMDA Admin Portal</p>
                <Button type="button" onClick={onClick}>Logout</Button>
            </header>
            <main className="border container p-4 shadow rounded-lg space-y-4">
                <AddAdvisory />
                <Tabs orientation="vertical" defaultValue={locations[0].name} className="flex-row h-full">
                    <TabsList className="flex-col h-auto gap-2">
                        {locations.map((location) => {
                            return (
                                <TabsTrigger value={location.name} className="w-full">{location.name}</TabsTrigger>
                            )
                        })}
                    </TabsList>
                    {locations.map(location => {
                        return <TabsContent key={location.id} value={location.name} className="border rounded-lg p-2">
                            {location.name}
                        </TabsContent>
                    })}
                </Tabs>
            </main>
        </div>
    );
}

export default Home;