import { getDisplayInterval, type Advisory } from "@/api/database";
import { useEffect, useState } from "react";

const MILLISECOND_PER_SECOND = 1000;

function DisplayItem({ items }: { items: Advisory[] }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    let intervalId: number;

    (async () => {
      if (items.length === 0) return;

      const result = await getDisplayInterval();
      const intervalMs =
        Number(result?.interval) * MILLISECOND_PER_SECOND || 10000;

      intervalId = setInterval(() => {
        setIndex((prev) => (prev + 1) % items.length);
      }, intervalMs);
    })();

    return () => clearInterval(intervalId);
  }, [items]);

  useEffect(() => {
    setIndex(0);
  }, [items]);

  const currentItem = items[index];

  return (
    currentItem && (
      <div
        className="text-center max-w-[590px]"
        dangerouslySetInnerHTML={{ __html: currentItem.content }}
      />
    )
  );
}

export default DisplayItem;
