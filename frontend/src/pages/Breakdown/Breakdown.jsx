import React, { useState } from "react";

const Breakdown = ({response}) => {
  return (
    <>
      <div>
        <h1>Goal Breakdown</h1>
        <p>{JSON.stringify(response)}</p>
      </div>
    </>
  );
};

export default Breakdown;
