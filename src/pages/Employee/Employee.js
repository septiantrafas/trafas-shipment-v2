import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import PageTitle from "../../components/Typography/PageTitle";
import { fetchEmployee } from "../Storages/employeesSlice";
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
  PrevIcon,
  StartIcon,
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
  Pagination,
  Card,
  CardBody,
  Input,
  Select,
} from "@windmill/react-ui";
import { matchSorter } from "match-sorter";

function Employee() {
  const dispatch = useDispatch();
  const employeeList = useSelector((status) => status.employees.employeeList);
  const employeeListStatus = useSelector(
    (status) => status.employees.employeeListStatus
  );

  useEffect(() => {
    if (employeeListStatus === "idle") {
      dispatch(fetchEmployee());
    }
  }, [employeeListStatus, dispatch]);

  return (
    <>
      <PageTitle>EMPLOYEE</PageTitle>
      <div className="flex justify-start mb-4">
        <div className=" self-center dark:text-white mr-4">LIST</div>
        {employeeListStatus === "loading" ? (
          <HollowDotsSpinner className="self-center" color="red" size="8" />
        ) : null}
      </div>

      <EmployeeTable employeeList={employeeList} />
    </>
  );
}

function EmployeeTable({ employeeList }) {
  const [tglFilterBox, setTglFilterBox] = useState(false);
  const data = React.useMemo(() => employeeList, [employeeList]);

  const columns = React.useMemo(
    () => [
      {
        Header: "id",
        accessor: "id",
      },
      {
        Header: "role",
        accessor: "role",
      },
      {
        Header: "name",
        accessor: "name",
      },
      {
        Header: "email",
        accessor: "email",
      },
      {
        Header: "address",
        accessor: "address",
      },
      {
        Header: "phone",
        accessor: "phone",
      },
      {
        Header: "created at",
        accessor: "created_at",
        Cell: ({ cell: { value } }) => {
          return new Date(value).toLocaleString();
        },
      },
      {
        Header: "action",
        Cell: ({ row }) => {
          return (
            <div className="flex justify-between px-2">
              <Button
                onClick={() => console.log(row.original.id)}
                layout="link"
                size="icon"
                aria-label="Edit"
              >
                <EditIcon className="w-5 h-5" arial-hidden="true" />
              </Button>
              <Button
                onClick={() => console.log(row.original.id)}
                layout="link"
                size="icon"
                aria-label="Delete"
              >
                <TrashIcon className="w-5 h-5" arial-hidden="true" />
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
    setPageSize,
    prepareRow,
    state,
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
            // onClick={() => console.log(row.original.id)}

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
            // onClick={() => console.log(row.original.id)}

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
              <option>Created At</option>
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

export default Employee;
