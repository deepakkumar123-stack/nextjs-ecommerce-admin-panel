"use client";

import React from "react";

interface TableErrorProps {
  colSpan?: number;
  message?: string;
}

const TableError: React.FC<TableErrorProps> = ({
  colSpan = 1,
  message = "Something went wrong. Please try again.",
}) => {
  return (
    <tr>
      <td
        colSpan={colSpan}
        className="px-4 py-6 text-center text-red-600 font-medium"
      >
        {message}
      </td>
    </tr>
  );
};

export default TableError;
