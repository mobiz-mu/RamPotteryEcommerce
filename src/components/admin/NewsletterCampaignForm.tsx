"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

type Subscriber = {
  id: string;
  email: string;
};

type Props = {
  subscribers: Subscriber[];
};

export default function NewsletterCampaignForm({ subscribers }: Props) {
  const router = useRouter();

  const [subject, setSubject] = useState("");
  const [previewText, setPreviewText] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/admin/newsletter/campaigns", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        subject,
        preview_text: previewText,
        content,
        subscriber_ids: subscribers.map((s) => s.id),
      }),
    });

    const json = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(json.error || "Unable to create campaign.");
      return;
    }

    alert("Campaign saved successfully.");
    router.push("/admin/newsletter");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 space-y-8">
      <div className="grid gap-8 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-8">
          <div className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-[0_12px_35px_rgba(0,0,0,0.04)]">
            <h2 className="text-xl font-semibold text-neutral-950">Campaign Content</h2>

            <div className="mt-6 space-y-5">
              <div>
                <label className="mb-2 block text-sm font-medium text-neutral-900">
                  Subject
                </label>
                <Input
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Enter campaign subject"
                  required
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-neutral-900">
                  Preview Text
                </label>
                <Input
                  value={previewText}
                  onChange={(e) => setPreviewText(e.target.value)}
                  placeholder="Short preview text"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-neutral-900">
                  Email Content
                </label>
                <Textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Write your email marketing content here"
                  className="min-h-[260px]"
                  required
                />
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-[0_12px_35px_rgba(0,0,0,0.04)]">
            <h2 className="text-xl font-semibold text-neutral-950">Recipients</h2>

            <div className="mt-5 space-y-3">
              <p className="text-sm text-neutral-500">
                Selected subscribers: {subscribers.length}
              </p>

              <div className="max-h-72 overflow-y-auto rounded-2xl border border-neutral-200 p-4">
                {subscribers.length === 0 ? (
                  <p className="text-sm text-neutral-500">No subscribers selected.</p>
                ) : (
                  <div className="space-y-2">
                    {subscribers.map((subscriber) => (
                      <div
                        key={subscriber.id}
                        className="rounded-xl bg-neutral-50 px-3 py-2 text-sm text-neutral-700"
                      >
                        {subscriber.email}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {error ? (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          ) : null}

          <div className="flex flex-col gap-3">
            <Button
              type="submit"
              disabled={loading}
              className="h-12 rounded-xl bg-red-600 px-8 text-sm font-semibold text-white hover:bg-red-700"
            >
              {loading ? "Saving..." : "Save Campaign"}
            </Button>

            <Button
              type="button"
              variant="outline"
              className="h-12 rounded-xl px-8"
              onClick={() => router.push("/admin/newsletter")}
            >
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
}