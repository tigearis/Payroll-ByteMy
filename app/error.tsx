"use client";

import { useRouter } from "next/navigation";

export default function Error({ error }: { error?: { message: string } }) {
  const router = useRouter();

  return (
    <main className="flex flex-1 items-center justify-center bg-white px-6 py-24 sm:py-32 lg:px-8">
      <div className="text-center">
        <p className="text-base font-semibold text-red-600">Error</p>
        <h1 className="mt-4 text-5xl font-semibold tracking-tight text-gray-900 sm:text-7xl">
          {error?.message || "Something went wrong"}
        </h1>
        <p className="mt-6 text-lg text-gray-500 sm:text-xl">
          Sorry, an unexpected error has occurred. Please try again later.
        </p>
        <div className="mt-10 flex items-center justify-center gap-x-6">
          <button
            onClick={() => router.push("/")}
            className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-indigo-500 focus-visible:outline focus-visible:ring-2 focus-visible:ring-indigo-600"
          >
            Go back home
          </button>
          <a href="/contact" className="text-sm font-semibold text-gray-900">
            Contact support <span aria-hidden="true">&rarr;</span>
          </a>
        </div>
      </div>
    </main>
  );
}
