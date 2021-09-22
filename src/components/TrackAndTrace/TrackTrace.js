import React, { useEffect, useState } from "react";
import PageTitle from "../../components/Typography/PageTitle";
import { Link, useParams } from "react-router-dom";
import {
  Card,
  CardBody,
  Table,
  TableHeader,
  TableCell,
  TableBody,
  TableRow,
  TableContainer,
  Label,
} from "@windmill/react-ui";
import { CheckIcon } from "../../icons";
import { useDispatch, useSelector } from "react-redux";

import SectionTitle from "../../components/Typography/SectionTitle";
import "./style.css";
import ReactHtmlParser from "react-html-parser";
import { fetchStatuslogByOrderId } from "../../pages/Storages/orderlogsSlice";
import { HollowDotsSpinner } from "react-epic-spinners";
import {
  clearOrderListStatus,
  fetchOrderById,
} from "../../pages/Storages/ordersSlice";

function TrackTrace() {
  const dispatch = useDispatch();
  const orderListStatus = useSelector((state) => state.orders.orderListStatus);

  useEffect(() => {
    if (orderListStatus === "succeeded") {
      dispatch(clearOrderListStatus());
    }
  }, [orderListStatus, dispatch]);
  let { id } = useParams();
  console.log(new Date().toISOString());

  const statuslogByOrderId = useSelector(
    (state) => state.orderlogs.statuslogByOrderId
  );
  const statuslogByOrderIdStatus = useSelector(
    (state) => state.orderlogs.statuslogByOrderIdStatus
  );

  const orderById = useSelector((state) => state.orders.orderById);
  const orderByIdStatus = useSelector((state) => state.orders.orderByIdStatus);

  useEffect(() => {
    if (statuslogByOrderIdStatus === "idle") {
      dispatch(fetchStatuslogByOrderId(id));
      dispatch(fetchOrderById(id));
    }
  }, [statuslogByOrderIdStatus, dispatch]);
  console.log(orderById);
  return (
    <>
      <PageTitle>
        <div className="flex justify-between">
          <div>Track & Trace</div>
        </div>
      </PageTitle>
      <SectionTitle>ID #{statuslogByOrderId[0]?.id ?? ""}</SectionTitle>
      <hr className="mb-4" />

      {statuslogByOrderIdStatus === "loading" ? (
        <HollowDotsSpinner className="self-center" color="red" size="8" />
      ) : (
        <>
          <Card className="my-5 text-gray-300">
            <CardBody>
              <div className="track">
                {statuslogByOrderId.map((data) => (
                  <div className={data.status ? "step active" : "step"}>
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

          <TableContainer className="mb-8 ">
            <Table className=" w-full">
              <TableHeader>
                <tr>
                  <TableCell>Employee on duty</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Local time</TableCell>
                </tr>
              </TableHeader>
              <TableBody>
                {statuslogByOrderId.map((data, i) => (
                  <TableRow key={i}>
                    <TableCell>
                      <span className="text-sm">
                        {data?.employees?.name ?? ""}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm">{data.name}</span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm">
                        {data.finish_time
                          ? new Date(data.finish_time).toLocaleString()
                          : ""}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      )}

      <div className="px-4 py-3 mb-8 bg-white rounded-lg shadow-md dark:bg-gray-800 ">
        <div className="grid gap-6 mt-4 mb-4 md:grid-cols-2 xl:grid-cols-2"></div>

        <div className="grid gap-6 mt-4 mb-4 md:grid-cols-2 xl:grid-cols-2">
          <Label>
            <span>SPB Number</span>
            <div className="my-2 p-2 bg-gray-700 text-gray-300">
              {orderById.number}
            </div>
          </Label>
          <Label>
            <span>Customer Name</span>
            <div className="my-2 p-2 bg-gray-700 text-gray-300">
              {orderById.customer_name}
            </div>
          </Label>

          <Label >
            <span>Address</span>
            <div className="my-2 p-2 bg-gray-700 text-gray-300">
              {orderById.customer_address}
            </div>
          </Label>
          <Label>
            <span>Operation Date</span>
            <div className="my-2 p-2 bg-gray-700 text-gray-300">
              {orderById.op_date}
            </div>
          </Label>
          <Label>
            <span>Delivery Date</span>
            <div className="my-2 p-2 bg-gray-700 text-gray-300">
              {orderById.delivery_date}
            </div>
          </Label>

          <Label>
            <span>Pickup Date</span>
            <div className="my-2 p-2 bg-gray-700 text-gray-300">
              {orderById.pickup_date}
            </div>
          </Label>
        </div>

        <Label>
          <span>Product List</span>
          <div className="my-2 p-2 bg-gray-700 text-gray-300">
            {ReactHtmlParser(orderById.product_list)}
          </div>
        </Label>
        <Label>
          <span>Note</span>
          <div className="my-2 p-2 bg-gray-700 text-gray-300">
            {orderById.note}
          </div>
        </Label>
      </div>
    </>
  );
}

export default TrackTrace;
