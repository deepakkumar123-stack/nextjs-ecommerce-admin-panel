"use client";

import React from "react";

interface TableNoRecordsProps {
  colSpan?: number;
  text?: string;
}

const TableNoRecords: React.FC<TableNoRecordsProps> = ({
  colSpan = 1,
  text = "No records found.",
}) => {
  return (
    <tr>
      <td
        colSpan={colSpan}
        className="px-4 py-6 text-center text-gray-500 italic"
      >
        {text}
      </td>
    </tr>
  );
};

export default TableNoRecords;
