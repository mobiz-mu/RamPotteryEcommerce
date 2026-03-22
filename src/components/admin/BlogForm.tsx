"use client";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export default function BlogForm() {
  return (
    <form className="space-y-8">
      <div className="grid gap-8 lg:grid-cols-2">
        <div className="rounded-3xl border border-neutral-200 bg-white p-6">
          <h2 className="text-xl font-semibold text-neutral-950">Blog Content</h2>

          <div className="mt-6 space-y-5">
            <div>
              <label className="mb-2 block text-sm font-medium text-neutral-900">
                Title
              </label>
              <Input placeholder="Blog title" />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-neutral-900">
                Slug
              </label>
              <Input placeholder="blog-post-slug" />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-neutral-900">
                Excerpt
              </label>
              <Textarea placeholder="Short excerpt" className="min-h-24" />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-neutral-900">
                Content
              </label>
              <Textarea placeholder="Full blog content" className="min-h-52" />
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="rounded-3xl border border-neutral-200 bg-white p-6">
            <h2 className="text-xl font-semibold text-neutral-950">Featured Image</h2>

            <div className="mt-6 rounded-2xl border border-dashed border-neutral-300 bg-neutral-50 p-8 text-center text-neutral-500">
              Blog image uploader
            </div>
          </div>

          <div className="rounded-3xl border border-neutral-200 bg-white p-6">
            <h2 className="text-xl font-semibold text-neutral-950">SEO</h2>

            <div className="mt-6 space-y-5">
              <div>
                <label className="mb-2 block text-sm font-medium text-neutral-900">
                  SEO Title
                </label>
                <Input placeholder="SEO title" />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-neutral-900">
                  SEO Description
                </label>
                <Textarea placeholder="SEO description" className="min-h-24" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <Button type="submit" className="rounded-full px-8">
          Save Blog
        </Button>
        <Button type="button" variant="outline" className="rounded-full px-8">
          Cancel
        </Button>
      </div>
    </form>
  );
}