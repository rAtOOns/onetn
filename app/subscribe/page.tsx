"use client";

import { useState, useEffect } from "react";
import { Bell, Building2, Tag, MapPin, Mail, Phone, CheckCircle, Loader2 } from "lucide-react";

interface Department {
  id: string;
  name: string;
  nameTamil: string | null;
}

interface Category {
  id: string;
  name: string;
  nameTamil: string | null;
}

interface District {
  id: string;
  name: string;
  nameTamil: string | null;
}

export default function SubscribePage() {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    email: "",
    phone: "",
    name: "",
    departmentId: "",
    categoryId: "",
    districtId: "",
    frequency: "instant",
  });

  useEffect(() => {
    Promise.all([
      fetch("/api/departments").then((r) => r.json()),
      fetch("/api/categories").then((r) => r.json()),
      fetch("/api/districts").then((r) => r.json()),
    ]).then(([depts, cats, dists]) => {
      setDepartments(depts);
      setCategories(cats);
      setDistricts(dists);
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      const response = await fetch("/api/subscriptions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to subscribe");
      }

      setSuccess(true);
      setFormData({
        email: "",
        phone: "",
        name: "",
        departmentId: "",
        categoryId: "",
        districtId: "",
        frequency: "instant",
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-tn-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-tn-primary to-tn-highlight text-white py-6">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Bell size={28} />
              <div>
                <h1 className="text-xl md:text-2xl font-bold">GO Alert Subscription</h1>
                <p className="text-sm tamil text-emerald-100">அரசாணை அறிவிப்பு</p>
              </div>
            </div>
            <p className="text-sm text-emerald-200 hidden md:block">
              Get notified on new GOs
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="max-w-2xl mx-auto">

          {/* Success Message */}
          {success && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center gap-3">
              <CheckCircle className="text-green-600" size={24} />
              <div>
                <p className="font-medium text-green-800">Subscribed Successfully!</p>
                <p className="text-sm text-green-600">
                  You will receive alerts when new documents matching your preferences are published.
                </p>
              </div>
            </div>
          )}

          {/* Subscription Form */}
          <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm p-6 md:p-8">
            <div className="space-y-6">
              {/* Contact Information */}
              <div>
                <h2 className="text-lg font-semibold text-tn-text mb-4 flex items-center gap-2">
                  <Mail size={20} className="text-tn-primary" />
                  Contact Information
                </h2>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address *
                    </label>
                    <input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="your@email.com"
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-tn-highlight"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                      WhatsApp Number (Optional)
                    </label>
                    <input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+91 98765 43210"
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-tn-highlight"
                    />
                  </div>
                </div>
                <div className="mt-4">
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Name (Optional)
                  </label>
                  <input
                    id="name"
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Your name"
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-tn-highlight"
                  />
                </div>
              </div>

              {/* Alert Preferences */}
              <div>
                <h2 className="text-lg font-semibold text-tn-text mb-4 flex items-center gap-2">
                  <Building2 size={20} className="text-tn-primary" />
                  Alert Preferences
                </h2>
                <p className="text-sm text-gray-500 mb-4">
                  Choose what type of documents you want to be notified about. Leave empty to receive all alerts.
                </p>

                <div className="space-y-4">
                  <div>
                    <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-1">
                      <Building2 size={16} className="inline mr-1" />
                      Department
                    </label>
                    <select
                      id="department"
                      value={formData.departmentId}
                      onChange={(e) => setFormData({ ...formData, departmentId: e.target.value })}
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-tn-highlight"
                    >
                      <option value="">All Departments</option>
                      {departments.map((dept) => (
                        <option key={dept.id} value={dept.id}>
                          {dept.name} {dept.nameTamil && `(${dept.nameTamil})`}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                      <Tag size={16} className="inline mr-1" />
                      Document Type
                    </label>
                    <select
                      id="category"
                      value={formData.categoryId}
                      onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-tn-highlight"
                    >
                      <option value="">All Document Types</option>
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.name} {cat.nameTamil && `(${cat.nameTamil})`}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="district" className="block text-sm font-medium text-gray-700 mb-1">
                      <MapPin size={16} className="inline mr-1" />
                      District
                    </label>
                    <select
                      id="district"
                      value={formData.districtId}
                      onChange={(e) => setFormData({ ...formData, districtId: e.target.value })}
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-tn-highlight"
                    >
                      <option value="">All Districts</option>
                      {districts.map((dist) => (
                        <option key={dist.id} value={dist.id}>
                          {dist.name} {dist.nameTamil && `(${dist.nameTamil})`}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Frequency */}
              <div>
                <h2 className="text-lg font-semibold text-tn-text mb-4 flex items-center gap-2">
                  <Phone size={20} className="text-tn-primary" />
                  Notification Frequency
                </h2>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { value: "instant", label: "Instant", desc: "As soon as published" },
                    { value: "daily", label: "Daily", desc: "Once per day" },
                    { value: "weekly", label: "Weekly", desc: "Weekly digest" },
                  ].map((option) => (
                    <label
                      key={option.value}
                      className={`flex flex-col items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
                        formData.frequency === option.value
                          ? "border-tn-primary bg-tn-primary/5"
                          : "border-gray-200 hover:border-tn-highlight"
                      }`}
                    >
                      <input
                        type="radio"
                        name="frequency"
                        value={option.value}
                        checked={formData.frequency === option.value}
                        onChange={(e) => setFormData({ ...formData, frequency: e.target.value })}
                        className="sr-only"
                      />
                      <span className="font-medium text-tn-text">{option.label}</span>
                      <span className="text-xs text-gray-500 text-center mt-1">{option.desc}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg">
                  {error}
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full btn-primary flex items-center justify-center gap-2 py-3 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin" size={20} />
                    Subscribing...
                  </>
                ) : (
                  <>
                    <Bell size={20} />
                    Subscribe to Alerts
                  </>
                )}
              </button>

              <p className="text-xs text-gray-500 text-center">
                You can unsubscribe at any time. We respect your privacy and won&apos;t spam you.
              </p>
            </div>
          </form>

          {/* Benefits */}
          <div className="mt-8 grid md:grid-cols-3 gap-4">
            {[
              { icon: Bell, title: "Instant Alerts", desc: "Get notified immediately when new GOs are published" },
              { icon: Building2, title: "Department Specific", desc: "Subscribe only to departments you care about" },
              { icon: MapPin, title: "District Focus", desc: "Track developments in your district" },
            ].map((benefit, i) => (
              <div key={i} className="bg-white rounded-lg p-4 text-center">
                <benefit.icon className="text-tn-accent mx-auto mb-2" size={24} />
                <h3 className="font-medium text-tn-text">{benefit.title}</h3>
                <p className="text-sm text-gray-500">{benefit.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
