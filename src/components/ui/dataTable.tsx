"use client";

import React, { useEffect } from "react";
import {
  useReactTable,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  ColumnDef,
} from "@tanstack/react-table";
import classNames from "classnames";
import TableLoading from "./tableLoading";
import TableError from "./tableError";
import TableNoRecords from "./tableNoRecord";

// Types
export type TableVariant =
  | "default"
  | "primary"
  | "secondary"
  | "success"
  | "danger"
  | "warning"
  | "info"
  | "dark";

export type TableStyle = "default" | "striped" | "bordered" | "hover";
export type TableSize = "sm" | "md" | "lg";

export type PaginationMode = "none" | "client" | "server";

interface DataTableProps<T> {
  data: T[];
  columns: ColumnDef<T>[];
  variant?: TableVariant;
  style?: TableStyle;
  size?: TableSize;
  className?: string;
  loading?: boolean;
  error?: boolean;
  noRecordsText?: string;
  pageCount?: number; // for server-side
  onRowClick?: (row: T) => void;
  paginationMode?: PaginationMode;
  onServerPageChange?: (pagination: {
    pageIndex: number;
    pageSize: number;
  }) => void;
  pageSizeOptions?: number[];
  initialPageSize?: number;
}

// Class maps
const variantClassMap = {
  default: "",
  primary: "border-blue-500",
  secondary: "border-gray-400",
  success: "border-green-500",
  danger: "border-red-500",
  warning: "border-yellow-500",
  info: "border-cyan-500",
  dark: "border-gray-800",
};

const styleClassMap = {
  default: "",
  striped: "[&>tbody>tr:nth-child(odd)]:bg-gray-50",
  bordered: "border border-gray-200 [&>tbody>tr]:border-t",
  hover: "hover:[&>tbody>tr:hover]:bg-gray-50",
};

const sizeClassMap = {
  sm: "text-xs",
  md: "text-sm",
  lg: "text-base",
};

function DataTable<T>({
  data,
  columns,
  variant = "default",
  style = "default",
  size = "md",
  className,
  loading,
  error,
  noRecordsText = "No records found.",
  pageCount,
  onRowClick,
  paginationMode = "client",
  onServerPageChange,
  pageSizeOptions = [5, 10, 20, 50],
  initialPageSize = 10,
}: DataTableProps<T>) {
  const table = useReactTable({
    data,
    columns,
    pageCount: paginationMode === "server" ? pageCount : undefined,
    state: {},
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    ...(paginationMode !== "none"
      ? { getPaginationRowModel: getPaginationRowModel() }
      : {}),
    manualPagination: paginationMode === "server",
    initialState: {
      pagination: {
        pageIndex: 0,
        pageSize: initialPageSize,
      },
    },
  });

  // 🔄 Handle server-side pagination updates
  useEffect(() => {
    if (paginationMode === "server" && onServerPageChange) {
      const { pageIndex, pageSize } = table.getState().pagination;
      onServerPageChange({ pageIndex, pageSize });
    }
  }, [paginationMode, onServerPageChange, table.getState().pagination]);

  const tableClasses = classNames(
    "min-w-full w-full text-left whitespace-nowrap rounded-lg overflow-hidden",
    "bg-white shadow-sm border border-gray-200",
    variantClassMap[variant],
    styleClassMap[style],
    sizeClassMap[size],
    className
  );

  return (
    <div className="overflow-x-auto w-full">
      <table className={tableClasses}>
        {/* Table Head */}
        <thead className="bg-gray-100">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  className="px-4 py-3 text-gray-700 font-semibold text-xs uppercase tracking-wide"
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </th>
              ))}
            </tr>
          ))}
        </thead>

        {/* Table Body */}
        <tbody className="divide-y divide-gray-200">
          {loading ? (
            <TableLoading colSpan={columns.length} />
          ) : error ? (
            <TableError colSpan={columns.length} />
          ) : data.length === 0 ? (
            <TableNoRecords colSpan={columns.length} text={noRecordsText} />
          ) : (
            table.getRowModel().rows.map((row) => (
              <tr
                key={row.id}
                className={classNames(
                  "transition-colors duration-200",
                  onRowClick && "cursor-pointer hover:bg-blue-50",
                  style === "hover" && "hover:bg-blue-50"
                )}
                onClick={() => onRowClick?.(row.original)}
              >
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="px-4 py-3 text-gray-700">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Pagination */}
      {paginationMode !== "none" && (
        <div className="px-4 mt-4 flex items-center justify-between gap-4">
          <button
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="px-3 py-1.5 text-sm border rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
          >
            Previous
          </button>

          <span className="text-xs text-gray-500">
            Page {table.getState().pagination.pageIndex + 1} of{" "}
            {paginationMode === "server" ? pageCount : table.getPageCount()}
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="px-3 py-1.5 text-sm border rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
            >
              Next
            </button>
            <select
              value={table.getState().pagination.pageSize}
              onChange={(e) => table.setPageSize(Number(e.target.value))}
              className="text-xs border rounded-md px-2 py-1"
            >
              {pageSizeOptions.map((size) => (
                <option key={size} value={size}>
                  Show {size}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}
    </div>
  );
}

export default DataTable;
