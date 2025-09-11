import { Button } from "../ui/button";
import Editable from "../ui/editable";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { updateAdvisorySchema } from "@/api/schemas";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import type z from "zod";
import { SquarePen } from "lucide-react";
import { toast } from "sonner";
import { updateAdvisory, type Advisory } from "@/api/database";
import CustomAlertDialog from "../ui/customalertdialog";
import { useState } from "react";

function UpdateAdvisory(item: Advisory) {
  const [open, setOpen] = useState(false);

  const form = useForm<z.infer<typeof updateAdvisorySchema>>({
    resolver: zodResolver(updateAdvisorySchema),
    defaultValues: {
      content: item.content,
    },
  });

  const onSubmit = async (values: z.infer<typeof updateAdvisorySchema>) => {
    try {
      console.log("Submitting values:", values);

      const result = await updateAdvisory({
        ...item,
        content: values.content,
      });

      if (result) {
        toast.success("Successfully updated advisory.");
        form.reset(values); // reset to updated values
      }
    } catch (err) {
      console.error("Failed to update advisory:", err);
      toast.error("Failed to update advisory.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <SquarePen />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Advisory</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Enter Advisory Here</FormLabel>
                  <FormControl>
                    <Editable
                      content={field.value}
                      setContent={(content) => {
                        field.onChange(content);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div>
              <CustomAlertDialog
                type="updateAdvisoryAlert"
                onConfirm={async () => {
                  await form.handleSubmit(async (values) => {
                    await onSubmit(values);
                    setOpen(false);
                  })();
                }}
              />
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export default UpdateAdvisory;
