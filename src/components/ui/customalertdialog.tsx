import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./alert-dialog";

const dialogConfig = {
  updateAdvisoryAlert: {
    title: "Update Advisory?",
    description:
      "This will modify the details of the advisory. The previous content will be replaced with your updated information. ",
    triggerLabel: "Update",
  },
  deleteAdvisoryAlert: {
    title: "Delete Advisory?",
    description:
      "This will permanently delete the advisory and cannot be undone.",
    triggerLabel: "Delete",
  },
  toggleAdvisoryAlert: {
    title: "Toggle Advisory?",
    description:
    "This will toggle the advisory.",
  },
} as const;

type DialogType = keyof typeof dialogConfig;

type CustomAlertDialogProps = {
  type: DialogType;
  onConfirm?: () => void;
};

function CustomAlertDialog({ type, onConfirm }: CustomAlertDialogProps) {
  const { title, description } = dialogConfig[type];

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction asChild>
            <button
              type="submit"
              onClick={() => {
                if (onConfirm) onConfirm();
              }}
            >
              Continue
            </button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default CustomAlertDialog;
