import React, { useState, useEffect } from "react";
import PageTitle from "../../components/Typography/PageTitle";
import { Input, Textarea, Label, Button } from "@windmill/react-ui";
import { Link, useHistory, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { unwrapResult } from "@reduxjs/toolkit";
import toast, { Toaster } from "react-hot-toast";
import {
  FulfillingBouncingCircleSpinner,
  HollowDotsSpinner,
} from "react-epic-spinners";
import { Editor } from "@tinymce/tinymce-react";
import {
  clearOrderListStatus,
  clearOrderUpdateStatus,
  fetchOrderById,
  updateOrder,
} from "../Storages/ordersSlice";
import { clearStatuslogByCollectedStatus } from "../Storages/orderlogsSlice";

function EditStatusCollect() {
  let history = useHistory();
  let { id } = useParams();
  const dispatch = useDispatch();

  const statuslogByCollectedStatus = useSelector(
    (status) => status.orderlogs.statuslogByCollectedStatus
  );

  useEffect(() => {
    if (statuslogByCollectedStatus === "succeeded") {
      dispatch(clearStatuslogByCollectedStatus());
    }
  }, [statuslogByCollectedStatus, dispatch]);



  const statuslogByConfirmed = useSelector((state) => state.orders.statuslogByConfirmed);
  const statuslogByConfirmedStatus = useSelector((state) => state.orders.statuslogByConfirmedStatus);
  const orderListStatus = useSelector((state) => state.orders.orderListStatus);
  const orderUpdateStatus = useSelector(
    (state) => state.orders.orderUpdateStatus
  );

  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      number: "", //null
      customer_name: "", //not-null
    },
  });

  useEffect(() => {
    if (orderListStatus === "succeeded") {
      dispatch(clearOrderListStatus());
    }
  }, [orderListStatus, dispatch]);

  useEffect(() => {
    if (orderByIdStatus === "idle") {
      dispatch(fetchOrderById(id));
    }
    reset({
      number: orderById.number, //null
      customer_name: orderById.customer_name, //not-null
      customer_address: orderById.customer_address, //not-null
      to_deliver: orderById.to_deliver, //not-null
      delivery_date: orderById.delivery_date, //not-null
      to_pickup: orderById.to_pickup, //null
      pickup_date: orderById.pickup_date, //null
      status: orderById.status, //not-null
      note: orderById.note,
      explaination: orderById.explaination,
    });
  }, [orderByIdStatus, dispatch]);

  const canSave = orderUpdateStatus === "idle";

  const onSubmit = async (data) => {
    if (canSave)
      try {
        data.id = id;
        data.product_list = product_list;
        const resultAction = await dispatch(updateOrder(data));
        unwrapResult(resultAction);
        if (resultAction.payload[0]) {
          toast.success("Berhasil menambahkan data!");
        }
      } catch (error) {
        if (error) throw toast.error("Gagal menambahkan data!");
      } finally {
        dispatch(clearOrderUpdateStatus());
        history.push("/app/marketing");
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
      <PageTitle>Edit Order</PageTitle>
      {orderByIdStatus === "loading" ? (
        <HollowDotsSpinner className="self-center" color="red" size="8" />
      ) : (
        <div className="px-4 py-3 mb-8 bg-white rounded-lg shadow-md dark:bg-gray-800 ">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid gap-6 mt-4 mb-4 md:grid-cols-2 xl:grid-cols-2">
            <div className="flex justify-between mt-5">
              <div>
                <Button tag={Link} to="/app/shipment" size="small">
                  Cancel
                </Button>
              </div>
              <div>
                {orderUpdateStatus === "loading" ? (
                  <>
                    <FulfillingBouncingCircleSpinner size="20" />
                  </>
                ) : (
                  <Button type="submit" size="small">
                    Update
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

export default EditStatusCollect;
