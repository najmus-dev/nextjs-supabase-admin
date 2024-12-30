"use client";

import { Button } from "@/components/ui/button";
import { CardFooter } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { signIn } from "@/services/auth_services";
import { getProfile } from "@/services/user_services";
import { createClient } from "@/utils/supabase/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const formSchema = z.object({
  email: z.string().email({
    message: "Required",
  }),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters.",
  }),
});

export default function LoginForm() {
  const supabase = createClient();
  const router = useRouter();

  const mutation = useMutation({
    mutationFn: (data: { email: string; password: string }) =>
      signIn(supabase, data.email, data.password),
    onSuccess: async (data) => {
      console.log(data);

      const { data: profile } = await getProfile(supabase, data.data.user.id);

      if (profile.email != "admin@equilinkapp.com") {
        toast.info("Unauthorized user to access the dashboard");
        return;
      }

      router.replace("/");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
    mutation.mutate({ email: values.email, password: values.password });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="grid w-full items-center gap-4">
          <div className="flex flex-col space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="you@example.com" {...field} />
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
                    <Input placeholder="Your password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
        <CardFooter className="flex justify-center mt-10">
          <Button
            type="submit"
            className="px-20"
            size={"lg"}
            loading={mutation.isPending}
          >
            Sign in
          </Button>
        </CardFooter>
      </form>
    </Form>
  );
}
