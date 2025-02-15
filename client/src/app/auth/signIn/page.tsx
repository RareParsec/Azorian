"use client";
import { auth } from "@/config/firebase";
import { FirebaseError } from "firebase/app";
import { sendPasswordResetEmail, signInWithEmailAndPassword } from "firebase/auth";
import Link from "next/link";
import React, { FormEvent, useState } from "react";
import toast from "react-hot-toast";

enum ErrorType {
  email = "email",
  password = "password",
}

type ErrorFromat = {
  [key in ErrorType]?: string[];
};

function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);

  const [errors, setErrors] = useState<ErrorFromat>({});

  const [showForgotPasswordUI, setShowForgotPasswordUI] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({});

    if (!email) return setErrors({ email: ["Email is required"] });
    if (!password) return setErrors({ password: ["Password is required"] });

    setLoading(true);
    try {
      await toast.promise(signInWithEmailAndPassword(auth, email, password), {
        loading: "Signing in...",
        success: "Signed in successfully",
        error: "Failed to sign in",
      });
    } catch (error) {
      if (error instanceof FirebaseError && (error.code === "auth/user-not-found" || error.code === "auth/invalid-email"))
        return setErrors({ email: ["No user with that email"] });

      if (error instanceof FirebaseError && error.code === "auth/wrong-password") return setErrors({ password: ["Wrong credentials"] });
    } finally {
      setLoading(false);
    }

    try {
      const res = await fetch("http://localhost:4000/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      console.log(data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const forgotPassword = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!email) return setErrors({ email: ["Email is required"] });

    try {
      await toast.promise(sendPasswordResetEmail(auth, email), {
        loading: "Sending email...",
        success: "Email sent successfully",
        error: "Failed to send email",
      });
    } catch (error) {
      if (error instanceof FirebaseError && error.code === "auth/user-not-found") return setErrors({ email: ["No user with that email"] });
    }
  };

  return (
    <div className="h-[100vh] flex flex-col justify-center items-center">
      <div className="font-bold text-xl">Sign In</div>
      <form
        className="flex flex-col w-[70vw] max-w-[400px]"
        onSubmit={(e) => {
          showForgotPasswordUI ? forgotPassword(e) : handleSubmit(e);
        }}
      >
        <div className="flex flex-col mb-2">
          <input
            type="text"
            className="border border-zinc-900 rounded-md px-2 py-1 caret-yellow-500 outline-none"
            placeholder="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setErrors((prev) => ({ ...prev, email: [] }));
            }}
          />
          <div className="text-red-500">{errors.email?.[0]}</div>
        </div>
        {showForgotPasswordUI || (
          <div className="flex flex-col mb-2">
            <input
              type="text"
              className="border border-zinc-900 rounded-md px-2 py-1 caret-yellow-500 outline-none"
              placeholder="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setErrors((prev) => ({ ...prev, password: [] }));
              }}
            />
            <div className="text-red-500">{errors.password?.[0]}</div>
          </div>
        )}
        <button type="submit" disabled={loading} className="bg-zinc-900 text-white py-2 rounded-md">
          {loading ? "Loading..." : showForgotPasswordUI ? "Send email" : "Sign In"}
        </button>
      </form>
      {showForgotPasswordUI || (
        <>
          <button
            className="text-blue-500"
            onClick={() => {
              setShowForgotPasswordUI(true);
              setErrors({});
            }}
          >
            Forgot password?
          </button>
          <Link href="/auth/signUp">Sign Up</Link>
        </>
      )}
      {showForgotPasswordUI && (
        <button
          className="text-blue-500"
          onClick={() => {
            setShowForgotPasswordUI(false);
            setErrors({});
          }}
        >
          go back
        </button>
      )}
    </div>
  );
}

export default SignIn;
