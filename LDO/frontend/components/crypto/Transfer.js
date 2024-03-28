import React from "react";

export function Transfer({ transferTokens, tokenSymbol }) {
  return (
    <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
      <h4 className="text-2xl font-bold mb-4">Transfer</h4>
      <form
        onSubmit={(event) => {
          // This function just calls the transferTokens callback with the
          // form's data.
          event.preventDefault();

          const formData = new FormData(event.target);
          const to = formData.get("to");
          const amount = formData.get("amount");

          if (to && amount) {
            transferTokens(to, amount);
          }
        }}
      >
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Amount of {tokenSymbol}
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            type="number"
            step="1"
            name="amount"
            placeholder="1"
            required
          />
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Recipient address
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            type="text"
            name="to"
            required
          />
        </div>
        <div className="flex items-center justify-between">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="submit"
          >
            Transfer
          </button>
        </div>
      </form>
    </div>
  );
}
