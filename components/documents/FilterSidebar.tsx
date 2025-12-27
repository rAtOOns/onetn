"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ChevronDown, X } from "lucide-react";

interface FilterSidebarProps {
  topics: Array<{ id: string; name: string; nameTamil: string | null; slug: string }>;
  categories: Array<{ id: string; name: string; slug: string }>;
  departments: Array<{ id: string; name: string; slug: string }>;
  districts: Array<{ id: string; name: string; slug: string }>;
  years: number[];
  activeFilters: {
    topic?: string;
    category?: string;
    dept?: string;
    district?: string;
    year?: string;
    q?: string;
  };
}

interface FilterSectionProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

function FilterSection({ title, children, defaultOpen = true }: FilterSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-gray-200 last:border-b-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        className="w-full flex items-center justify-between py-3 px-4 text-sm font-medium text-gray-900 hover:bg-gray-50 transition-colors focus:outline-none focus:bg-gray-100"
      >
        {title}
        <ChevronDown
          size={16}
          className={`text-gray-500 transition-transform ${isOpen ? "rotate-180" : ""}`}
          aria-hidden="true"
        />
      </button>
      {isOpen && <div className="px-4 pb-4">{children}</div>}
    </div>
  );
}

export default function FilterSidebar({
  topics,
  categories,
  departments,
  districts,
  years,
  activeFilters,
}: FilterSidebarProps) {
  const router = useRouter();
  const { topic: activeTopic, category: activeCategory, dept: activeDept, district: activeDistrict, year: activeYear, q: searchQuery } = activeFilters;

  const buildFilterUrl = (params: Record<string, string | undefined>) => {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value) searchParams.set(key, value);
    });
    return `/documents${searchParams.toString() ? `?${searchParams.toString()}` : ""}`;
  };

  const activeFilterCount = [activeCategory, activeDept, activeTopic, activeDistrict, activeYear].filter(Boolean).length;

  return (
    <aside className="w-full lg:w-64 flex-shrink-0" id="filters" aria-label="Filters">
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden lg:sticky lg:top-4">
        {/* Header */}
        <div className="bg-gray-50 border-b border-gray-200 px-4 py-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-gray-900">
            Filters
            {activeFilterCount > 0 && (
              <span className="ml-2 px-1.5 py-0.5 text-xs bg-tn-primary text-white rounded" aria-label={`${activeFilterCount} active filters`}>
                {activeFilterCount}
              </span>
            )}
          </h2>
          {activeFilterCount > 0 && (
            <Link
              href="/documents"
              className="text-xs text-tn-secondary hover:text-tn-primary flex items-center gap-1 focus:outline-none focus:ring-1 focus:ring-tn-primary rounded px-1"
              aria-label="Clear all filters"
            >
              <X size={12} aria-hidden="true" />
              Clear
            </Link>
          )}
        </div>

        {/* Active Filters Tags */}
        {activeFilterCount > 0 && (
          <div className="px-4 py-2 bg-gray-50 border-b flex flex-wrap gap-1.5" aria-label="Active filters">
            {activeTopic && (
              <Link
                href={buildFilterUrl({ category: activeCategory, dept: activeDept, district: activeDistrict, year: activeYear, q: searchQuery })}
                className="inline-flex items-center gap-1 px-2 py-0.5 text-xs bg-tn-accent/10 text-tn-accent rounded hover:bg-tn-accent/20 focus:outline-none focus:ring-1 focus:ring-tn-accent"
                aria-label={`Remove ${topics.find(t => t.slug === activeTopic)?.name} filter`}
              >
                {topics.find(t => t.slug === activeTopic)?.name}
                <X size={10} aria-hidden="true" />
              </Link>
            )}
            {activeCategory && (
              <Link
                href={buildFilterUrl({ topic: activeTopic, dept: activeDept, district: activeDistrict, year: activeYear, q: searchQuery })}
                className="inline-flex items-center gap-1 px-2 py-0.5 text-xs bg-tn-highlight/10 text-tn-primary rounded hover:bg-tn-highlight/20 focus:outline-none focus:ring-1 focus:ring-tn-primary"
                aria-label={`Remove ${categories.find(c => c.slug === activeCategory)?.name} filter`}
              >
                {categories.find(c => c.slug === activeCategory)?.name}
                <X size={10} aria-hidden="true" />
              </Link>
            )}
            {activeDept && (
              <Link
                href={buildFilterUrl({ topic: activeTopic, category: activeCategory, district: activeDistrict, year: activeYear, q: searchQuery })}
                className="inline-flex items-center gap-1 px-2 py-0.5 text-xs bg-blue-50 text-blue-700 rounded hover:bg-blue-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
                aria-label={`Remove ${departments.find(d => d.slug === activeDept)?.name} filter`}
              >
                {departments.find(d => d.slug === activeDept)?.name?.split(' ').slice(0, 2).join(' ')}...
                <X size={10} aria-hidden="true" />
              </Link>
            )}
            {activeDistrict && (
              <Link
                href={buildFilterUrl({ topic: activeTopic, category: activeCategory, dept: activeDept, year: activeYear, q: searchQuery })}
                className="inline-flex items-center gap-1 px-2 py-0.5 text-xs bg-purple-50 text-purple-700 rounded hover:bg-purple-100 focus:outline-none focus:ring-1 focus:ring-purple-500"
                aria-label={`Remove ${districts.find(d => d.slug === activeDistrict)?.name} filter`}
              >
                {districts.find(d => d.slug === activeDistrict)?.name}
                <X size={10} aria-hidden="true" />
              </Link>
            )}
            {activeYear && (
              <Link
                href={buildFilterUrl({ topic: activeTopic, category: activeCategory, dept: activeDept, district: activeDistrict, q: searchQuery })}
                className="inline-flex items-center gap-1 px-2 py-0.5 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200 focus:outline-none focus:ring-1 focus:ring-gray-500"
                aria-label={`Remove ${activeYear} year filter`}
              >
                {activeYear}
                <X size={10} aria-hidden="true" />
              </Link>
            )}
          </div>
        )}

        {/* Filter Sections */}
        <div>
          {/* Topics */}
          <FilterSection title="Topic">
            <div className="space-y-1 max-h-48 overflow-y-auto">
              {topics.map((topic) => (
                <Link
                  key={topic.id}
                  href={buildFilterUrl({
                    topic: activeTopic === topic.slug ? undefined : topic.slug,
                    category: activeCategory,
                    dept: activeDept,
                    district: activeDistrict,
                    year: activeYear,
                    q: searchQuery
                  })}
                  className={`block px-2 py-1.5 text-sm rounded transition-colors focus:outline-none focus:ring-1 ${
                    activeTopic === topic.slug
                      ? "bg-tn-accent text-white focus:ring-tn-accent"
                      : "text-gray-700 hover:bg-gray-100 focus:ring-tn-accent"
                  }`}
                >
                  {topic.name}
                </Link>
              ))}
            </div>
          </FilterSection>

          {/* Category */}
          <FilterSection title="Document Type">
            <div className="space-y-1">
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  href={buildFilterUrl({
                    category: activeCategory === cat.slug ? undefined : cat.slug,
                    topic: activeTopic,
                    dept: activeDept,
                    district: activeDistrict,
                    year: activeYear,
                    q: searchQuery
                  })}
                  className={`block px-2 py-1.5 text-sm rounded transition-colors focus:outline-none focus:ring-1 ${
                    activeCategory === cat.slug
                      ? "bg-tn-highlight text-white focus:ring-tn-highlight"
                      : "text-gray-700 hover:bg-gray-100 focus:ring-tn-highlight"
                  }`}
                >
                  {cat.name}
                </Link>
              ))}
            </div>
          </FilterSection>

          {/* Department */}
          <FilterSection title="Department" defaultOpen={false}>
            <select
              onChange={(e) => {
                const url = buildFilterUrl({
                  dept: e.target.value || undefined,
                  category: activeCategory,
                  topic: activeTopic,
                  district: activeDistrict,
                  year: activeYear,
                  q: searchQuery
                });
                router.push(url);
              }}
              value={activeDept || ""}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-tn-primary bg-white"
            >
              <option value="">All Departments</option>
              {departments.map((dept) => (
                <option key={dept.id} value={dept.slug}>
                  {dept.name}
                </option>
              ))}
            </select>
          </FilterSection>

          {/* District */}
          <FilterSection title="District" defaultOpen={false}>
            <select
              onChange={(e) => {
                const url = buildFilterUrl({
                  district: e.target.value || undefined,
                  dept: activeDept,
                  category: activeCategory,
                  topic: activeTopic,
                  year: activeYear,
                  q: searchQuery
                });
                router.push(url);
              }}
              value={activeDistrict || ""}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-tn-primary bg-white"
            >
              <option value="">All Districts (State-wide)</option>
              {districts.map((district) => (
                <option key={district.id} value={district.slug}>
                  {district.name}
                </option>
              ))}
            </select>
          </FilterSection>

          {/* Year */}
          <FilterSection title="Year">
            <div className="flex flex-wrap gap-1.5">
              {years.map((year) => (
                <Link
                  key={year}
                  href={buildFilterUrl({
                    year: activeYear === year.toString() ? undefined : year.toString(),
                    topic: activeTopic,
                    category: activeCategory,
                    dept: activeDept,
                    district: activeDistrict,
                    q: searchQuery
                  })}
                  className={`px-2.5 py-1 text-xs font-medium rounded transition-colors focus:outline-none focus:ring-1 ${
                    activeYear === year.toString()
                      ? "bg-gray-900 text-white focus:ring-gray-700"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200 focus:ring-gray-400"
                  }`}
                >
                  {year}
                </Link>
              ))}
            </div>
          </FilterSection>
        </div>
      </div>
    </aside>
  );
}
