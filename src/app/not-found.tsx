import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="min-h-[80vh] flex flex-col items-center justify-center px-6 py-24 text-center bg-white">
      <p className="text-[160px] md:text-[220px] font-black leading-none text-black select-none">
        404
      </p>
      <h1 className="text-4xl md:text-5xl font-bold text-black mt-2 mb-4">
        Page not found
      </h1>
      <p className="text-lg text-black/70 max-w-[45ch] mb-10">
        Sorry, the page you are looking for does not exist or may have been moved.
        Let us help you find your way back.
      </p>
      <div className="flex flex-col sm:flex-row gap-4">
        <Link
          href="/"
          className="bg-deep-green text-white px-8 py-3 rounded-full font-semibold text-base hover:bg-primary transition-colors shadow-sm"
        >
          Back to Home
        </Link>
        <Link
          href="/search"
          className="border-2 border-deep-green text-deep-green px-8 py-3 rounded-full font-semibold text-base hover:bg-light-sage/30 transition-colors"
        >
          Browse PGs
        </Link>
      </div>
    </main>
  );
}
