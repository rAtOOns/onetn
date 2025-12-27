"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { MapPin, Building2, Users, FileText, Search, ChevronRight } from "lucide-react";

interface District {
  id: string;
  name: string;
  nameTamil: string | null;
  slug: string;
}

interface Constituency {
  id: string;
  name: string;
  nameTamil: string | null;
  type: string;
  districtId: string;
  mlaName: string | null;
  mlaNameTamil: string | null;
  mpName: string | null;
  mpNameTamil: string | null;
}

interface DocumentCount {
  districtId: string;
  _count: number;
}

export default function ConstituencyPage() {
  const [districts, setDistricts] = useState<District[]>([]);
  const [constituencies, setConstituencies] = useState<Constituency[]>([]);
  const [documentCounts, setDocumentCounts] = useState<Record<string, number>>({});
  const [selectedDistrict, setSelectedDistrict] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/districts").then((r) => r.json()),
      fetch("/api/constituencies").then((r) => r.json()),
    ]).then(([dists, cons]) => {
      setDistricts(dists);
      setConstituencies(Array.isArray(cons) ? cons : []);
      setLoading(false);
    });
  }, []);

  const filteredDistricts = districts.filter((district) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      district.name.toLowerCase().includes(query) ||
      district.nameTamil?.toLowerCase().includes(query)
    );
  });

  const districtConstituencies = selectedDistrict
    ? constituencies.filter((c) => c.districtId === selectedDistrict)
    : [];

  const selectedDistrictInfo = districts.find((d) => d.id === selectedDistrict);

  return (
    <div className="min-h-screen bg-tn-background">
      {/* Compact Header */}
      <div className="bg-tn-primary text-white py-4">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <MapPin size={24} />
            <h1 className="text-xl md:text-2xl font-bold">Districts & Constituencies <span className="tamil font-normal text-gray-300 text-base">மாவட்டங்கள் & தொகுதிகள்</span></h1>
          </div>
          <p className="text-sm text-gray-300 hidden md:block">
            Browse by location
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">

        <div className="grid lg:grid-cols-3 gap-8">
          {/* District List */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-4">
              <h2 className="font-semibold text-tn-text mb-4 flex items-center gap-2">
                <Building2 size={20} className="text-tn-primary" />
                Select District
              </h2>

              {/* Search */}
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  placeholder="Search district..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-tn-highlight text-sm"
                />
              </div>

              {/* District List */}
              <div className="max-h-[500px] overflow-y-auto space-y-1">
                {loading ? (
                  <div className="animate-pulse space-y-2">
                    {[...Array(10)].map((_, i) => (
                      <div key={i} className="h-10 bg-gray-100 rounded"></div>
                    ))}
                  </div>
                ) : (
                  filteredDistricts.map((district) => (
                    <button
                      key={district.id}
                      onClick={() => setSelectedDistrict(district.id)}
                      className={`w-full text-left px-4 py-3 rounded-lg transition-all flex items-center justify-between ${
                        selectedDistrict === district.id
                          ? "bg-tn-primary text-white"
                          : "hover:bg-gray-50"
                      }`}
                    >
                      <div>
                        <span className="font-medium">{district.name}</span>
                        {district.nameTamil && (
                          <span className={`block text-sm tamil ${
                            selectedDistrict === district.id ? "text-green-100" : "text-gray-500"
                          }`}>
                            {district.nameTamil}
                          </span>
                        )}
                      </div>
                      <ChevronRight size={18} className={selectedDistrict === district.id ? "text-white" : "text-gray-400"} />
                    </button>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* District Details */}
          <div className="lg:col-span-2">
            {selectedDistrictInfo ? (
              <div className="space-y-6">
                {/* District Header */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <h2 className="text-2xl font-bold text-tn-text">
                        {selectedDistrictInfo.name}
                      </h2>
                      {selectedDistrictInfo.nameTamil && (
                        <p className="text-lg text-gray-600 tamil">
                          {selectedDistrictInfo.nameTamil}
                        </p>
                      )}
                    </div>
                    <Link
                      href={`/documents?district=${selectedDistrictInfo.slug}`}
                      className="btn-primary flex items-center gap-2"
                    >
                      <FileText size={18} />
                      View All Documents
                    </Link>
                  </div>

                  {/* Quick Stats */}
                  <div className="grid grid-cols-3 gap-4 mt-6">
                    <div className="bg-tn-primary/5 rounded-lg p-4 text-center">
                      <FileText className="mx-auto text-tn-primary mb-2" size={24} />
                      <p className="text-2xl font-bold text-tn-text">
                        {documentCounts[selectedDistrict] || 0}
                      </p>
                      <p className="text-sm text-gray-500">Documents</p>
                    </div>
                    <div className="bg-tn-accent/5 rounded-lg p-4 text-center">
                      <Users className="mx-auto text-tn-accent mb-2" size={24} />
                      <p className="text-2xl font-bold text-tn-text">
                        {districtConstituencies.filter((c) => c.type === "assembly").length}
                      </p>
                      <p className="text-sm text-gray-500">Assembly</p>
                    </div>
                    <div className="bg-tn-highlight/5 rounded-lg p-4 text-center">
                      <Building2 className="mx-auto text-tn-highlight mb-2" size={24} />
                      <p className="text-2xl font-bold text-tn-text">
                        {districtConstituencies.filter((c) => c.type === "parliamentary").length}
                      </p>
                      <p className="text-sm text-gray-500">Parliamentary</p>
                    </div>
                  </div>
                </div>

                {/* Constituencies */}
                {districtConstituencies.length > 0 && (
                  <div className="bg-white rounded-xl shadow-sm p-6">
                    <h3 className="font-semibold text-tn-text mb-4">Constituencies</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      {districtConstituencies.map((constituency) => (
                        <div
                          key={constituency.id}
                          className="border rounded-lg p-4 hover:border-tn-primary transition-colors"
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h4 className="font-medium text-tn-text">
                                {constituency.name}
                              </h4>
                              {constituency.nameTamil && (
                                <p className="text-sm text-gray-500 tamil">
                                  {constituency.nameTamil}
                                </p>
                              )}
                            </div>
                            <span className={`text-xs px-2 py-1 rounded-full ${
                              constituency.type === "assembly"
                                ? "bg-blue-100 text-blue-700"
                                : "bg-purple-100 text-purple-700"
                            }`}>
                              {constituency.type === "assembly" ? "MLA" : "MP"}
                            </span>
                          </div>
                          {(constituency.mlaName || constituency.mpName) && (
                            <div className="mt-3 pt-3 border-t">
                              <p className="text-sm text-gray-600">
                                <span className="font-medium">Representative:</span>{" "}
                                {constituency.type === "assembly"
                                  ? constituency.mlaName
                                  : constituency.mpName}
                              </p>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Quick Links */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h3 className="font-semibold text-tn-text mb-4">Quick Links</h3>
                  <div className="grid sm:grid-cols-2 gap-3">
                    <Link
                      href={`/documents?district=${selectedDistrictInfo.slug}&category=government-orders`}
                      className="flex items-center gap-3 p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <FileText className="text-tn-primary" size={20} />
                      <span>Government Orders</span>
                    </Link>
                    <Link
                      href={`/documents?district=${selectedDistrictInfo.slug}&category=circulars`}
                      className="flex items-center gap-3 p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <FileText className="text-tn-accent" size={20} />
                      <span>Circulars</span>
                    </Link>
                    <Link
                      href={`/documents?district=${selectedDistrictInfo.slug}&category=schemes`}
                      className="flex items-center gap-3 p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <FileText className="text-tn-highlight" size={20} />
                      <span>Schemes</span>
                    </Link>
                    <Link
                      href={`/documents?district=${selectedDistrictInfo.slug}&category=forms`}
                      className="flex items-center gap-3 p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <FileText className="text-tn-government" size={20} />
                      <span>Forms</span>
                    </Link>
                  </div>
                </div>

                {/* Subscribe CTA */}
                <div className="bg-tn-primary/5 rounded-xl p-6">
                  <h3 className="font-semibold text-tn-text mb-2">
                    Stay Updated on {selectedDistrictInfo.name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Get notified when new documents are published for your district.
                  </p>
                  <Link
                    href={`/subscribe?districtId=${selectedDistrict}`}
                    className="btn-primary inline-flex items-center gap-2"
                  >
                    Subscribe to Alerts
                  </Link>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-sm p-12 text-center">
                <MapPin className="mx-auto text-gray-300 mb-4" size={48} />
                <h3 className="text-xl font-semibold text-tn-text mb-2">
                  Select a District
                </h3>
                <p className="text-gray-500">
                  Choose a district from the list to view documents and constituency information.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
