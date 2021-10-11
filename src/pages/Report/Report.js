import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import PageTitle from "../../components/Typography/PageTitle";
import { HollowDotsSpinner } from "react-epic-spinners";
import {
  useTable,
  useFilters,
  useGlobalFilter,
  useAsyncDebounce,
  usePagination,
  useSortBy,
} from "react-table";
import {
  SearchIcon,
  StartIcon,
  PrevIcon,
  NextIcon,
  EndIcon,
  NoneIcon,
  DownloadIcon,
} from "../../icons";
import {
  Label,
  Table,
  TableHeader,
  TableCell,
  TableBody,
  TableRow,
  TableFooter,
  TableContainer,
  Button,
  Card,
  CardBody,
  Input,
  Select,
} from "@windmill/react-ui";
import { matchSorter } from "match-sorter";
import { Link } from "react-router-dom";
import { fetchReport } from "../Storages/reportsSlice";
import {
  clearOrderByIdStatus,
  clearOrderListStatus,
} from "../Storages/ordersSlice";
import {
  clearStatuslogByCollectedStatus,
  clearStatuslogByDeliveredStatus,
  clearStatuslogByDoneStatus,
  clearStatuslogByOrderIdStatus,
  clearStatuslogByReturnedStatus,
} from "../Storages/orderlogsSlice";
import XLSX from "xlsx";
import { zeros } from "mathjs";
import { supabase } from "../../supabase";

function Report() {
  const dispatch = useDispatch();
  const orderByIdStatus = useSelector((state) => state.orders.orderByIdStatus);
  const orderListStatus = useSelector((state) => state.orders.orderListStatus);
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

  useEffect(() => {
    if (orderListStatus === "succeeded") {
      dispatch(clearOrderListStatus());
    }
  }, [orderListStatus, dispatch]);
  useEffect(() => {
    if (orderByIdStatus === "succeeded") {
      dispatch(clearOrderByIdStatus());
    }
  }, [orderByIdStatus, dispatch]);
  useEffect(() => {
    if (statuslogByCollectedStatus === "succeeded") {
      dispatch(clearStatuslogByCollectedStatus());
    }
  }, [statuslogByCollectedStatus, dispatch]);
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
    if (statuslogByOrderIdStatus === "succeeded") {
      dispatch(clearStatuslogByOrderIdStatus());
    }
  }, [statuslogByOrderIdStatus, dispatch]);

  const reportList = useSelector((status) => status.reports.reportList);
  const reportListStatus = useSelector(
    (status) => status.reports.reportListStatus
  );

  useEffect(() => {
    if (reportListStatus === "idle") {
      dispatch(fetchReport());
    }
  }, [reportListStatus, dispatch]);

  var data = reportList.map((list) => {
    return Object.values(list);
  });

  return (
    <>
      <PageTitle>REPORT</PageTitle>
      <div className="flex justify-between mb-4">
        <div className=" self-center dark:text-white mr-4">LIST</div>
        {reportListStatus === "loading" ? (
          <HollowDotsSpinner className="self-center" color="red" size="8" />
        ) : null}
        <Button onClick={() => ExportReport()}>
          <DownloadIcon />
        </Button>
      </div>

      <ReportTable reportList={reportList} />
    </>
  );
}

async function ExportReport() {
  let { data: reports, error } = await supabase
    .from("reports")
    .select(
      `orders(id,customer_name,customer_address,delivery_date,pickup_date,note,explaination),supported:supported_by(name),confirmed:confirmed_by(name),collected:collected_by(name),delivered:delivered_by(name),returned:returned_by(name),done:done_by(name)`
    );
  let header = [
    "Order Id",
    "Customer Name",
    "Customer Address",
    "Delivery Date",
    "Pickup Date",
    "Note",
    "Explaination",
    "Supported By",
    "Operation Date",
    "Confirmed By",
    "Collected By",
    "Delivered By",
    "Returned By",
    "Done By",
  ];
  let array = zeros([reports.length, 14]);
  for (let i = 0; i < reports.length; i++) {
    let temp = Object.values(reports[i]);
    array[i][0] = temp[0]?.id ?? "";
    array[i][1] = temp[0]?.customer_name ?? "";
    array[i][2] = temp[0]?.customer_address ?? "";
    array[i][3] = new Date(temp[0]?.delivery_date).toLocaleString() ?? "";
    array[i][4] = new Date(temp[0]?.pickup_date).toLocaleString() ?? "";
    array[i][5] = temp[0]?.note ?? "";
    array[i][6] = temp[0]?.explaination ?? "";
    array[i][7] = temp[1]?.name ?? "";
    array[i][8] = new Date(temp[0]?.op_date).toLocaleString() ?? "";
    array[i][9] = temp[2]?.name ?? "";
    array[i][10] = temp[3]?.name ?? "";
    array[i][11] = temp[4]?.name ?? "";
    array[i][12] = temp[5]?.name ?? "";
    array[i][13] = temp[6]?.name ?? "";
  }
  array = [header].concat(array);
  console.log(array);

  const fileName = "AOO_XLS";
  let wb = XLSX.utils.book_new();
  wb.Props = {
    Title: "Report Shipment Trafas",
    Author: "Admin",
    CreatedDate: new Date(),
  };
  wb.SheetNames.push("Sheet 1");
  // let ws = XLSX.utils.json_to_sheet(reports);
  let ws = XLSX.utils.aoa_to_sheet(array);
  wb.Sheets["Sheet 1"] = ws;
  XLSX.writeFile(wb, `Report.xls`);
}

function ReportTable({ reportList }) {
  const [tglFilterBox, setTglFilterBox] = useState(false);
  const data = React.useMemo(() => reportList, [reportList]);
  const columns = React.useMemo(
    () => [
      {
        Header: "customer",
        accessor: "orders.customer_name",
        Cell: ({ row }) => {
          return (
            <div>
              <p className="font-semibold">
                {row.original.orders.customer_name}
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                {row.original.orders.customer_address}
              </p>
            </div>
          );
        },
      },
      {
        Header: "confirmed by",
        accessor: "confirmed.name",
        Cell: ({ cell: { value } }) => {
          return <>{value ? value : <NoneIcon />}</>;
        },
      },
      {
        Header: "supported by",
        accessor: "supported.name",
        Cell: ({ cell: { value } }) => {
          return <>{value ? value : <NoneIcon />}</>;
        },
      },
      {
        Header: "confirmed at",
        accessor: "orders.created_at",
        Cell: ({ cell: { value } }) => {
          return <>{value ? new Date(value).toLocaleString() : <NoneIcon />}</>;
        },
      },
      {
        Header: "collected by",
        accessor: "collected.name",
        Cell: ({ cell: { value } }) => {
          return <>{value ? value : <NoneIcon />}</>;
        },
      },
      {
        Header: "collected at",
        accessor: "collected_date",
        Cell: ({ cell: { value } }) => {
          return <>{value ? new Date(value).toLocaleString() : <NoneIcon />}</>;
        },
      },
      {
        Header: "delivered by",
        accessor: "delivered.name",
        Cell: ({ cell: { value } }) => {
          return <>{value ? value : <NoneIcon />}</>;
        },
      },
      {
        Header: "delivered at",
        accessor: "delivered_date",
        Cell: ({ cell: { value } }) => {
          return <>{value ? new Date(value).toLocaleString() : <NoneIcon />}</>;
        },
      },
      {
        Header: "returned by",
        accessor: "returned.name",
        Cell: ({ cell: { value } }) => {
          return <>{value ? value : <NoneIcon />}</>;
        },
      },
      {
        Header: "returned at",
        accessor: "returned_date",
        Cell: ({ cell: { value } }) => {
          return <>{value ? new Date(value).toLocaleString() : <NoneIcon />}</>;
        },
      },
      {
        Header: "done by",
        accessor: "done.name",
        Cell: ({ cell: { value } }) => {
          return <>{value ? value : <NoneIcon />}</>;
        },
      },
      {
        Header: "done at",
        accessor: "done_date",
        Cell: ({ cell: { value } }) => {
          return <>{value ? new Date(value).toLocaleString() : <NoneIcon />}</>;
        },
      },
      {
        Header: "action",
        Cell: ({ row }) => {
          return (
            <div className="flex justify-start space-x-2 ">
              <Button
                layout="link"
                size="icon"
                tag={Link}
                to={`/app/track-trace/${row.original.order_id}`}
              >
                <SearchIcon className="w-5 h-5" arial-hidden="true" />
              </Button>
            </div>
          );
        },
      },
    ],
    []
  );
  function fuzzyTextFilterFn(rows, id, filterValue) {
    return matchSorter(rows, filterValue, { keys: [(row) => row.values[id]] });
  }

  fuzzyTextFilterFn.autoRemove = (val) => !val;

  const filterTypes = React.useMemo(
    () => ({
      fuzzyText: fuzzyTextFilterFn,

      text: (rows, id, filterValue) => {
        return rows.filter((row) => {
          const rowValue = row.values[id];
          return rowValue !== undefined
            ? String(rowValue)
                .toLowerCase()
                .startsWith(String(filterValue).toLowerCase())
            : true;
        });
      },
    }),
    []
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    allColumns,
    page,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    prepareRow,
    state,
    state: { pageIndex, pageSize },
    preGlobalFilteredRows,
    setGlobalFilter,
  } = useTable(
    {
      columns,
      data,
      filterTypes,
      initialState: { pageIndex: 0 },
    },
    useFilters,
    useGlobalFilter,
    useSortBy,
    usePagination
  );

  function GlobalFilter({ globalFilter, setGlobalFilter }) {
    const [value, setValue] = useState(globalFilter);
    const onChange = useAsyncDebounce((value) => {
      setGlobalFilter(value || undefined);
    }, 500);

    return (
      <Label className="mb-3">
        <div className="relative text-gray-500 focus-within:text-purple-600 dark:focus-within:text-purple-400">
          <input
            className="block w-full pl-10 mt-1 text-sm text-black dark:text-gray-300 dark:breport-gray-600 dark:bg-gray-700 focus:breport-purple-400 focus:outline-none focus:shadow-outline-purple dark:focus:shadow-outline-gray form-input"
            value={value || ""}
            onChange={(e) => {
              setValue(e.target.value);
              onChange(e.target.value);
            }}
            placeholder="search..."
          />
          <div className="absolute inset-y-0 flex items-center ml-3 pointer-events-none">
            <SearchIcon className="w-5 h-5" aria-hidden="true" />
          </div>
        </div>
      </Label>
    );
  }

  const resultsPerPage = pageSize;
  const totalResults = pageCount;

  function onPageChangeTable(p) {
    gotoPage(p);
  }

  return (
    <>
      <div className="flex">
        <GlobalFilter
          preGlobalFilteredRows={preGlobalFilteredRows}
          globalFilter={state.globalFilter}
          setGlobalFilter={setGlobalFilter}
        />
      </div>
      {tglFilterBox ? <FilterBox allColumns={allColumns} /> : null}
      <TableContainer>
        <Table {...getTableProps()}>
          <TableHeader>
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                  <TableCell
                    {...column.getHeaderProps(column.getSortByToggleProps())}
                  >
                    {column.render("Header")}
                    <span>
                      {column.isSorted
                        ? column.isSortedDesc
                          ? " 🔽"
                          : " 🔼"
                        : ""}
                    </span>
                  </TableCell>
                ))}
              </tr>
            ))}
          </TableHeader>
          <TableBody {...getTableBodyProps()}>
            {page.map((row, i) => {
              prepareRow(row);
              return (
                <TableRow {...row.getRowProps()}>
                  {row.cells.map((cell) => {
                    return (
                      <TableCell {...cell.getCellProps()}>
                        {cell.render("Cell")}
                      </TableCell>
                    );
                  })}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
        <TableFooter>
          <div className="px-4 py-3 flex items-center justify-between">
            <div>
              <Button
                size="sm"
                layout="icon"
                className="p-2  hover:bg-gray-700 rounded-md"
                onClick={() => gotoPage(0)}
                disabled={!canPreviousPage}
              >
                <StartIcon />
              </Button>
              <Button
                className="p-2  hover:bg-gray-700 rounded-md"
                size="sm"
                layout="icon"
                onClick={() => previousPage()}
                disabled={!canPreviousPage}
              >
                <PrevIcon />
              </Button>
              <Button
                className="p-2  hover:bg-gray-700 rounded-md"
                size="sm"
                layout="icon"
                onClick={() => nextPage()}
                disabled={!canNextPage}
              >
                <NextIcon />
              </Button>
              <Button
                className="p-2  hover:bg-gray-700 rounded-md"
                size="sm"
                layout="icon"
                onClick={() => gotoPage(pageCount - 1)}
                disabled={!canNextPage}
              >
                <EndIcon />
              </Button>
            </div>
            <span>
              Page{" "}
              <strong>
                {pageIndex + 1} of {pageOptions.length}
              </strong>
            </span>
          </div>
        </TableFooter>
      </TableContainer>
    </>
  );
}

function FilterBox({ allColumns }) {
  const IndeterminateCheckbox = React.forwardRef(
    ({ indeterminate, ...rest }, ref) => {
      const defaultRef = React.useRef();
      const resolvedRef = ref || defaultRef;

      React.useEffect(() => {
        resolvedRef.current.indeterminate = indeterminate;
      }, [resolvedRef, indeterminate]);

      return <input type="checkbox" ref={resolvedRef} {...rest} />;
    }
  );

  return (
    <Card className="mb-4 shadow-md">
      <CardBody>
        <span className=" dark:text-gray-400 text-md font-semibold ">Hide</span>
        <div className="grid mt-2 mb-4 gap-2 md:grid-cols-2 xl:grid-cols-12">
          {allColumns.map((column) => (
            <div key={column.id}>
              <Label check>
                <Input type="checkbox" {...column.getToggleHiddenProps()} />
                <span className="ml-2">{column.Header}</span>
              </Label>
            </div>
          ))}
        </div>
        <span className=" dark:text-gray-400 text-md  font-semibold">Time</span>
        <div className="grid mt-2 mb-4 gap-2 md:grid-cols-2 xl:grid-cols-3">
          <Label>
            <span>By</span>
            <Select className="mt-1">
              <option>Delivery</option>
            </Select>
          </Label>
          <Label>
            <span>From</span>
            <Input className="mt-1" type="datetime-local" />
          </Label>
          <Label>
            <span>To</span>
            <Input className="mt-1" type="datetime-local" />
          </Label>
        </div>
      </CardBody>
    </Card>
  );
}

export default Report;
