import React, { useState } from "react";
import { supabase } from "@/lib/supabase";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Mail, KeyRound, User, Loader2, PartyPopper } from "lucide-react";
import { AuthError } from "@supabase/supabase-js";
import { useNavigate } from "react-router";

type AuthMode = "signIn" | "signUp";

export function AuthForm({ className, ...props }: React.ComponentProps<"div">) {
  const navigate = useNavigate();
  const [mode, setMode] = useState<AuthMode>("signUp"); // Default to Sign Up
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const DEMO_EMAIL = import.meta.env.VITE_DEMO_EMAIL;
  const DEMO_PASSWORD = import.meta.env.VITE_DEMO_PASSWORD;

  const handleDemoLogin = () => {
    setMode("signIn");
    setError(null);
    setSuccess(false);

    let emailIndex = 0;
    const emailInterval = setInterval(() => {
      setFormData((prev) => ({
        ...prev,
        email: DEMO_EMAIL.slice(0, emailIndex + 1),
      }));
      emailIndex++;
      if (emailIndex >= DEMO_EMAIL.length) {
        clearInterval(emailInterval);
        let passwordIndex = 0;
        const passwordInterval = setInterval(() => {
          setFormData((prev) => ({
            ...prev,
            password: DEMO_PASSWORD.slice(0, passwordIndex + 1),
          }));
          passwordIndex++;
          if (passwordIndex >= DEMO_PASSWORD.length) {
            clearInterval(passwordInterval);
            document.getElementById("auth-submit-button")?.click();
          }
        }, 50);
      }
    }, 50);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    let authError: AuthError | null = null;

    if (mode === "signUp") {
      const { error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
      });
      authError = error;
      if (!error) {
        setSuccess(true);
      }
    } else {
      // mode === 'signIn'
      const { error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });
      authError = error;
      navigate("/home");
    }

    if (authError) {
      setError(authError.message);
    }
    setLoading(false);
  };

  // Function to toggle between Sign In and Sign Up
  const toggleMode = () => {
    setMode((prevMode) => (prevMode === "signIn" ? "signUp" : "signIn"));
    // Reset state on mode change
    setError(null);
    setSuccess(false);
    setFormData({ email: "", password: "" });
  };

  return (
    <div
      className={cn("flex flex-col gap-6 w-full max-w-md", className)}
      {...props}
    >
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-2xl tracking-tight">
            {mode === "signIn" ? "Welcome Back!" : "Create an Account"}
          </CardTitle>
          <CardDescription>
            {mode === "signIn"
              ? "Enter your credentials to access your account."
              : "Enter your credentials or continue as a demo user."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleDemoLogin}
                className="w-full flex items-center gap-2"
              >
                <User className="h-4 w-4" />
                Sign in with Demo Account
              </Button>

              <div className="relative my-2">
                <Separator />
                <span className="absolute left-1/2 -translate-x-1/2 -top-3 bg-card px-2 text-xs text-muted-foreground">
                  OR
                </span>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@example.com"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="pl-9"
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                    className="pl-9"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-3 pt-2">
                <Button
                  id="auth-submit-button"
                  type="submit"
                  className="w-full"
                  disabled={loading}
                >
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {loading
                    ? mode === "signIn"
                      ? "Signing In..."
                      : "Creating Account..."
                    : mode === "signIn"
                    ? "Sign In"
                    : "Create Account"}
                </Button>
              </div>
            </div>

            {error && (
              <p className="mt-4 text-center text-sm text-destructive">
                {error}
              </p>
            )}

            {success && (
              <div className="mt-4 rounded-md border border-green-300 bg-green-50 p-3 text-center text-sm text-green-700 flex items-center justify-center gap-2">
                <PartyPopper className="h-4 w-4" />
                <div>
                  <p className="font-semibold">Registration successful!</p>
                  <p>Check your email to confirm your account.</p>
                </div>
              </div>
            )}

            <p className="mt-6 text-center text-sm text-muted-foreground">
              {mode === "signIn"
                ? "Don't have an account?"
                : "Already have an account?"}{" "}
              <button
                type="button"
                onClick={toggleMode}
                className="font-semibold text-primary underline-offset-4 hover:underline"
              >
                {mode === "signIn" ? "Sign Up" : "Sign In"}
              </button>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
