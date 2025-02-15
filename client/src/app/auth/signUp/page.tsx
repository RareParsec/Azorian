"use client";
import React, { FormEvent, useState } from "react";
import {
  emailValidationRules,
  passwordValidationRules,
  usernameValidationRules,
} from "../../../utilities/validationRules";
import { auth } from "@/config/firebase";
import { createUserWithEmailAndPassword, sendEmailVerification, sendSignInLinkToEmail } from "firebase/auth";
import toast from "react-hot-toast";
import customAxios from "@/config/axios";
import { FirebaseError } from "firebase/app";
import { CREATE_USER, HANDLE_EMAIL_CONFLICT } from "@/graphql/user";
import Link from "next/link";

enum ErrorType {
  username = "username",
  email = "email",
  password = "password",
}

type ErrorFromat = {
  [key in ErrorType]?: string[];
};

enum StepsForSignUp {
  enteringCredentials = "enteringCredentials",
  verifyingEmail = "verifyingEmail",
  selectingUsername = "selectingUsername",
}

function SignUp() {
  const [email, setEmail] = useState("example@gmail.com");
  const [password, setPassword] = useState("@Password1");
  const [username, setUsername] = useState("example");

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<ErrorFromat>({});

  const [signUpStep, setSignUpStep] = useState<StepsForSignUp>(StepsForSignUp.enteringCredentials);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const newErrors: ErrorFromat = {};

    emailValidationRules.forEach((entry) => {
      entry.rule(email) || (newErrors[ErrorType.email] = [...(newErrors[ErrorType.email] ?? []), entry.message]);
    });
    passwordValidationRules.forEach((entry) => {
      entry.rule(password) ||
        (newErrors[ErrorType.password] = [...(newErrors[ErrorType.password] ?? []), entry.message]);
    });

    setErrors(newErrors);
    if (newErrors.email || newErrors.password) return;

    setLoading(true);
    try {
      await createUserWithEmailAndPassword(auth, email, password);
    } catch (error) {
      if (error instanceof FirebaseError && error.code === "auth/email-already-in-use") {
        try {
          const success = await handleEmailConflict();
          if (!success) return toast.error("Something went wrong...");
          await createUserWithEmailAndPassword(auth, email, password);
        } catch (error) {
          return toast.error("An error occured.");
        }
      } else {
        return toast.error("An error occured.");
      }
    } finally {
      setLoading(false);
    }

    toast.success("User created successfully");
    sendVerfEmail();
  };

  const handleEmailConflict = async () => {
    const { data } = await customAxios.post("/", {
      query: HANDLE_EMAIL_CONFLICT,
      variables: { email: email },
    });

    console.log(data);
    if (data.errors) return toast.error(data.errors[0].message || "An error occured.");

    return data.data?.handleEmailConflict?.success;
  };

  const sendVerfEmail = async () => {
    const user = auth.currentUser;
    if (!user) return toast.error("Something went wrong...");

    setLoading(true);
    await toast
      .promise(sendEmailVerification(user), {
        loading: "Sending verification email",
        success: "Verification email sent!",
        error: "Failed to send verification email...",
      })
      .then(() => {
        setSignUpStep(StepsForSignUp.verifyingEmail);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const verfEmailCheck = async () => {
    setLoading(true);

    await toast
      .promise(
        async () => {
          await auth.currentUser?.reload();

          if (!auth.currentUser?.emailVerified) return Promise.reject("Email not verified");
        },
        {
          loading: "Checking email verification status",
          success: "Email verified",
          error: "Email not verified",
        }
      )
      .then(() => {
        setSignUpStep(StepsForSignUp.selectingUsername);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const usernameChosen = async () => {
    const newErrors: ErrorFromat = {};

    usernameValidationRules.forEach((entry) => {
      entry.rule(username) ||
        (newErrors[ErrorType.username] = [...(newErrors[ErrorType.username] ?? []), entry.message]);
    });

    if (newErrors.username) return setErrors(newErrors);

    setLoading(true);
    try {
      const { data } = await customAxios.post(
        "/",
        { query: CREATE_USER, variables: { email: email, username: username } },
        {
          headers: {
            forceTokenRefresh: true,
          },
        }
      );

      if (data.errors) return toast.error(data.errors[0].message || "An error occured.");
      if (!data.data?.createUser) return toast.error("An error occured.");

      //add to local storage
      toast.success("User created successfully");
    } catch (error) {
      return toast.error("An error occured.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-[100vh] flex flex-col justify-center items-center">
      <div className="font-bold text-xl">Sign Up</div>
      <form className="flex flex-col w-[70vw] max-w-[400px]" onSubmit={(e) => handleSubmit(e)}>
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
            disabled={!(signUpStep === StepsForSignUp.enteringCredentials)}
          />
          <div className="text-red-500">{errors.email?.[0]}</div>
        </div>
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
            disabled={!(signUpStep === StepsForSignUp.enteringCredentials)}
          />
          <div className="text-red-500">{errors.password?.[0]}</div>
        </div>
        <div className="flex flex-col mb-2">
          <input
            type="text"
            className="border border-zinc-900 rounded-md px-2 py-1 caret-yellow-500 outline-none"
            placeholder="username"
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
              setErrors((prev) => ({ ...prev, username: [] }));
            }}
            disabled={!(signUpStep === StepsForSignUp.selectingUsername)}
          />
          <div className="text-red-500">{errors.username?.[0]}</div>
        </div>
        <button
          type={
            signUpStep === StepsForSignUp.verifyingEmail || signUpStep === StepsForSignUp.selectingUsername
              ? "button"
              : "submit"
          }
          onClick={
            signUpStep === StepsForSignUp.verifyingEmail
              ? verfEmailCheck
              : signUpStep === StepsForSignUp.selectingUsername
              ? usernameChosen
              : undefined
          }
          disabled={loading}
          className="bg-zinc-900 text-white py-2 rounded-md"
        >
          {loading
            ? "Loading..."
            : signUpStep === StepsForSignUp.verifyingEmail
            ? "I've verified my email"
            : signUpStep === StepsForSignUp.selectingUsername
            ? "Yup, looks correct."
            : "Sign Up"}
        </button>

        {signUpStep === StepsForSignUp.verifyingEmail && (
          <>
            <button type="button" onClick={sendVerfEmail} disabled={loading} className="text-black rounded-md">
              Resend verification email
            </button>
            <div>An Email has been sent.</div>
          </>
        )}
      </form>
      <Link href="/auth/signIn">Sign In</Link>
    </div>
  );
}

export default SignUp;
