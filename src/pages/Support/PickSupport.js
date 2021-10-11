import React, { useEffect } from "react";
import PageTitle from "../../components/Typography/PageTitle";
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
  clearSupportListStatus,
  clearSupportUpdateStatus,
  updateSupport,
} from "../Storages/supportsSlice";
import { clearEmployeeList, fetchEmployee } from "../Storages/employeesSlice";

function PickSupport() {
  let history = useHistory();
  let { id } = useParams();
  let { type } = useParams();

  const dispatch = useDispatch();

  const supportListStatus = useSelector(
    (status) => status.supports.supportListStatus
  );

  useEffect(() => {
    if (supportListStatus === "succeeded") {
      dispatch(clearSupportListStatus());
    }
  }, [supportListStatus, dispatch]);

  const employeeList = useSelector((status) => status.employees.employeeList);
  const employeeListStatus = useSelector(
    (status) => status.employees.employeeListStatus
  );

  useEffect(() => {
    if (employeeListStatus === "idle") {
      dispatch(fetchEmployee());
    }
  }, [employeeListStatus, dispatch]);

  const supportUpdateStatus = useSelector(
    (state) => state.supports.supportUpdateStatus
  );

  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      employee_id: "",
    },
  });

  const canSave = supportUpdateStatus === "idle";

  const onSubmit = async (data) => {
    if (canSave)
      try {
        data.id = id;
        console.log(data);
        const resultAction = await dispatch(updateSupport(data));
        unwrapResult(resultAction);
        if (resultAction.payload[0]) {
          toast.success("Berhasil menambahkan data!");
        }
      } catch (error) {
        if (error) throw toast.error("Gagal menambahkan data!");
      } finally {
        dispatch(clearSupportUpdateStatus());
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
      <PageTitle>Select Employee</PageTitle>
      {supportUpdateStatus === "loading" ? (
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
            </div>
            <div className="flex justify-between mt-5">
              <div>
                <Button tag={Link} to="/app" size="small">
                  Cancel
                </Button>
              </div>
              <div>
                {supportUpdateStatus === "loading" ? (
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

export default PickSupport;
