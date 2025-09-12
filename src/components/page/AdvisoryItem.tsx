import { GripHorizontal, Trash2 } from "lucide-react";
import { Button } from "../ui/button";
import { Switch } from "../ui/switch";
import { deleteAdvisory, updateAdvisory, type Advisory } from "@/api/database";
import UpdateAdvisory from "./UpdateAdvisory";
import CustomAlertDialog from "../ui/customalertdialog";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

function AdvisoryItem(item: Advisory) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    setActivatorNodeRef,
  } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const onToggleAdvisory = async () => {
    await updateAdvisory({ ...item, enabled: item.enabled == 0 ? 1 : 0 });
  };

  const onClickDeleteButton = async () => {
    await deleteAdvisory(item);
  };

  return (
    <div
      className="bg-white flex flex-col gap-1 border p-2 pb-5 rounded"
      ref={setNodeRef}
      style={style}
    >
      <div className="flex justify-between">
        <Button
          variant="ghost"
          size="icon"
          {...attributes}
          {...listeners}
          aria-label="Drag to reorder"
          className="cursor-grab active:cursor-grabbing"
          ref={setActivatorNodeRef}
        >
          <GripHorizontal className="text-gray-400" />
        </Button>
        <div className="space-x-2">
          <CustomAlertDialog
            type="toggleAdvisoryAlert"
            onConfirm={onToggleAdvisory}
            trigger={
              <Switch checked={Boolean(item.enabled)} className="mr-3" />
            }
            triggerAsChild={false}
          />
          <UpdateAdvisory {...item} />
          <CustomAlertDialog
            type="deleteAdvisoryAlert"
            onConfirm={onClickDeleteButton}
            trigger={
              <Button variant="ghost" size="icon">
                <Trash2 />
              </Button>
            }
          />
        </div>
      </div>
      <div
        className="px-3 text-center"
        dangerouslySetInnerHTML={{ __html: item.content }}
      ></div>
    </div>
  );
}

export default AdvisoryItem;
