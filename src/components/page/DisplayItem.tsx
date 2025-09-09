import type { Advisory } from "@/api/database";
import { useEffect, useState } from "react";

const TIME_INTERVAL = 1000;

function DisplayItem({items}: {items:Advisory[]}) {
    const [index, setIndex] = useState(0);

    useEffect(() => {
        if (items.length === 0) return;

        const interval = setInterval(() => {
            setIndex((prev) => (prev + 1) % items.length);
        }, TIME_INTERVAL);

        return () => clearInterval(interval);
    }, [items]);

    useEffect(() => {
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