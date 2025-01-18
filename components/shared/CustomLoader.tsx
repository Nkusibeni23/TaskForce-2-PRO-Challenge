import React from "react";

export default function CustomLoader() {
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="loader w-16 h-16 border-4 border-dashed rounded-full animate-spin border-primary"></div>
    </div>
  );
}
