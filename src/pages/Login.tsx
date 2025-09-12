import { useForm } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../components/ui/form.tsx";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { loginSchema } from "../api/schemas";
import { loginUser } from "@/api/database.ts";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useEffect } from "react";

function Login() {
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof loginSchema>) => {
    const result = await loginUser(values);
    if (typeof result === "string") {
      toast.error(result);
      return;
    }
    localStorage.setItem("user", JSON.stringify(result));
    navigate("/home");
  };

  useEffect(() => {
    if (localStorage.getItem("user")) {
      navigate("/home");
    }
  }, []);

  return (
    <div className="w-full flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-md">
        <h2 className="mb-6 text-center text-2xl font-bold">
          Administrator Login
        </h2>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input {...field} required />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      {...field}
                      placeholder="••••••••"
                      required
                    />
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
                Sign in
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}

export default Login;
