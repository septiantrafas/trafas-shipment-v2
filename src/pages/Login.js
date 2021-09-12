import React, { useRef } from "react";
import ImageLight from "../assets/img/login-office.jpeg";
import ImageDark from "../assets/img/login-office-dark.jpeg";
import { Label, Input, Button } from "@windmill/react-ui";
import { useHistory } from "react-router-dom";
import { useAuth } from "../context/Auth";

function Login() {
  const emailRef = useRef();
  const passwordRef = useRef();
  const { signIn } = useAuth();
  const history = useHistory();

  async function handleSubmit(e) {
    e.preventDefault();
    const email = emailRef.current.value;
    const password = passwordRef.current.value;
    const { error } = await signIn({ email, password });
    if (error) {
      alert("error signing in");
    } else {
      history.push("/app");
    }
  }

  return (
    <div className="flex items-center min-h-screen p-6 bg-gray-50 dark:bg-gray-900">
      <div className="flex-1 h-full max-w-4xl mx-auto overflow-hidden bg-white rounded-lg shadow-xl dark:bg-gray-800">
        <div className="flex flex-col overflow-y-auto md:flex-row">
          <div className="h-32 md:h-auto md:w-1/2">
            <img
              aria-hidden="true"
              className="object-cover w-full h-full dark:hidden"
              src={ImageLight}
              alt="Office"
            />
            <img
              aria-hidden="true"
              className="hidden object-cover w-full h-full dark:block"
              src={ImageDark}
              alt="Office"
            />
          </div>
          <main className="flex items-center justify-center p-6 sm:p-12 md:w-1/2">
            <form onSubmit={handleSubmit}>
              <div className="w-full">
                <h1 className="mb-4 text-xl font-semibold text-gray-700 dark:text-gray-200">
                  MITRA FAJAR SELARAS
                </h1>
                <Label>
                  <span>Email</span>
                  <Input
                    className="mt-1"
                    type="email"
                    placeholder="john@doe.com"
                    name="email"
                    ref={emailRef}
                    autocomplete="emailRef"
                  />
                </Label>
                <Label className="mt-4">
                  <span>Password</span>
                  <Input
                    className="mt-1"
                    type="password"
                    placeholder="***************"
                    ref={passwordRef}
                    name="password"
                    autocomplete="passwordRef"
                  />
                </Label>
                <Button type="submit" className="mt-4" block>
                  Log in
                </Button>
              </div>
            </form>
          </main>
        </div>
      </div>
    </div>
  );
}

export default Login;
