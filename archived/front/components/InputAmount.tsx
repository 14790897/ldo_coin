// InputAmount.tsx 或 InputAmount.jsx
import React from "react";

interface InputAmountProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const InputAmount: React.FC<InputAmountProps> = ({
  value,
  onChange,
}) => {
  return (
    <div className="flex flex-col space-y-2">
      <label htmlFor="amount" className="text-lg font-semibold">
        Enter Amount
      </label>
      <input
        id="amount"
        type="text"
        value={value}
        onChange={onChange}
        className="border border-gray-300 p-2 rounded-md"
        placeholder="Amount in ETH"
      />
    </div>
  );
};
