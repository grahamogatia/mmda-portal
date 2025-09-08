import { GripHorizontal, SquarePen, Trash2 } from "lucide-react";
import { Button } from "../ui/button";
import { Switch } from "../ui/switch";
import type { Advisory } from "@/api/database";

function AdvisoryItem(item: Advisory) {
    return(
        <div className="flex flex-col gap-1 border p-2 pb-5 rounded">
            <div className="flex justify-between">
                <Button variant="ghost" size="icon">
                    <GripHorizontal/>
                </Button>
                <div className="space-x-2">
                    <Switch className="mr-4"/>
                    <Button variant="ghost" size="icon">
                        <SquarePen />
                    </Button>
                    <Button variant="ghost" size="icon"> 
                        <Trash2 />
                    </Button>
                </div>
            </div>
            <div
            className="px-3 text-center" 
            dangerouslySetInnerHTML={{__html: item.content}}>
    
            </div>
        </div>
    );
}

export default AdvisoryItem;