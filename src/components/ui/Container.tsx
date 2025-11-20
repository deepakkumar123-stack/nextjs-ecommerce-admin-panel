import React, { ReactNode } from "react";

interface ContainerSectionProps {
  children: ReactNode;
  className?: string;
}
export const Container: React.FC<ContainerSectionProps> = ({
  children,
  className = "",
}) => {
  return (
    <div
      className={`bg-white rounded-2xl shadow-md overflow-hidden ${className}`}
    >
      {children}
    </div>
  );
};
