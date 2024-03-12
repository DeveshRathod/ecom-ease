import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Exit = ({ message, setShowModal }) => {
  const navigate = useNavigate();
  const exit = () => {
    setShowModal(false);
    navigate("/");
  };

  return (
    <div className="fixed z-10 inset-0 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pb-20 text-center">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>
        <span
          className="hidden sm:inline-block sm:align-middle sm:h-screen"
          aria-hidden="true"
        >
          &#8203;
        </span>
        <div
          className="inline-block align-bottom bg-white rounded-lg px-10 sm:px-5 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-xl sm:w-full"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-headline"
        >
          <div>
            <div className="mt-3 text-center sm:mt-5">
              <h3
                className="text-lg leading-6 font-medium text-gray-900"
                id="modal-headline"
              >
                Are you sure?
              </h3>
              <div className="mt-2">
                <p className="text-sm text-gray-500">{message}</p>
              </div>
            </div>
          </div>
          <div className="mt-5 sm:mt-6 flex gap-2">
            <button
              className="inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-1 py-2 sm:px-2 sm:py-3 bg-[#FFBE98] text-xs font-medium text-white hover:opacity-95 focus:outline-none  sm:text-sm"
              onClick={() => setShowModal(false)}
            >
              Cancel
            </button>
            <button
              className="inline-flex justify-center w-full  rounded-md border border-transparent shadow-sm px-1 py-2 sm:px-2 sm:py-3 bg-[#FFBE98] text-xs font-medium text-white hover:opacity-95 focus:outline-none  sm:text-sm"
              onClick={exit}
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Exit;
