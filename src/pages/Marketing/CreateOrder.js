import React, { useState, useEffect } from "react";
import PageTitle from "../../components/Typography/PageTitle";
import { Input, Textarea, Label, Button, Select } from "@windmill/react-ui";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { unwrapResult } from "@reduxjs/toolkit";
import toast, { Toaster } from "react-hot-toast";
import { FulfillingBouncingCircleSpinner } from "react-epic-spinners";
import { Editor } from "@tinymce/tinymce-react";
import { useAuth } from "../../context/Auth";
import {
  clearCreateOrderStatus,
  clearOrderListStatus,
  createNewOrder,
} from "../Storages/ordersSlice";

function CreateOrder() {
  const dispatch = useDispatch();
  const orderListStatus = useSelector((state) => state.orders.orderListStatus);

  useEffect(() => {
    if (orderListStatus === "succeeded") {
      dispatch(clearOrderListStatus());
    }
  }, [orderListStatus, dispatch]);

  const { user } = useAuth();

  const [product_list, setProduct_list] = useState("");

  const createOrderStatus = useSelector(
    (state) => state.orders.createOrderStatus
  );

  const canSave = createOrderStatus === "idle";

  const {
    register,
    watch,
    handleSubmit,
    reset,
    formState,
    formState: { isSubmitSuccessful },
  } = useForm({
    defaultValues: {
      employee_id: user.id,
      number: "",
      customer_name: "",
      customer_address: "",
      to_deliver: false,
      delivery_date: "",
      to_pickup: false,
      pickup_date: "",
      product_list: "",
      status: "confirmed",
      note: "",
      explaination: "",
    },
  });

  const onSubmit = async (data) => {
    if (canSave)
      try {
        data.product_list = product_list;
        const resultAction = await dispatch(createNewOrder(data));
        unwrapResult(resultAction);
        if (resultAction.payload.error === null) {
          toast.success("Berhasil menambahkan data!");
        }
      } catch (error) {
        if (error) throw toast.error("Gagal menambahkan data!");
      } finally {
        dispatch(clearCreateOrderStatus());
      }
  };

  React.useEffect(() => {
    if (isSubmitSuccessful) {
      reset({
        employee_id: user.id, //not-null
        number: "", //null
        customer_name: "", //not-null
        customer_address: "", //not-null
        to_deliver: false, //not-null
        delivery_date: "", //not-null
        to_pickup: false, //null
        pickup_date: "", //null
        product_list: "", //not-null
        status: "confirmed", //not-null
        note: "",
        explaination: "",
      });
    }
  }, [formState, reset]);

  const watchAllFields = watch();
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
      <PageTitle>New Order</PageTitle>

      <div className="px-4 py-3 mb-8 bg-white rounded-lg shadow-md dark:bg-gray-800 ">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-6 mt-4 mb-4 md:grid-cols-2 xl:grid-cols-2">
            <Label>
              <span>Customer name</span>
              <Input
                className="mt-1"
                {...register("customer_name", { required: true })}
              />
            </Label>
            <Label>
              <span>Address</span>
              <Input
                className="mt-1"
                {...register("customer_address", { required: true })}
              />
            </Label>

            <Label>Need Delivery ?</Label>
            <div className="">
              <Label radio>
                <Input
                  type="radio"
                  value={true}
                  {...register("to_deliver", { required: true })}
                />
                <span className="ml-2">Yes</span>
              </Label>
              <Label className="ml-6" radio>
                <Input
                  type="radio"
                  value={false}
                  {...register("to_deliver", { required: true })}
                />
                <span className="ml-2">No</span>
              </Label>
            </div>

            <Label>Need Pickup ?</Label>
            <div className="">
              <Label radio>
                <Input
                  type="radio"
                  value="true"
                  {...register("to_pickup", { required: true })}
                />
                <span className="ml-2">Yes</span>
              </Label>
              <Label className="ml-6" radio>
                <Input
                  type="radio"
                  value="false"
                  {...register("to_pickup", { required: true })}
                />
                <span className="ml-2">No</span>
              </Label>
            </div>

            <Label>
              <span>Shipment Date</span>
              <Input
                className="mt-1"
                type="datetime-local"
                {...register("delivery_date", { required: true })}
              />
            </Label>
            <Label>
              <span>Pick Up Date</span>
              <Input
                className="mt-1"
                type="datetime-local"
                {...register("pickup_date", { required: true })}
              />
            </Label>
          </div>
          <Label>
            <span>Product List</span>
            <div className="my-2">
              <Editor
                apiKey="53pih1o4nmih8lqfxw6b8v8xk1og6bgrjww43pwbdgsf5668"
                onEditorChange={(data) => setProduct_list(data)}
                init={{
                  height: 500,
                  menubar: false,
                  plugins: [
                    "advlist autolink lists link image charmap print preview anchor",
                    "searchreplace visualblocks code fullscreen",
                    "insertdatetime media table paste code help wordcount",
                  ],
                  toolbar:
                    "undo redo | formatselect | " +
                    "bold italic backcolor | alignleft aligncenter " +
                    "alignright alignjustify | bullist numlist outdent indent | " +
                    "removeformat | help",
                  content_style:
                    "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
                }}
              />
            </div>
          </Label>
          <Label>
            <span>Note</span>
            <Textarea
              className="mt-1"
              {...register("note", { required: true })}
            />
          </Label>
          <div className="flex justify-between mt-5">
            <div>
              <Button tag={Link} to="/app/marketing" size="small">
                Cancel
              </Button>
            </div>
            <div>
              {createOrderStatus === "loading" ? (
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

export default CreateOrder;
