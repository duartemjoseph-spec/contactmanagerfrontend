"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { isLoggedIn, saveToken } from "@/lib/auth";
import { loginUser } from "@/services/userService";
import { LockKeyhole, Mail } from "lucide-react";
import { SquareUser } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [keepSignedIn, setKeepSignedIn] = useState(true);
  const [passwordError, setPasswordError] = useState("");
  const [showToast] = useState(true);
  const [isSigningIn, setIsSigningIn] = useState(false);

  useEffect(() => {
    if (isLoggedIn()) {
      router.push("/dashboard");
    }
  }, [router]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPasswordError("");

    if (!email.trim()) {
      setPasswordError("Email is required.");
      return;
    }

    if (!password.trim()) {
      setPasswordError("Password is required.");
      return;
    }

    try {
      setIsSigningIn(true);

      const token = await loginUser({
        username: email,
        password,
      });

      saveToken(token);
      router.push("/dashboard");
    } catch (error) {
      console.error(error);
      setPasswordError(
        "The password you entered is incorrect. Please try again.",
      );
    } finally {
      setIsSigningIn(false);
    }
  }

  return (
    <main className="min-h-screen bg-white text-slate-900">
      <header className="border-b border-slate-200">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-500 text-white">
              <SquareUser className="h-4 w-4" />
            </div>
            <span className="text-base font-bold text-indigo-500">
              ContactManager
            </span>
          </div>

          <button
            type="button"
            className="text-sm font-medium text-slate-500 transition hover:text-slate-700"
          >
            Support
          </button>
        </div>
      </header>

      <section className="flex min-h-[calc(100vh-65px)] flex-col items-center justify-between px-6 py-10">
        <div className="flex w-full max-w-sm flex-1 flex-col items-center pt-6">
          {showToast && (
            <div className="mb-5 flex w-full items-center gap-3 rounded-xl border border-indigo-200 bg-indigo-50 px-4 py-3 text-sm text-slate-700 shadow-sm">
              <span className="text-slate-500">ⓘ</span>
              <span>Welcome back! All systems are operational.</span>
            </div>
          )}

          <div className="w-full rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h1 className="mb-2 text-center text-3xl font-bold text-slate-900">
              Sign In
            </h1>

            <p className="mb-8 text-center text-sm text-slate-500">
              Enter your credentials to access your workspace.
            </p>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Email
                </label>

                <div className="flex items-center rounded-xl border border-slate-300 bg-white px-3">
                  <Mail className="mr-2 h-4 w-4 text-slate-400" />
                  <input
                    id="email"
                    type="text"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-transparent py-3 text-sm text-black outline-none placeholder:text-slate-400"
                    placeholder="john@example.com"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Password
                </label>

                <div
                  className={`flex items-center rounded-xl border bg-white px-3 ${
                    passwordError ? "border-red-400" : "border-slate-300"
                  }`}
                >
                  <LockKeyhole className="mr-2 h-4 w-4 text-slate-400" />
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (passwordError) setPasswordError("");
                    }}
                    className="w-full bg-transparent py-3 text-sm text-black outline-none placeholder:text-slate-400"
                    placeholder="Enter password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="ml-2 text-sm text-slate-400 transition hover:text-slate-600"
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>

                {passwordError && (
                  <p className="mt-2 text-sm font-medium text-red-500">
                    {passwordError}
                  </p>
                )}
              </div>

              <div className="flex items-center justify-between gap-4">
                <label className="flex items-center gap-2 text-sm text-slate-600">
                  <input
                    type="checkbox"
                    checked={keepSignedIn}
                    onChange={() => setKeepSignedIn((prev) => !prev)}
                    className="h-4 w-4 rounded border-slate-300 accent-indigo-500"
                  />
                  Keep me signed in
                </label>

                <Link
                  href="#"
                  className="text-sm font-semibold text-indigo-500 transition hover:text-indigo-600"
                >
                  Forgot Password?
                </Link>
              </div>

              <button
                disabled={isSigningIn}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-500 px-4 py-3 font-semibold text-white transition hover:bg-indigo-600 disabled:opacity-70"
              >
                {isSigningIn ? "Signing In..." : "Sign In to Dashboard"}
                <span>›</span>
              </button>
            </form>

            <div className="mt-6 border-t border-slate-200 pt-6 text-center text-sm text-slate-500">
              New to the platform?{" "}
              <Link
                href="/signup"
                className="font-semibold text-indigo-500 transition hover:text-indigo-600"
              >
                Create an account
              </Link>
            </div>
          </div>

          <div className="mt-6 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
            Secure AES-256 Encryption Active
          </div>
        </div>

        <footer className="mt-10 flex w-full max-w-6xl flex-col items-center justify-between gap-4 border-t border-slate-200 pt-6 text-xs font-semibold uppercase tracking-wide text-slate-400 md:flex-row">
          <p>© 2024 ContactManager Inc. Secure Access.</p>

          <div className="flex items-center gap-5">
            <Link href="#" className="hover:text-slate-600">
              Privacy
            </Link>
            <Link href="#" className="hover:text-slate-600">
              Terms
            </Link>
            <Link href="#" className="hover:text-slate-600">
              Security
            </Link>
          </div>
        </footer>
      </section>
    </main>
  );
}
