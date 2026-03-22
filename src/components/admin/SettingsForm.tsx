"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type StoreSettings = {
  id: string;
  store_name: string;
  contact_email: string | null;
  contact_phone: string | null;
  whatsapp_number: string | null;
  address: string | null;
  announcement_text: string | null;
  facebook_url: string | null;
  instagram_url: string | null;
  tiktok_url: string | null;
  linkedin_url: string | null;
};

type Props = {
  initialData?: StoreSettings;
};

export default function SettingsForm({ initialData }: Props) {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [storeName, setStoreName] = useState(initialData?.store_name ?? "Ram Pottery");
  const [contactEmail, setContactEmail] = useState(initialData?.contact_email ?? "");
  const [contactPhone, setContactPhone] = useState(initialData?.contact_phone ?? "");
  const [whatsappNumber, setWhatsappNumber] = useState(initialData?.whatsapp_number ?? "");
  const [address, setAddress] = useState(initialData?.address ?? "");
  const [announcementText, setAnnouncementText] = useState(initialData?.announcement_text ?? "");
  const [facebookUrl, setFacebookUrl] = useState(initialData?.facebook_url ?? "");
  const [instagramUrl, setInstagramUrl] = useState(initialData?.instagram_url ?? "");
  const [tiktokUrl, setTiktokUrl] = useState(initialData?.tiktok_url ?? "");
  const [linkedinUrl, setLinkedinUrl] = useState(initialData?.linkedin_url ?? "");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    const res = await fetch("/api/admin/settings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: initialData?.id,
        store_name: storeName,
        contact_email: contactEmail,
        contact_phone: contactPhone,
        whatsapp_number: whatsappNumber,
        address: address,
        announcement_text: announcementText,
        facebook_url: facebookUrl,
        instagram_url: instagramUrl,
        tiktok_url: tiktokUrl,
        linkedin_url: linkedinUrl,
      }),
    });

    const json = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(json.error || "Unable to save settings.");
      return;
    }

    setSuccess("Settings saved successfully.");
    router.refresh();
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-[1.8rem] border border-neutral-200 bg-white p-6 shadow-[0_12px_35px_rgba(0,0,0,0.04)]"
    >
      <h2 className="text-xl font-semibold text-neutral-950">Store Details</h2>

      <div className="mt-6 grid gap-5">
        <div>
          <label className="mb-2 block text-sm font-medium text-neutral-900">
            Store Name
          </label>
          <input
            value={storeName}
            onChange={(e) => setStoreName(e.target.value)}
            className="h-12 w-full rounded-xl border border-neutral-200 px-4 text-sm outline-none focus:border-red-500 focus:ring-2 focus:ring-red-200"
          />
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-neutral-900">
              Contact Email
            </label>
            <input
              value={contactEmail}
              onChange={(e) => setContactEmail(e.target.value)}
              className="h-12 w-full rounded-xl border border-neutral-200 px-4 text-sm outline-none focus:border-red-500 focus:ring-2 focus:ring-red-200"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-neutral-900">
              Contact Phone
            </label>
            <input
              value={contactPhone}
              onChange={(e) => setContactPhone(e.target.value)}
              className="h-12 w-full rounded-xl border border-neutral-200 px-4 text-sm outline-none focus:border-red-500 focus:ring-2 focus:ring-red-200"
            />
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-neutral-900">
            WhatsApp Number
          </label>
          <input
            value={whatsappNumber}
            onChange={(e) => setWhatsappNumber(e.target.value)}
            className="h-12 w-full rounded-xl border border-neutral-200 px-4 text-sm outline-none focus:border-red-500 focus:ring-2 focus:ring-red-200"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-neutral-900">
            Address
          </label>
          <textarea
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            rows={4}
            className="w-full rounded-xl border border-neutral-200 px-4 py-3 text-sm outline-none focus:border-red-500 focus:ring-2 focus:ring-red-200"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-neutral-900">
            Announcement Text
          </label>
          <textarea
            value={announcementText}
            onChange={(e) => setAnnouncementText(e.target.value)}
            rows={3}
            className="w-full rounded-xl border border-neutral-200 px-4 py-3 text-sm outline-none focus:border-red-500 focus:ring-2 focus:ring-red-200"
          />
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-neutral-900">
              Facebook URL
            </label>
            <input
              value={facebookUrl}
              onChange={(e) => setFacebookUrl(e.target.value)}
              className="h-12 w-full rounded-xl border border-neutral-200 px-4 text-sm outline-none focus:border-red-500 focus:ring-2 focus:ring-red-200"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-neutral-900">
              Instagram URL
            </label>
            <input
              value={instagramUrl}
              onChange={(e) => setInstagramUrl(e.target.value)}
              className="h-12 w-full rounded-xl border border-neutral-200 px-4 text-sm outline-none focus:border-red-500 focus:ring-2 focus:ring-red-200"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-neutral-900">
              TikTok URL
            </label>
            <input
              value={tiktokUrl}
              onChange={(e) => setTiktokUrl(e.target.value)}
              className="h-12 w-full rounded-xl border border-neutral-200 px-4 text-sm outline-none focus:border-red-500 focus:ring-2 focus:ring-red-200"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-neutral-900">
              LinkedIn URL
            </label>
            <input
              value={linkedinUrl}
              onChange={(e) => setLinkedinUrl(e.target.value)}
              className="h-12 w-full rounded-xl border border-neutral-200 px-4 text-sm outline-none focus:border-red-500 focus:ring-2 focus:ring-red-200"
            />
          </div>
        </div>
      </div>

      {error ? (
        <div className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      ) : null}

      {success ? (
        <div className="mt-5 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          {success}
        </div>
      ) : null}

      <button
        type="submit"
        disabled={loading}
        className="mt-6 inline-flex h-12 items-center justify-center rounded-xl bg-red-600 px-6 text-sm font-semibold text-white transition hover:bg-red-700 disabled:opacity-70"
      >
        {loading ? "Saving..." : "Save Settings"}
      </button>
    </form>
  );
}