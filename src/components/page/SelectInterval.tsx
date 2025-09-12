import { getDisplayInterval, updateDisplayInterval } from "@/api/database";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useEffect, useState } from "react";

function SelectInterval() {
  const [interval, setInterval] = useState<string | undefined>(undefined);
  const [pendingValue, setPendingValue] = useState<string | null>(null);

  useEffect(() => {
    const fetchInterval = async () => {
      const data = await getDisplayInterval();
      if (data && data.interval) {
        setInterval(String(data.interval));
      }
    };
    fetchInterval();
  }, []);

  const handleConfirm = async () => {
    if (pendingValue) {
      setInterval(pendingValue);
      await updateDisplayInterval({ interval: Number(pendingValue) });
      setPendingValue(null);
    }
  };

  const handleCancel = () => {
    setPendingValue(null);
  };

  return (
    <>
      <Select
        value={interval}
        onValueChange={(value) => setPendingValue(value)} // don't save immediately
      >
        <SelectTrigger className="w-[160px]">
          <SelectValue placeholder="Select interval" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Interval (seconds)</SelectLabel>
            {Array.from({ length: 11 }, (_, i) => {
              const value = 10 + i * 5;
              return (
                <SelectItem value={String(value)} key={value}>
                  {value} seconds
                </SelectItem>
              );
            })}
          </SelectGroup>
        </SelectContent>
      </Select>

      <AlertDialog
        open={!!pendingValue}
        onOpenChange={(open) => !open && handleCancel()}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Change Interval?</AlertDialogTitle>
            <AlertDialogDescription>
              You are about to set the display interval to{" "}
              <b>{pendingValue} seconds</b>.<br />
              Do you want to continue?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleCancel}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirm}>
              Confirm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

export default SelectInterval;
