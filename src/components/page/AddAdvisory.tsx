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
import { advisorySchema } from "@/api/schemas";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { addAdvisoryToStore } from "@/api/database";

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

  const form = useForm<z.infer<typeof advisorySchema>>({
    resolver: zodResolver(advisorySchema),
    defaultValues: {
      content: "",
      location: [],
    }
  });

  const onSubmit = async (values: z.infer<typeof advisorySchema>) => {
    // Check the structure
    // console.log("Form values: ", values);
    await addAdvisoryToStore(content, location.map(loc => loc.id));
  }

  /*type Advisory = {
      id: number;
      content: string;
      enabled: 0 | 1;
      location: LocationId[];
      order: number;
      isDeleted: 0 | 1;
    }*/

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
          <Button onClick={onSubmit}>Add</Button>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}

export default AddAdvisory;
