import React, { useState, useEffect } from "react";
import PageTitle from "../../components/Typography/PageTitle";
import { Input, Textarea, Label, Button, Select } from "@windmill/react-ui";
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
import {
  clearStatuslogByCollectedStatus,
  clearStatuslogByDeliveredStatus,
  clearStatuslogByDoneStatus,
  clearStatuslogByReturnedStatus,
} from "../Storages/orderlogsSlice";
import { clearReportListStatus } from "../Storages/reportsSlice";

function EditOrder() {
  let history = useHistory();
  let { id } = useParams();
  const dispatch = useDispatch();
  const [product_list, setProduct_list] = useState("");

  const orderById = useSelector((state) => state.orders.orderById);
  const orderByIdStatus = useSelector((state) => state.orders.orderByIdStatus);
  const orderListStatus = useSelector((state) => state.orders.orderListStatus);
  const orderUpdateStatus = useSelector(
    (state) => state.orders.orderUpdateStatus
  );

  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      number: "", //null
      customer_name: "", //not-null
      customer_address: "", //not-null
      to_deliver: false, //not-null
      delivery_date: "", //not-null
      to_pickup: false, //null
      pickup_date: "", //null
      status: "confirmed", //not-null
      note: "",
      explaination: "",
    },
  });

  useEffect(() => {
    if (orderListStatus === "succeeded") {
      dispatch(clearOrderListStatus());
      dispatch(clearStatuslogByCollectedStatus());
      dispatch(clearStatuslogByDoneStatus());
      dispatch(clearStatuslogByReturnedStatus());
      dispatch(clearStatuslogByDeliveredStatus());
      dispatch(clearReportListStatus());
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
  var date = new Date();
  var min_date = String(date.getFullYear()+
  "-"+(date.getMonth()+1<10? "0"+String(date.getMonth()+1):date.getMonth()+1)+
  "-"+date.getDate()+"T"+"00"+":"+"00"
  )

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
              <Label>
                <span>Pick Up Date</span>
                <Input
                  className="mt-1"
                  type="datetime-local"
                  {...register("pickup_date")}
                  min={min_date}
                />
              </Label>
            </div>
            <Label>
              <span>Product List</span>
              <div className="my-2">
                <Editor
                  apiKey="53pih1o4nmih8lqfxw6b8v8xk1og6bgrjww43pwbdgsf5668"
                  onEditorChange={(data) => setProduct_list(data)}
                  initialValue={orderById.product_list}
                  init={{
                    height: 500,
                    menubar: false,
                    file_picker_types: "image",

                    // images_upload_url: "postAcceptor.php",
                    plugins:
                      "print preview paste importcss searchreplace autolink autosave save directionality code visualblocks visualchars fullscreen image link media template codesample table charmap hr pagebreak nonbreaking anchor toc insertdatetime advlist lists wordcount imagetools textpattern noneditable help charmap quickbars emoticons",
                    imagetools_cors_hosts: ["picsum.photos"],
                    toolbar:
                      "undo redo | bold italic underline strikethrough | ",
                    toolbar_sticky: true,
                    skin: "oxide-dark",
                    content_css: "dark",

                    content_style:
                      "body { font-family:Helvetica,Arial,sans-serif; font-size:14px; resize:vertical ; ",
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
                {orderUpdateStatus === "loading" ? (
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

export default EditOrder;
