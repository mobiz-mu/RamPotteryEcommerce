"use client";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export default function BannerForm() {
  return (
    <form className="space-y-8">
      <div className="grid gap-8 lg:grid-cols-2">
        <div className="rounded-3xl border border-neutral-200 bg-white p-6">
          <h2 className="text-xl font-semibold text-neutral-950">Banner Content</h2>

          <div className="mt-6 space-y-5">
            <div>
              <label className="mb-2 block text-sm font-medium text-neutral-900">
                Title
              </label>
              <Input placeholder="Banner title" />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-neutral-900">
                Subtitle
              </label>
              <Textarea placeholder="Banner subtitle" className="min-h-24" />
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-neutral-900">
                  CTA Label
                </label>
                <Input placeholder="Shop Now" />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-neutral-900">
                  CTA Link
                </label>
                <Input placeholder="/shop" />
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="rounded-3xl border border-neutral-200 bg-white p-6">
            <h2 className="text-xl font-semibold text-neutral-950">Desktop Banner</h2>

            <div className="mt-6 rounded-2xl border border-dashed border-neutral-300 bg-neutral-50 p-8 text-center text-neutral-500">
              Desktop banner uploader
            </div>
          </div>

          <div className="rounded-3xl border border-neutral-200 bg-white p-6">
            <h2 className="text-xl font-semibold text-neutral-950">Mobile Banner</h2>

            <div className="mt-6 rounded-2xl border border-dashed border-neutral-300 bg-neutral-50 p-8 text-center text-neutral-500">
              Mobile banner uploader
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <Button type="submit" className="rounded-full px-8">
          Save Banner
        </Button>
        <Button type="button" variant="outline" className="rounded-full px-8">
          Cancel
        </Button>
      </div>
    </form>
  );
}