import type { Advisory } from "@/api/database";
import { useEffect, useState } from "react";

function DisplayItem({items}: {items:Advisory[]}) {
    const [index, setIndex] = useState(0);

    useEffect(() => {
        if (items.length === 0) return;

        const interval = setInterval(() => {
            setIndex((prev) => (prev + 1) % items.length);
        }, 10000);

        return () => clearInterval(interval);
    }, [items]);

    useEffect(() => {
        // Reset index if items change
        setIndex(0);
    }, [items]);

    const currentItem = items[index];

    return currentItem && (
        <div
            className="text-center max-w-[590px]"
            dangerouslySetInnerHTML={{ __html: currentItem.content }}
        />
    );
}

export default DisplayItem;