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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { toast } from "sonner";

function AddAdvisory() {
  const [location, setLocation] = useState<Location[]>([]);
  const [content, setContent] = useState<string>("");

  const form = useForm<z.infer<typeof advisorySchema>>({
    resolver: zodResolver(advisorySchema),
    defaultValues: {
      content: "",
      location: [],
    },
  });

  const onSubmit = async (values: z.infer<typeof advisorySchema>) => {
    // Check the structure
    //console.log("Form values: ", values);
    const result = await addAdvisoryToStore(
      values.content,
      values.location.map((loc: Location) => loc.id)
    );
    if (result) {
      toast.success("Successfully added to the database.")
      form.reset();
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Add</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Advisory</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location</FormLabel>
                  <FormControl>
                    <Combobox
                      value={field.value}
                      setValue={(id) => {
                        const selectedLocation = locations.find(
                          (loc) => loc.id === id
                        );

                        if (!selectedLocation) return field.value;

                        const updated = field.value.find((item: Location) => item.id === id)
                          ? field.value.filter((item: Location) => item.id !== id)
                          : [...field.value, selectedLocation];
                      
                          field.onChange(updated)
                        }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Enter Advisory Here</FormLabel>
                  <FormControl>
                    <Editable 
                    content={field.value}
                    setContent={(content) => {field.onChange(content)}} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div>
              <Button
                type="submit"
                className="w-full rounded-md bg-primary px-4 py-2 font-semibold text-white shadow transition-colors hover:bg-primary/90"
              >
                Add
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export default AddAdvisory;
