import React from "react";
import { motion } from "framer-motion";

const ErrorMessage = ({
  message = "Something went wrong.",
  onRetry,
  className = "",
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={`flex flex-col items-center justify-center gap-4 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 shadow-lg ${className}`}
    >
      {/* Animated error icon */}
      <motion.div
        animate={{ rotate: [0, 10, -10, 0] }}
        transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-10 h-10"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01M4.93 4.93l14.14 14.14"
          />
        </svg>
      </motion.div>

      {/* Error text */}
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-center font-medium"
      >
        {message}
      </motion.span>

      {/* Retry button if provided */}
      {onRetry && (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onRetry}
          className="px-4 py-2 bg-red-500 text-white rounded-lg shadow hover:bg-red-600 focus:outline-none"
        >
          Retry
        </motion.button>
      )}
    </motion.div>
  );
};

export default ErrorMessage;
