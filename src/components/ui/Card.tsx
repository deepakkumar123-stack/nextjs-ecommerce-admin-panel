// Card.tsx
import React, { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
}

const Card: React.FC<CardProps> & {
  Header: typeof CardHeader;
  Body: typeof CardBody;
  Footer: typeof CardFooter;
} = ({ children, className }) => {
  return (
    <div
      className={`bg-white rounded-2xl shadow-md overflow-hidden ${className}`}
    >
      {children}
    </div>
  );
};

// Header Component
interface CardSectionProps {
  children: ReactNode;
  className?: string;
}

export const CardHeader: React.FC<CardSectionProps> = ({
  children,
  className,
}) => {
  return <div className={`p-4 border-b ${className}`}>{children}</div>;
};

// Body Component
export const CardBody: React.FC<CardSectionProps> = ({
  children,
  className,
}) => {
  return <div className={`p-4 ${className}`}>{children}</div>;
};

// Footer Component
export const CardFooter: React.FC<CardSectionProps> = ({
  children,
  className,
}) => {
  return (
    <div className={`p-4 border-t text-right ${className}`}>{children}</div>
  );
};

// Attach subcomponents
Card.Header = CardHeader;
Card.Body = CardBody;
Card.Footer = CardFooter;

export default Card;
