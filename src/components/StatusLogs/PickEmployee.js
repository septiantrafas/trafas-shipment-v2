import React, { useEffect } from "react";
import PageTitle from "../Typography/PageTitle";
import { Input, Select, Label, Button } from "@windmill/react-ui";
import { Link, useHistory, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { unwrapResult } from "@reduxjs/toolkit";
import toast, { Toaster } from "react-hot-toast";
import {
  FulfillingBouncingCircleSpinner,
  HollowDotsSpinner,
} from "react-epic-spinners";
import {
  clearStatuslogByCollectedStatus,
  clearStatuslogEmployeeUpdateStatus,
  updateEmployeeLog,
} from "../../pages/Storages/orderlogsSlice";
import {
  clearEmployeeList,
  fetchEmployee,
} from "../../pages/Storages/employeesSlice";

function PickEmployee() {
  let history = useHistory();
  let { id } = useParams();
  let { type } = useParams();

  const dispatch = useDispatch();

  const statuslogByCollectedStatus = useSelector(
    (status) => status.orderlogs.statuslogByCollectedStatus
  );

  useEffect(() => {
    if (statuslogByCollectedStatus === "succeeded") {
      dispatch(clearStatuslogByCollectedStatus());
    }
  }, [statuslogByCollectedStatus, dispatch]);

  const employeeList = useSelector((status) => status.employees.employeeList);
  const employeeListStatus = useSelector(
    (status) => status.employees.employeeListStatus
  );

  useEffect(() => {
    if (employeeListStatus === "idle") {
      dispatch(fetchEmployee());
    }
  }, [employeeListStatus, dispatch]);

  const statuslogEmployeeUpdateStatus = useSelector(
    (state) => state.orderlogs.statuslogEmployeeUpdateStatus
  );

  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      employee_id: "",
      target_time: "",
      employee2: null,
      employee3: null,
    },
  });

  const canSave = statuslogEmployeeUpdateStatus === "idle";

  const onSubmit = async (data) => {
    if (canSave)
      try {
        data.id = id;
        console.log(data);
        const resultAction = await dispatch(updateEmployeeLog(data));
        unwrapResult(resultAction);
        if (resultAction.payload[0]) {
          toast.success("Berhasil menambahkan data!");
        }
      } catch (error) {
        if (error) throw toast.error("Gagal menambahkan data!");
      } finally {
        dispatch(clearStatuslogEmployeeUpdateStatus());
        dispatch(clearEmployeeList());
        history.push("/app");
      }
  };
  var date = new Date();
  var min_date = String(
    date.getFullYear() +
      "-" +
      (date.getMonth() + 1 < 10
        ? "0" + String(date.getMonth() + 1)
        : date.getMonth() + 1) +
      "-" +
      date.getDate() +
      "T" +
      "00" +
      ":" +
      "00"
  );
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
      <PageTitle>Choose Employee</PageTitle>
      {statuslogEmployeeUpdateStatus === "loading" ? (
        <HollowDotsSpinner className="self-center" color="red" size="8" />
      ) : (
        <div className="px-4 py-3 mb-8 bg-white rounded-lg shadow-md dark:bg-gray-800 ">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid gap-6 mt-4 mb-4 md:grid-cols-2 xl:grid-cols-2">
              <Label>
                <span>Employee</span>
                <Select
                  className="mt-1"
                  {...register("employee_id", { required: true })}
                >
                  {employeeList
                    .filter((data) =>
                      type === "courier"
                        ? data.role === "admin_courier" ||
                          data.role === "staff_courier" ||
                          data.role === "admin_marketing" ||
                          data.role === "staff_marketing"
                        : type === "logistic"
                        ? data.role === "admin_logistic" ||
                          data.role === "staff_logistic"
                        : type === "support"
                        ? data.role === "admin_support" ||
                          data.role === "staff_support"
                        : ""
                    )
                    .map((emp) => {
                      return (
                        <option value={emp.id}>
                          {emp.name} [{emp.role}]
                        </option>
                      );
                    })}
                </Select>
              </Label>
              <Label>
                <span>Target</span>
                <Input
                  className="mt-1"
                  type="datetime-local"
                  {...register("target_time", { required: true })}
                  min={min_date}
                />
              </Label>
              <Label>
                <span>Second Employee</span>
                <Select className="mt-1" {...register("employee2")}>
                  <option value={null} selected>
                    ...
                  </option>
                  {employeeList
                    .filter((data) =>
                      type === "courier"
                        ? data.role === "admin_courier" ||
                          data.role === "staff_courier" ||
                          data.role === "admin_marketing" ||
                          data.role === "staff_marketing"
                        : type === "logistic"
                        ? data.role === "admin_logistic" ||
                          data.role === "staff_logistic"
                        : type === "support"
                        ? data.role === "admin_support" ||
                          data.role === "staff_support"
                        : ""
                    )
                    .map((emp) => {
                      return (
                        <option value={emp.id}>
                          {emp.name} [{emp.role}]
                        </option>
                      );
                    })}
                </Select>
              </Label>
              <Label>
                <span>Third Employee</span>
                <Select className="mt-1" {...register("employee3")}>
                  <option value={null} selected>
                    ...
                  </option>
                  {employeeList
                    .filter((data) =>
                      type === "courier"
                        ? data.role === "admin_courier" ||
                          data.role === "staff_courier" ||
                          data.role === "admin_marketing" ||
                          data.role === "staff_marketing"
                        : type === "logistic"
                        ? data.role === "admin_logistic" ||
                          data.role === "staff_logistic"
                        : type === "support"
                        ? data.role === "admin_support" ||
                          data.role === "staff_support"
                        : ""
                    )
                    .map((emp) => {
                      return (
                        <option value={emp.id}>
                          {emp.name} [{emp.role}]
                        </option>
                      );
                    })}
                </Select>
              </Label>
            </div>
            <div className="flex justify-between mt-5">
              <div>
                <Button tag={Link} to="/app" size="small">
                  Cancel
                </Button>
              </div>
              <div>
                {statuslogEmployeeUpdateStatus === "loading" ? (
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
      )}
    </>
  );
}

export default PickEmployee;
