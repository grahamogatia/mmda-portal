import {Button} from "../components/ui/button.tsx";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "../components/ui/tabs.tsx";
import {locations} from "../api/locations.ts";
import {useNavigate} from "react-router-dom"
import AddAdvisory from "@/components/page/AddAdvisory.tsx";



function Home() {

    const navigate = useNavigate();

    const onClick = () => {
        localStorage.removeItem("user");
        navigate("/login");
    }

    return (
        <div className="flex flex-col items-center justify-center">
            <header className="container border flex justify-between items-center p-4">
                <p className="text-xl font-semibold">MMDA Admin Portal</p>
                <Button type="button" onClick={onClick}>Logout</Button>
            </header>
            <main className="border container">
                <Tabs>
                    <TabsList>
                        <div>
                            {locations.map((location) => {
                                return (
                                    <TabsTrigger value={location.name}>{location.name}</TabsTrigger>
                                )
                            })}
                        </div>
                        <AddAdvisory />
                    </TabsList>
                    <TabsContent value="Tab 1">
                        This is Tab 1
                    </TabsContent>
                    <TabsContent value="Tab 2">

                    </TabsContent>
                    <TabsContent value="Tab 3">

                    </TabsContent>
                    <TabsContent value="Tab 4">

                    </TabsContent>
                    <TabsContent value="Tab 5">

                    </TabsContent>
                    <TabsContent value="Tab 6">

                    </TabsContent>
                    <TabsContent value="Tab 7">

                    </TabsContent>
                    <TabsContent value="Tab 8">

                    </TabsContent>
                    <TabsContent value="Tab 9">

                    </TabsContent>
                </Tabs>
            </main>
        </div>
    );
}

export default Home;