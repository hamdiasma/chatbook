import React from "react";

export default function NotFound() {
  return (
    <div
      className="position-relative"
      style={{ width: "100%", height: "calc(100vh - 150px)" }}
    >
      <h2
        className="position-absolute text-secondary"
        style={{
          top: "50%",
          left: "50%",
          transform: "translate(-50%,-50%)",
          textAlign: "center",
        }}
      >
        404 !! NotFound
      </h2>
    </div>
  );
}
