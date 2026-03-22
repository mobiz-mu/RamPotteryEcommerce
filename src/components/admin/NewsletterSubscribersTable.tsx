"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

type Subscriber = {
  id: string;
  email: string;
  is_active: boolean;
  source: string | null;
  subscribed_at: string;
};

type Props = {
  subscribers: Subscriber[];
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

export default function NewsletterSubscribersTable({ subscribers }: Props) {
  const router = useRouter();
  const [selected, setSelected] = useState<string[]>([]);

  const activeSubscribers = useMemo(
    () => subscribers.filter((item) => item.is_active),
    [subscribers]
  );

  const allSelected =
    activeSubscribers.length > 0 &&
    activeSubscribers.every((item) => selected.includes(item.id));

  function toggleSelectAll() {
    if (allSelected) {
      setSelected([]);
      return;
    }
    setSelected(activeSubscribers.map((item) => item.id));
  }

  function toggleOne(id: string) {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  }

  async function copySelectedEmails() {
    const emails = subscribers
      .filter((item) => selected.includes(item.id))
      .map((item) => item.email)
      .join(", ");

    if (!emails) return;

    await navigator.clipboard.writeText(emails);
    alert("Selected emails copied.");
  }

  function goToCampaign() {
    if (selected.length === 0) {
      alert("Please select at least one subscriber.");
      return;
    }

    const ids = selected.join(",");
    router.push(`/admin/newsletter/campaigns/new?ids=${ids}`);
  }

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-neutral-950">Subscribers</h2>
          <p className="mt-1 text-sm text-neutral-500">
            Select individual or all active emails for marketing campaigns.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={toggleSelectAll}
            className="inline-flex h-10 items-center justify-center rounded-xl border border-neutral-200 bg-white px-4 text-sm font-medium text-neutral-700 transition hover:bg-neutral-50"
          >
            {allSelected ? "Clear All" : "Select All"}
          </button>

          <button
            type="button"
            onClick={copySelectedEmails}
            className="inline-flex h-10 items-center justify-center rounded-xl border border-neutral-200 bg-white px-4 text-sm font-medium text-neutral-700 transition hover:bg-neutral-50"
          >
            Copy Selected
          </button>

          <button
            type="button"
            onClick={goToCampaign}
            className="inline-flex h-10 items-center justify-center rounded-xl bg-red-600 px-4 text-sm font-semibold text-white transition hover:bg-red-700"
          >
            Create Campaign
          </button>
        </div>
      </div>

      <div className="mt-6 overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-neutral-200 text-neutral-500">
            <tr>
              <th className="px-3 py-3 font-medium">
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={toggleSelectAll}
                />
              </th>
              <th className="px-3 py-3 font-medium">Email</th>
              <th className="px-3 py-3 font-medium">Status</th>
              <th className="px-3 py-3 font-medium">Source</th>
              <th className="px-3 py-3 font-medium">Subscribed</th>
            </tr>
          </thead>

          <tbody>
            {subscribers.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-3 py-10 text-center text-neutral-500">
                  No subscribers found.
                </td>
              </tr>
            ) : (
              subscribers.map((subscriber) => (
                <tr key={subscriber.id} className="border-b border-neutral-100">
                  <td className="px-3 py-4">
                    <input
                      type="checkbox"
                      checked={selected.includes(subscriber.id)}
                      onChange={() => toggleOne(subscriber.id)}
                      disabled={!subscriber.is_active}
                    />
                  </td>
                  <td className="px-3 py-4 font-medium text-neutral-950">
                    {subscriber.email}
                  </td>
                  <td className="px-3 py-4">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ${
                        subscriber.is_active
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-neutral-100 text-neutral-600"
                      }`}
                    >
                      {subscriber.is_active ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-3 py-4 text-neutral-600">
                    {subscriber.source || "website"}
                  </td>
                  <td className="px-3 py-4 text-neutral-600">
                    {formatDate(subscriber.subscribed_at)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}