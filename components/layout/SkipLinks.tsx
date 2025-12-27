export default function SkipLinks() {
  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-0 focus:top-0 focus:z-50 focus:block focus:w-full focus:bg-tn-primary focus:text-white focus:px-4 focus:py-3 focus:outline-none"
      >
        Skip to main content
      </a>
      <a
        href="#filters"
        className="sr-only focus:not-sr-only focus:absolute focus:left-0 focus:top-12 focus:z-50 focus:block focus:bg-tn-primary focus:text-white focus:px-4 focus:py-3 focus:outline-none"
      >
        Skip to filters
      </a>
    </>
  );
}
