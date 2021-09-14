import React, { useEffect, useState } from "react";
import PageTitle from "../Typography/PageTitle";
import { Input, Card, CardBody, Label, Button } from "@windmill/react-ui";
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
  clearStatuslogByDeliveredStatus,
  clearStatuslogByDoneStatus,
  clearStatuslogByOrderIdStatus,
  clearStatuslogByReturnedStatus,
  clearStatuslogEmployeeUpdateStatus,
  fetchStatuslogByOrderId,
  updateStatusLog,
} from "../../pages/Storages/orderlogsSlice";
import {
  clearOrderByIdStatus,
  clearOrderListStatus,
  updateDataByCollectedStatus,
} from "../../pages/Storages/ordersSlice";
import {
  clearEmployeeList,
  fetchEmployee,
} from "../../pages/Storages/employeesSlice";
import TrackTrace from "../TrackAndTrace/TrackTrace";
import { CheckIcon } from "../../icons";
import { data } from "browserslist";
import { Editor } from "@tinymce/tinymce-react";
import SectionTitle from "../Typography/SectionTitle";
import { clearReportListStatus } from "../../pages/Storages/reportsSlice";

function EditStatusCollect() {
  let history = useHistory();
  const dispatch = useDispatch();

  const [product_list, setProduct_list] = useState("");
  const [statuslogByOrderIdData, setStatuslogByOrderIdData] = useState("");
  const [statuslogState, setStatuslogState] = useState("");

  let { id } = useParams();
  let { order_id } = useParams();
  let { status_name } = useParams();

  const orderListStatus = useSelector((state) => state.orders.orderListStatus);
  const orderByIdStatus = useSelector((state) => state.orders.orderByIdStatus);
  const statuslogByOrderIdStatus = useSelector(
    (state) => state.orderlogs.statuslogByOrderIdStatus
  );
  const statuslogByCollectedStatus = useSelector(
    (state) => state.orderlogs.statuslogByCollectedStatus
  );
  const statuslogByDoneStatus = useSelector(
    (state) => state.orderlogs.statuslogByDoneStatus
  );
  const statuslogByReturnedStatus = useSelector(
    (state) => state.orderlogs.statuslogByReturnedStatus
  );
  const statuslogByDeliveredStatus = useSelector(
    (state) => state.orderlogs.statuslogByDeliveredStatus
  );
  const reportListStatus = useSelector(
    (state) => state.reports.reportListStatus
  );

  useEffect(() => {
    if (orderListStatus === "succeeded") {
      dispatch(clearOrderListStatus());
    }
  }, [orderListStatus, dispatch]);
  useEffect(() => {
    if (statuslogByCollectedStatus === "succeeded") {
      dispatch(clearStatuslogByCollectedStatus());
      dispatch(fetchStatuslogByOrderId(order_id));
    }
  }, [statuslogByCollectedStatus, dispatch]);
  useEffect(() => {
    if (orderByIdStatus === "succeeded") {
      dispatch(clearOrderByIdStatus());
    }
  }, [orderByIdStatus, dispatch]);
  useEffect(() => {
    if (statuslogByReturnedStatus === "succeeded") {
      dispatch(clearStatuslogByReturnedStatus());
    }
  }, [statuslogByReturnedStatus, dispatch]);
  useEffect(() => {
    if (statuslogByDeliveredStatus === "succeeded") {
      dispatch(clearStatuslogByDeliveredStatus());
    }
  }, [statuslogByDeliveredStatus, dispatch]);
  useEffect(() => {
    if (statuslogByDoneStatus === "succeeded") {
      dispatch(clearStatuslogByDoneStatus());
    }
  }, [statuslogByDoneStatus, dispatch]);
  useEffect(() => {
    if (reportListStatus === "succeeded") {
      dispatch(clearReportListStatus());
    }
  }, [reportListStatus, dispatch]);

  const statuslogUpdateStatus = useSelector(
    (state) => state.orderlogs.statuslogUpdateStatus
  );

  const statuslogByOrderId = useSelector(
    (state) => state.orderlogs.statuslogByOrderId
  );
  useEffect(() => {
    if (statuslogByOrderIdStatus === "idle") {
      dispatch(fetchStatuslogByOrderId(order_id));
    }
  }, [statuslogByOrderIdStatus, order_id, dispatch]);

  useEffect(() => {
    if (statuslogByOrderIdStatus === "succeeded") {
      setStatuslogByOrderIdData(
        statuslogByOrderId?.find((data) => data.id === id) ?? ""
      );
      if (statuslogByOrderId.length === 3) {
        if (status_name === "confirmed") {
          setStatuslogState(
            statuslogByOrderId?.find((data) => data.name === "confirmed") ?? ""
          );
        } else if (status_name === "returned") {
          setStatuslogState(
            statuslogByOrderId?.find((data) => data.name === "collected") ?? ""
          );
        }
      } else if (statuslogByOrderId.length === 4) {
        if (status_name === "confirmed") {
          setStatuslogState(
            statuslogByOrderId?.find((data) => data.name === "confirmed") ?? ""
          );
        } else if (status_name === "collected") {
          setStatuslogState(
            statuslogByOrderId?.find((data) => data.name === "collected") ?? ""
          );
        } else if (status_name === "returned") {
          setStatuslogState(
            statuslogByOrderId?.find((data) => data.name === "delivered") ?? ""
          );
        }
      } else if (statuslogByOrderId.length === 5) {
        setStatuslogState(
          statuslogByOrderId?.find((data) => data.name === status_name) ?? ""
        );
      }
    }
  }, [statuslogByOrderIdStatus, id, dispatch]);

  console.log(statuslogByOrderId);

  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      number: "",
      recipient_name: "",
      recipient_phone: "",
      status: true,
    },
  });

  const canSave = statuslogUpdateStatus === "idle";

  const onSubmit = async (data) => {
    if (true)
      try {
        data.id = id;
        data.order_id = order_id;
        data.product_list = product_list;
        await dispatch(updateDataByCollectedStatus(data));
        const resultAction = await dispatch(updateStatusLog(data));
        unwrapResult(resultAction);
        if (resultAction.payload[0]) {
          toast.success("Berhasil menambahkan data!");
        }
      } catch (error) {
        if (error) throw toast.error("Gagal menambahkan data!");
      } finally {
        dispatch(clearStatuslogEmployeeUpdateStatus());
        dispatch(clearStatuslogByOrderIdStatus());
        dispatch(clearEmployeeList());
      }
  };

  // console.log(
  //   statuslogByOrderId.find((data) => data.name === status_name).status
  // );

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
      <PageTitle>Update Status</PageTitle>

      {statuslogUpdateStatus === "loading" ? (
        <HollowDotsSpinner className="self-center" color="red" size="8" />
      ) : !statuslogState.status ? (
        <SectionTitle>Not Open Yet, Please follow up !</SectionTitle>
      ) : (
        <div>
          <Card className="mb-5 text-gray-300">
            <CardBody>
              <div className="track">
                {statuslogByOrderId.map((data) => (
                  <div
                    key={data.id}
                    className={data.status ? "step active" : "step"}
                  >
                    <span className="icon">
                      <i className="flex justify-center p-1">
                        <CheckIcon className="self-center" />
                      </i>
                    </span>
                    <span className="text">{data.name}</span>
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>
          <div className="px-4 py-3 mb-8 bg-white rounded-lg shadow-md dark:bg-gray-800 ">
            {statuslogByOrderIdData.status ? (
              <span className=" text-gray-400">Updated !</span>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="grid gap-6 mt-4 mb-4 md:grid-cols-2 xl:grid-cols-1">
                  {statuslogByOrderIdData?.name === "collected" ? (
                    <>
                      <Label>
                        <span>SPB Number</span>
                        <Input
                          className="mt-1"
                          {...register("number", { required: true })}
                        />
                      </Label>
                      <Label>
                        <span>Product List</span>
                        <div className="my-2">
                          <Editor
                            apiKey="53pih1o4nmih8lqfxw6b8v8xk1og6bgrjww43pwbdgsf5668"
                            onEditorChange={(data) => setProduct_list(data)}
                            initialValue={
                              statuslogByOrderIdData?.orders?.product_list ?? ""
                            }
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
                    </>
                  ) : (
                    ""
                  )}
                  {statuslogByOrderIdData?.name === "delivered" ? (
                    <>
                      <Label>
                        <span>Recipient Name</span>
                        <Input
                          className="mt-1"
                          {...register("recipient_name", { required: true })}
                        />
                      </Label>
                      <Label>
                        <span>Recipient Phone</span>
                        <Input
                          className="mt-1"
                          {...register("recipient_phone", { required: true })}
                        />
                      </Label>
                    </>
                  ) : (
                    ""
                  )}
                </div>
                <div className="flex justify-between mt-5">
                  <div>
                    <Button tag={Link} to="/app" size="small">
                      Cancel
                    </Button>
                  </div>
                  <div>
                    {statuslogUpdateStatus === "loading" ? (
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
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default EditStatusCollect;
