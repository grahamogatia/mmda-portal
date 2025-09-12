import { type Location } from "@/api/locations";
import { updateAdvisory, type Advisory } from "@/api/database";
import { useEffect, useState } from "react";
import AdvisoryItem from "./AdvisoryItem";
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { db } from "@/api/firebase";
import {
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { FileQuestion, FileQuestionMark } from "lucide-react";

function AdvisoryTab(location: Location) {
  const [advisories, setAdvisories] = useState<Advisory[]>([]);
  const sensors = useSensors(useSensor(PointerSensor));

  useEffect(() => {
    const q = query(
      collection(db, "advisories"),
      where("location", "==", location.id),
      where("isDeleted", "==", 0),
      orderBy("order", "asc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const results = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Advisory[];
      setAdvisories(results.sort((a, b) => a.order - b.order));
    });

    return () => unsubscribe(); // Clean up listener on unmount
  }, [location.id]);

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    let reordered = [...advisories];
    if (!over || !active) return;

    if (active.id !== over.id) {
      setAdvisories((items) => {
        const oldIndex = items.findIndex((ad) => ad.id === active.id);
        const newIndex = items.findIndex((ad) => ad.id === over.id);

        const updatedArray = arrayMove(items, oldIndex, newIndex);

        // Updated Order
        reordered = updatedArray.map((advisory, idx) => ({
          ...advisory,
          order: idx,
        }));

        return updatedArray;
      });

      for (const advisory of reordered) {
        await updateAdvisory(advisory);
      }
    }
  };

  return (
    <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
      <SortableContext
        items={advisories}
        strategy={verticalListSortingStrategy}
      >
        <div className="h-[60vh] overflow-y-auto">
          <header className="font-semibold">
            <a
              href={`http://localhost:9209/${location.code}`}
              rel="noopener noreferrer"
              target="_blank"
            >
              {location.name}
            </a>
          </header>
          <div className="flex flex-col justify-center space-y-2">
            {advisories.length > 0 ? (
              advisories.map((item) => <AdvisoryItem key={item.id} {...item} />)
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center rounded-lg">
                <FileQuestion className="h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-500">
                  No advisories yet
                </h3>
                <p className="text-sm text-gray-400">
                  You don’t have any advisories at the moment.
                </p>
              </div>
            )}
          </div>
        </div>
      </SortableContext>
    </DndContext>
  );
}

export default AdvisoryTab;
