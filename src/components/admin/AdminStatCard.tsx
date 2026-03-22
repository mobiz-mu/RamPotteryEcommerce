type Props = {
  label: string;
  value: string;
  hint?: string;
};

export default function AdminStatCard({ label, value, hint }: Props) {
  return (
    <div className="rounded-3xl border border-neutral-200 bg-white p-6">
      <div className="text-sm font-medium text-neutral-500">{label}</div>
      <div className="mt-3 text-3xl font-semibold text-neutral-950">{value}</div>
      {hint ? <div className="mt-2 text-sm text-neutral-500">{hint}</div> : null}
    </div>
  );
}