import React, { ReactNode } from "react";
// Import the motion components from framer-motion
import { motion } from "framer-motion";

/**
 * Define animation variants for the container to orchestrate staggered children.
 */
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      // Stagger the animation of the children elements by 0.1 seconds
      staggerChildren: 0.1,
    },
  },
};

/**
 * Define animation variants for individual items (Title, Subtitle, Action).
 * This creates the fade-in and slide-down effect.
 */
const itemVariants = {
  hidden: {
    opacity: 0,
    y: -10, // Start slightly above its final position
  },
  visible: {
    opacity: 1,
    y: 0, // Slide down to its final position
    transition: {
      duration: 0.5,
      // FIX: Removed the explicit 'ease' property to resolve the TypeScript error.
      // Framer Motion's default easing is used, maintaining smoothness.
    },
  },
};

// Corrected Prop Types for better type safety
type PageHeaderProp = {
  title: string;
  subtitle?: string;
  action?: ReactNode; // Action is optional (as used in the component body)
  className?: string; // Class name should be a string
};

const PageHeader = ({
  title,
  subtitle,
  action,
  className = "",
}: PageHeaderProp) => {
  return (
    <motion.div
      className={`mb-4 pt-4 pb-2   ${className}`}
      // Set the initial and animate states based on the variants
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <div className="flex justify-between items-start md:items-center flex-col md:flex-row">
        {/* Title and Subtitle Container */}
        <div className="space-y-1 mb-4 md:mb-0">
          <motion.h1 // Apply motion to the Title
            className="text-3xl font-bold text-gray-900"
            variants={itemVariants} // Inherits the staggered animation
          >
            {title}
          </motion.h1>
          <motion.p // Apply motion to the Subtitle
            className="text-gray-500"
            variants={itemVariants} // Inherits the staggered animations
          >
            {subtitle}
          </motion.p>
        </div>

        {/* Action Button Container */}
        {action && (
          <motion.div // Apply motion to the Action button container
            variants={itemVariants} // Inherits the staggered animation
          >
            {action}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default PageHeader;
