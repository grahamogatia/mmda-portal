import { useState } from "react";
import { Button } from "../ui/button";
import { Combobox } from "../ui/combobox";
import Editable from "../ui/editable";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { type Location, locations } from "@/api/locations";

function AddAdvisory() {
  const [location, setLocation] = useState<Location[]>([]);
  const [content, setContent] = useState<string>("");

  const onLocationChange = (id: number) => {
    setLocation((current) => {
      const selectedLocation = locations.find((loc) => loc.id === id);

      if (!selectedLocation) return current;

      return current.find((item) => item.id === id)
        ? current.filter((item) => item.id !== id)
        : [...current, selectedLocation];
    });
  };
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Add</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Advisory</DialogTitle>
          <Combobox value={location} setValue={onLocationChange} />
          <Editable content={content} setContent={setContent} />
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}

export default AddAdvisory;
