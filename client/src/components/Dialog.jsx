import React from "react";

const Dialog = ({ message, setShowModal, dialogFun, headline }) => {
  return (
    <div className="rounded-lg bg-white p-8 shadow-2xl fixed top-4 right-4 z-20">
      <h2 className="text-lg font-bold">{headline}</h2>
      <p className="mt-2 text-sm text-gray-500">{message}</p>
      <div className="mt-4 flex gap-2 justify-between">
        <button
          type="button"
          className="rounded px-4 py-2 text-sm font-medium text-black"
          onClick={() => setShowModal(false)}
        >
          Cancel
        </button>
        <button
          type="button"
          className="rounded bg-green-500 px-6 py-2 text-sm font-medium text-white"
          onClick={dialogFun}
        >
          Ok
        </button>
      </div>
    </div>
  );
};

export default Dialog;
