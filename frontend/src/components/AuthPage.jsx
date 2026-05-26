import { useState } from "react";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AuthPage({ onAuth }) {
  const [mode, setMode] = useState("login"); // "login" | "register"
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data =
        mode === "login"
          ? await api.login({ email: form.email, password: form.password })
          : await api.register({ name: form.name, email: form.email, password: form.password });

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      onAuth(data.user);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/60 flex items-center justify-center px-4">
      <Card className="w-full max-w-sm shadow-md">
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2.5 mb-1">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center shadow-sm">
              <span className="text-primary-foreground font-bold text-sm">$</span>
            </div>
            <span className="font-semibold text-lg tracking-tight">Expense Tracker</span>
          </div>
          <CardTitle className="text-base font-medium text-muted-foreground">
            {mode === "login" ? "Sign in to your account" : "Create an account"}
          </CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "register" && (
              <div className="space-y-1.5">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="John Doe"
                  value={form.name}
                  onChange={handleChange}
                  required
                />
              </div>
            )}

            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Min. 6 characters"
                value={form.password}
                onChange={handleChange}
                required
              />
            </div>

            {error && (
              <p className="text-sm text-red-500">{error}</p>
            )}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Please wait…" : mode === "login" ? "Sign In" : "Create Account"}
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-4">
            {mode === "login" ? "Don't have an account?" : "Already have an account?"}{" "}
            <button
              type="button"
              className="text-primary underline underline-offset-2 font-medium"
              onClick={() => { setMode(mode === "login" ? "register" : "login"); setError(""); }}
            >
              {mode === "login" ? "Register" : "Sign In"}
            </button>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
