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
  EditIcon,
  TrashIcon,
  FilterIcon,
  PlusIcon,
  RefreshIcon,
  StartIcon,
  PrevIcon,
  NextIcon,
  EndIcon,
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
  clearOrderByIdStatus,
  clearOrderDeleteStatus,
  clearOrderListStatus,
  deleteOrder,
  fetchOrder,
} from "../Storages/ordersSlice";
import { Link } from "react-router-dom";
import { clearStatuslogByOrderIdStatus } from "../Storages/orderlogsSlice";
import { useAuth } from "../../context/Auth";

function Order() {
  const dispatch = useDispatch();
  const orderByIdStatus = useSelector((state) => state.orders.orderByIdStatus);
  useEffect(() => {
    if (orderByIdStatus === "succeeded") {
      dispatch(clearOrderByIdStatus());
    }
  }, [orderByIdStatus, dispatch]);

  const orderList = useSelector((status) => status.orders.orderList);
  const orderListStatus = useSelector(
    (status) => status.orders.orderListStatus
  );

  const statuslogByOrderIdStatus = useSelector(
    (state) => state.orderlogs.statuslogByOrderIdStatus
  );

  useEffect(() => {
    if (statuslogByOrderIdStatus === "succeeded") {
      dispatch(clearStatuslogByOrderIdStatus());
    }
  }, [statuslogByOrderIdStatus, dispatch]);

  useEffect(() => {
    if (orderListStatus === "idle") {
      dispatch(fetchOrder());
    }
  }, [orderListStatus, dispatch]);

  return (
    <>
      <PageTitle>ORDER</PageTitle>
      <div className="flex justify-start mb-4">
        <div className=" self-center dark:text-white mr-4">LIST</div>
        {orderListStatus === "loading" ? (
          <HollowDotsSpinner className="self-center" color="red" size="8" />
        ) : null}
      </div>

      <EmployeeTable orderList={orderList} />
    </>
  );
}

function EmployeeTable({ orderList }) {
  const dispatch = useDispatch();
  const { userRole } = useAuth();
  const [tglFilterBox, setTglFilterBox] = useState(false);
  const data = React.useMemo(() => orderList, [orderList]);
  const columns = React.useMemo(
    () => [
      {
        Header: "Created by",
        accessor: "employees.name",
        Filter: "",
        filter: "",
      },
      {
        Header: "Customer",
        Cell: ({ row }) => {
          return (
            <div>
              <p className="font-semibold">{row.original.customer_name}</p>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                {row.original.customer_address}
              </p>
            </div>
          );
        },
        Filter: "",
        filter: "",
      },
      {
        Header: "Status",
        accessor: "status",
        Filter: SelectColumnFilter,
        filter: "includes",
      },

      {
        Header: "delivery date",
        accessor: "delivery_date",
        Cell: ({ cell: { value } }) => {
          return new Date(value).toUTCString();
        },
        Filter: "",
        filter: "",
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
                to={`/app/track-trace/${row.original.id}`}
              >
                <SearchIcon className="w-5 h-5" arial-hidden="true" />
              </Button>
              <Button
                layout="link"
                size="icon"
                aria-label="Edit"
                tag={Link}
                to={`/app/marketing/edit-order/${row.original.id}`}
              >
                <EditIcon className="w-5 h-5" arial-hidden="true" />
              </Button>
              {userRole?.role === "super_admin" ? (
                <Button
                  onClick={() => removeOrder(row.original.id)}
                  layout="link"
                  size="icon"
                  aria-label="Delete"
                >
                  <TrashIcon className="w-5 h-5" arial-hidden="true" />
                </Button>
              ) : (
                ""
              )}
            </div>
          );
        },
        Filter: "",
        filter: "",
      },
    ],
    []
  );

  function removeOrder(id) {
    dispatch(deleteOrder(id));
    dispatch(clearOrderDeleteStatus());
  }

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
    setPageSize,
    prepareRow,
    state,
    filterValue,
    setFilter,
    state: { pageIndex, pageSize },
    // visibleColumns,
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
            className="block w-full pl-10 mt-1 text-sm text-black dark:text-gray-300 dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:focus:shadow-outline-gray form-input"
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
            onClick={() => dispatch(clearOrderListStatus())}
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
          <Button
            tag={Link}
            to="/app/marketing/new-order"
            size="small"
            aria-label="Edit"
          >
            <PlusIcon className="w-5 h-5" arial-hidden="true" />
          </Button>
        </div>
      </div>
      {tglFilterBox ? <FilterBox allColumns={allColumns} /> : null}
      <TableContainer>
        <Table {...getTableProps()}>
          <TableHeader>
            {headerGroups.map((headerGroup) => (
              <>
                <tr {...headerGroup.getHeaderGroupProps()}>
                  {headerGroup.headers.map((column) => (
                    <>
                      <TableCell
                        {...column.getHeaderProps(
                          column.getSortByToggleProps()
                        )}
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
                    </>
                  ))}
                </tr>
                {tglFilterBox ? (
                  <tr {...headerGroup.getHeaderGroupProps()}>
                    {headerGroup.headers.map((column) => (
                      <>
                        <TableCell>{column.render("Filter")}</TableCell>
                      </>
                    ))}
                  </tr>
                ) : (
                  ""
                )}
              </>
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

export default Order;
