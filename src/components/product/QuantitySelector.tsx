"use client";

type Props = {
  value: number;
  onChange: (value: number) => void;
};

export default function QuantitySelector({ value, onChange }: Props) {
  return (
    <div className="inline-flex items-center rounded-full border border-neutral-200 bg-white">
      <button
        type="button"
        className="px-4 py-2 text-sm"
        onClick={() => onChange(Math.max(1, value - 1))}
        aria-label="Decrease quantity"
      >
        -
      </button>
      <span className="min-w-10 text-center text-sm font-medium">{value}</span>
      <button
        type="button"
        className="px-4 py-2 text-sm"
        onClick={() => onChange(value + 1)}
        aria-label="Increase quantity"
      >
        +
      </button>
    </div>
  );
}