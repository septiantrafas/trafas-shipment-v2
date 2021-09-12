import React, { useEffect } from "react";
import PageTitle from "../../components/Typography/PageTitle";
import { Input, Label, Button, Select } from "@windmill/react-ui";
import { Link, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { unwrapResult } from "@reduxjs/toolkit";
import toast, { Toaster } from "react-hot-toast";
import { FulfillingBouncingCircleSpinner } from "react-epic-spinners";
import {
  clearEmployeeUpdateStatus,
  fetchEmployeeById,
  updatePassword,
} from "../Storages/employeesSlice";

function EditPassword() {
  let { id } = useParams();
  const dispatch = useDispatch();
  const employeeById = useSelector((state) => state.employees.employeeById);
  const employeeByIdStatus = useSelector(
    (state) => state.employees.employeeByIdStatus
  );
  const employeesUpdateStatus = useSelector(
    (state) => state.employees.employeeUpdateStatus
  );

  const canSave = employeesUpdateStatus === "idle";

  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    if (employeeByIdStatus === "idle") {
      dispatch(fetchEmployeeById(id));
    }
    reset({
      email: employeeById.email,
    });
  }, [employeeByIdStatus, dispatch]);

  const onSubmit = async (data) => {
    if (canSave)
      try {
        data.id = id;
        const resultAction = await dispatch(updatePassword(data));
        unwrapResult(resultAction);
        if (resultAction.payload !== null) {
          toast.success("Berhasil update data!");
        }
      } catch (error) {
        if (error) throw toast.error("Gagal update data!");
      } finally {
        dispatch(clearEmployeeUpdateStatus());
      }
  };

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
          duration: 5000,
          success: {
            duration: 1000,
            theme: {
              primary: "green",
              secondary: "black",
            },
          },
          error: {
            duration: 1000,
            theme: {
              primary: "green",
              secondary: "black",
            },
          },
        }}
      />
      <PageTitle>Edit Employee</PageTitle>

      <div className="px-4 py-3 mb-8 bg-white rounded-lg shadow-md dark:bg-gray-800 ">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-6 mt-4 mb-4 md:grid-cols-2 xl:grid-cols-2">
            <Label>
              <span>Email </span>
              <Input
                disabled
                className="mt-1"
                {...register("email", { required: true })}
              />
            </Label>
            <Label>
              <span>Password </span>
              <Input
                className="mt-1"
                {...register("password", { required: true })}
              />
            </Label>
            <div>
              {employeesUpdateStatus === "loading" ? (
                <>
                  <FulfillingBouncingCircleSpinner size="20" />
                </>
              ) : (
                <Button type="submit" size="small">
                  Submit
                </Button>
              )}
            </div>
          </div>
        </form>
      </div>
    </>
  );
}

export default EditPassword;
