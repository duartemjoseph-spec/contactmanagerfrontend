"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { isLoggedIn, saveToken } from "@/lib/auth";
import { createAccount, loginUser } from "@/services/userService";
import { SquareUser } from "lucide-react";

export default function SignupPage() {
  const router = useRouter();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(true);

  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [showToast] = useState(true);
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    if (isLoggedIn()) {
      router.push("/dashboard");
    }
  }, [router]);

  function resetErrors() {
    setNameError("");
    setEmailError("");
    setPasswordError("");
    setConfirmPasswordError("");
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    resetErrors();

    let hasError = false;

    if (!fullName.trim()) {
      setNameError("Full name is required.");
      hasError = true;
    }

    if (!email.trim()) {
      setEmailError("Email is required.");
      hasError = true;
    } else if (!email.includes("@")) {
      setEmailError("Please enter a valid email address.");
      hasError = true;
    }

    if (!password.trim()) {
      setPasswordError("Password is required.");
      hasError = true;
    } else if (password.length < 8) {
      setPasswordError("Password must be at least 8 characters.");
      hasError = true;
    }

    if (!confirmPassword.trim()) {
      setConfirmPasswordError("Please confirm your password.");
      hasError = true;
    } else if (password !== confirmPassword) {
      setConfirmPasswordError("Passwords do not match.");
      hasError = true;
    }

    if (!agreeTerms) {
      setConfirmPasswordError("You must agree to the terms to continue.");
      hasError = true;
    }

    if (hasError) return;

    try {
      setIsCreating(true);

      await createAccount({
        username: email,
        password,
      });

      const token = await loginUser({
        username: email,
        password,
      });

      saveToken(token);
      router.push("/dashboard");
    } catch (error) {
  console.error(error);

  if (error instanceof Error) {
    setEmailError(error.message);
  } else {
    setEmailError("Could not create account.");
  }
} finally {
      setIsCreating(false);
    }
  }

  return (
    <main className="min-h-screen bg-white text-slate-900">
      <header className="border-b border-slate-200">
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
              <span>Create your account to access your workspace.</span>
            </div>
          )}

          <div className="w-full rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h1 className="mb-2 text-center text-3xl font-bold text-slate-900">
              Create Account
            </h1>

            <p className="mb-8 text-center text-sm text-slate-500">
              Enter your details below to create your workspace account.
            </p>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label
                  htmlFor="fullName"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Full Name
                </label>

                <div
                  className={`flex items-center rounded-xl border bg-white px-3 ${
                    nameError ? "border-red-400" : "border-slate-300"
                  }`}
                >
                  <span className="mr-2 text-slate-400">👤</span>
                  <input
                    id="fullName"
                    type="text"
                    value={fullName}
                    onChange={(e) => {
                      setFullName(e.target.value);
                      if (nameError) setNameError("");
                    }}
                    className="w-full bg-transparent py-3 text-sm text-black outline-none placeholder:text-slate-400"
                    placeholder="John Doe"
                  />
                </div>

                {nameError && (
                  <p className="mt-2 text-sm font-medium text-red-500">
                    {nameError}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Email
                </label>

                <div
                  className={`flex items-center rounded-xl border bg-white px-3 ${
                    emailError ? "border-red-400" : "border-slate-300"
                  }`}
                >
                  <span className="mr-2 text-slate-400">✉️</span>
                  <input
                    id="email"
                    type="text"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (emailError) setEmailError("");
                    }}
                    className="w-full bg-transparent py-3 text-sm text-black outline-none placeholder:text-slate-400"
                    placeholder="john@example.com"
                  />
                </div>

                {emailError && (
                  <p className="mt-2 text-sm font-medium text-red-500">
                    {emailError}
                  </p>
                )}
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
                  <span className="mr-2 text-slate-400">🔒</span>
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

              <div>
                <label
                  htmlFor="confirmPassword"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Confirm Password
                </label>

                <div
                  className={`flex items-center rounded-xl border bg-white px-3 ${
                    confirmPasswordError ? "border-red-400" : "border-slate-300"
                  }`}
                >
                  <span className="mr-2 text-slate-400">🔒</span>
                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      if (confirmPasswordError) setConfirmPasswordError("");
                    }}
                    className="w-full bg-transparent py-3 text-sm text-black outline-none placeholder:text-slate-400"
                    placeholder="Confirm password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                    className="ml-2 text-sm text-slate-400 transition hover:text-slate-600"
                  >
                    {showConfirmPassword ? "Hide" : "Show"}
                  </button>
                </div>

                {confirmPasswordError && (
                  <p className="mt-2 text-sm font-medium text-red-500">
                    {confirmPasswordError}
                  </p>
                )}
              </div>

              <label className="flex items-center gap-2 text-sm text-slate-600">
                <input
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={() => setAgreeTerms((prev) => !prev)}
                  className="h-4 w-4 rounded border-slate-300 accent-indigo-500"
                />
                I agree to the terms and security policy
              </label>

              <button
                disabled={isCreating}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-500 px-4 py-3 font-semibold text-white transition hover:bg-indigo-600 disabled:opacity-70"
              >
                {isCreating ? "Creating Account..." : "Create Account"}
                <span>›</span>
              </button>
            </form>

            <div className="mt-6 border-t border-slate-200 pt-6 text-center text-sm text-slate-500">
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-semibold text-indigo-500 transition hover:text-indigo-600"
              >
                Sign in
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