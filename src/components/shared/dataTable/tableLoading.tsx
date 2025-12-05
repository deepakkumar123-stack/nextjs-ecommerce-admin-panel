"use client";

import React from "react";
import classNames from "classnames";

interface TableLoadingProps {
  colSpan: number;
}

const TableLoading: React.FC<TableLoadingProps> = ({ colSpan }) => {
  return (
    <tr>
      <td colSpan={colSpan} className="px-4 py-6 text-center">
        <div className="flex justify-center items-center gap-2">
          {/* Spinner */}
          <svg
            className="animate-spin h-5 w-5 text-blue-500"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
            />
          </svg>
          <span className="text-sm text-gray-600">Loading...</span>
        </div>
      </td>
    </tr>
  );
};

export default TableLoading;
