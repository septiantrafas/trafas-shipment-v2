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
  FilterIcon,
  RefreshIcon,
  PeopleIcon,
  CheckIcon,
  WarningIcon,
  StartIcon,
  PrevIcon,
  NextIcon,
  EndIcon,
  ForbiddenIcon,
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
import {
  clearStatuslogByCollectedStatus,
  clearStatuslogByDeliveredStatus,
  clearStatuslogByDoneStatus,
  clearStatuslogByOrderIdStatus,
  clearStatuslogByReturnedStatus,
  fetchStatuslogsByDelivered,
  fetchStatuslogsByDeliveredEmployee,
} from "../Storages/orderlogsSlice";
import { Link } from "react-router-dom";
import { clearOrderListStatus } from "../Storages/ordersSlice";
import { useAuth } from "../../context/Auth";
import { clearReportListStatus } from "../Storages/reportsSlice";

function Delivery() {
  const { user, userRole } = useAuth();
  const dispatch = useDispatch();

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
  const reportListStatus = useSelector(
    (state) => state.reports.reportListStatus
  );

  useEffect(() => {
    if (orderListStatus === "succeeded") {
      dispatch(clearOrderListStatus());
    }
  }, [orderListStatus, dispatch]);
  useEffect(() => {
    if (statuslogByOrderIdStatus === "succeeded") {
      dispatch(clearStatuslogByOrderIdStatus());
    }
  }, [statuslogByOrderIdStatus, dispatch]);

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
    if (statuslogByDoneStatus === "succeeded") {
      dispatch(clearStatuslogByDoneStatus());
    }
  }, [statuslogByDoneStatus, dispatch]);
  useEffect(() => {
    if (reportListStatus === "succeeded") {
      dispatch(clearReportListStatus());
    }
  }, [reportListStatus, dispatch]);

  const statuslogByDelivered = useSelector(
    (status) => status.orderlogs.statuslogByDelivered
  );
  const statuslogByDeliveredStatus = useSelector(
    (status) => status.orderlogs.statuslogByDeliveredStatus
  );

  useEffect(() => {
    if (userRole) {
      if (userRole.role !== "staff_courier" && orderListStatus === "idle") {
        dispatch(fetchStatuslogsByDelivered());
      } else if (
        (userRole.role === "staff_courier" ||
          userRole?.role === "staff_marketing" ||
          userRole?.role === "admin_marketing") &&
        orderListStatus === "idle"
      ) {
        dispatch(fetchStatuslogsByDeliveredEmployee(user.id));
      }
    }
  }, [orderListStatus, userRole, dispatch]);

  return (
    <>
      <PageTitle>TO DELIVERY</PageTitle>
      <div className="flex justify-start mb-4">
        <div className=" self-center dark:text-white mr-4">LIST</div>
        {statuslogByDeliveredStatus === "loading" ? (
          <HollowDotsSpinner className="self-center" color="red" size="8" />
        ) : null}
      </div>

      <EmployeeTable statuslogByDelivered={statuslogByDelivered} />
    </>
  );
}

function EmployeeTable({ statuslogByDelivered }) {
  const dispatch = useDispatch();
  const { userRole } = useAuth();
  const [tglFilterBox, setTglFilterBox] = useState(false);
  const data = React.useMemo(
    () => statuslogByDelivered,
    [statuslogByDelivered]
  );

  const columns = React.useMemo(
    () => [
      {
        Header: "Delivered by",
        accessor: "employees.name",
      },
      {
        Header: "Customer",
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
        Header: "to deliver",
        accessor: "orders.delivery_date",
        Cell: ({ cell: { value } }) => {
          return new Date(value).toLocaleString();
        },
      },
      {
        Header: "status",
        accessor: "status",
        Cell: ({ cell: { value }, row: { original } }) => {
          return (
            <span>
              {original.orders.status === "cancelled" ? (
                <ForbiddenIcon className="w-6 h-6" color="red" />
              ) : value ? (
                <CheckIcon color="green" />
              ) : (
                <Button
                  layout="link"
                  size="icon"
                  tag={Link}
                  to={`/app/update-status/collected/${original.order_id}/${original.id}`}
                >
                  <WarningIcon color="yellow" />
                </Button>
              )}
            </span>
          );
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
              {userRole.role === "super_admin" ||
              userRole.role === "admin_courier" ? (
                <Button
                  layout="link"
                  size="icon"
                  tag={Link}
                  to={`/app/pick-employee/${row.original.id}/courier`}
                >
                  <PeopleIcon className="w-5 h-5" arial-hidden="true" />
                </Button>
              ) : (
                ""
              )}
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
    state: { pageIndex },
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
            className="block w-full pl-10 mt-1 text-sm text-black dark:text-gray-300 dark:borderlogsBy-gray-600 dark:bg-gray-700 focus:borderlogsBy-purple-400 focus:outline-none focus:shadow-outline-purple dark:focus:shadow-outline-gray form-input"
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

  function SelectColumnFilter({
    column: { filterValue, setFilter, preFilteredRows, id },
  }) {
    // Calculate the options for filtering
    // using the preFilteredRows
    const options = React.useMemo(() => {
      const options = new Set();
      preFilteredRows.forEach((row) => {
        options.add(row.values[id]);
      });
      return [...options.values()];
    }, [id, preFilteredRows]);

    // Render a multi-select box
    return (
      <Select
        value={filterValue}
        onChange={(e) => {
          setFilter(e.target.value || undefined);
        }}
      >
        <option value="">All</option>
        {options.map((option, i) => (
          <option key={i} value={option}>
            {option}
          </option>
        ))}
      </Select>
    );
  }

  return (
    <>
      <div className="flex justify-between">
        <GlobalFilter
          preGlobalFilteredRows={preGlobalFilteredRows}
          globalFilter={state.globalFilter}
          setGlobalFilter={setGlobalFilter}
        />
        <div className="flex space-x-3 self-center">
          <Button
            onClick={() => dispatch(clearStatuslogByDeliveredStatus())}
            size="small"
            aria-label="Edit"
          >
            <RefreshIcon className="w-5 h-5" arial-hidden="true" />
          </Button>
          <Button
            onClick={() => setTglFilterBox(!tglFilterBox)}
            size="small"
            aria-label="Edit"
          >
            <FilterIcon className="w-5 h-5" arial-hidden="true" />
          </Button>
        </div>
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
      </CardBody>
    </Card>
  );
}

export default Delivery;
