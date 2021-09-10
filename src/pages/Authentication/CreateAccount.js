import React from "react";
import PageTitle from "../../components/Typography/PageTitle";
import { Input, Label, Button } from "@windmill/react-ui";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { unwrapResult } from "@reduxjs/toolkit";
import toast, { Toaster } from "react-hot-toast";
import { FulfillingBouncingCircleSpinner } from "react-epic-spinners";
import {
  clearCreateEmployeeStatus,
  createNewEmployee,
} from "../Storages/employeesSlice";
import ImageLight from "../../assets/img/create-account-office.jpeg";
import ImageDark from "../../assets/img/create-account-office-dark.jpeg";

function CreateAccount() {
  const dispatch = useDispatch();

  const createEmployeeStatus = useSelector(
    (state) => state.employees.createEmployeeStatus
  );

  const canSave = createEmployeeStatus === "idle";

  const {
    register,
    handleSubmit,
    reset,
    formState,
    formState: { isSubmitSuccessful },
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data) => {
    if (canSave)
      try {
        console.log(data);
        const resultAction = await dispatch(createNewEmployee(data));
        unwrapResult(resultAction);
        if (resultAction.payload.error === null) {
          toast.success("Berhasil menambahkan data!");
        }
      } catch (error) {
        if (error) throw toast.error("Gagal menambahkan data!");
      } finally {
        dispatch(clearCreateEmployeeStatus());
      }
  };

  React.useEffect(() => {
    if (isSubmitSuccessful) {
      reset({
        email: "",
        password: "",
      });
    }
  }, [formState, reset]);

  return (
    <>
      <Toaster
        position="top-right"
        reverseOrder={false}
        toastOptions={{
          className: "",
          style: {
            marginTop: "90px",
            marginRight: "40px",
            background: "#363636",
            color: "#fff",
            zIndex: 1,
          },
          duration: 2000,
          success: {
            duration: 2000,
            theme: {
              primary: "green",
              secondary: "black",
            },
          },
          error: {
            duration: 2000,
            theme: {
              primary: "red",
              secondary: "black",
            },
          },
        }}
      />
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
              <div className="w-full">
                <h1 className="mb-4 text-xl font-semibold text-gray-700 dark:text-gray-200">
                  Create account
                </h1>
                <form onSubmit={handleSubmit(onSubmit)}>
                  <Label>
                    <span>Email</span>
                    <Input
                      className="mt-1"
                      type="email"
                      {...register("email", { required: true })}
                    />
                  </Label>
                  <Label className="mt-4">
                    <span>Password</span>
                    <Input
                      className="mt-1"
                      placeholder="***************"
                      type="password"
                      {...register("password", { required: true })}
                    />
                  </Label>
                  <div className="mt-4">
                    {createEmployeeStatus === "loading" ? (
                      <>
                        <FulfillingBouncingCircleSpinner size="20" />
                      </>
                    ) : (
                      <Button type="submit" size="small">
                        Submit
                      </Button>
                    )}
                  </div>
                </form>
                <hr className="my-8" />

                <p className="mt-4">
                  <Link
                    className="text-sm font-medium text-purple-600 dark:text-purple-400 hover:underline"
                    to="/login"
                  >
                    Already have an account? Login
                  </Link>
                </p>
              </div>
            </main>
          </div>
        </div>
      </div>
    </>
  );
}

export default CreateAccount;
