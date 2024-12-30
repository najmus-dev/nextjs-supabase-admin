import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import LoginForm from "./components/login_form";
import Image from "next/image";


export default async function Login() {
  return (
    <div className="flex h-screen w-screen items-center justify-center bg-background">
      <Card className="w-[420px] p-5">
        <CardHeader>
          <div className="flex items-center justify-center">
            <Image src="/brand/logo.svg" width={200} height={200} alt="Logo" />
          </div>
          <CardTitle>Sign in as Admin</CardTitle>
          <CardDescription>
            Please enter your email and password.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <LoginForm />
        </CardContent>
      </Card>
    </div>
  );
}
