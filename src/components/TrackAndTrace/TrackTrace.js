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
} from "@windmill/react-ui";
import { CheckIcon } from "../../icons";
import { useDispatch, useSelector } from "react-redux";

import SectionTitle from "../../components/Typography/SectionTitle";
import "./style.css";
import ReactHtmlParser from "react-html-parser";
import { fetchStatuslogByOrderId } from "../../pages/Storages/orderlogsSlice";
import { HollowDotsSpinner } from "react-epic-spinners";

function TrackTrace({ response }) {
  const dispatch = useDispatch();
  let { id } = useParams();

  const statuslogByOrderId = useSelector(
    (state) => state.orderlogs.statuslogByOrderId
  );
  const statuslogByOrderIdStatus = useSelector(
    (state) => state.orderlogs.statuslogByOrderIdStatus
  );

  useEffect(() => {
    if (statuslogByOrderIdStatus === "idle") {
      dispatch(fetchStatuslogByOrderId(id));
    }
  }, [statuslogByOrderIdStatus, dispatch]);

  const [dataTable, setDataTable] = useState([]);

  useEffect(() => {
    setDataTable(statuslogByOrderId);
  }, [statuslogByOrderId]);

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
    </>
  );
}

export default TrackTrace;
