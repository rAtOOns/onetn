"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail, MessageSquare, AlertCircle, CheckCircle, Send, HelpCircle, Bug, Lightbulb } from "lucide-react";

const contactReasons = [
  { id: "feedback", label: "General Feedback", icon: MessageSquare },
  { id: "suggestion", label: "Feature Suggestion", icon: Lightbulb },
  { id: "bug", label: "Report a Bug", icon: Bug },
  { id: "correction", label: "Data/Rule Correction", icon: AlertCircle },
  { id: "help", label: "Need Help", icon: HelpCircle },
];

const faqs = [
  {
    question: "Is this an official government website?",
    answer: "No, One TN Portal is an unofficial, community-driven project. Always verify information with official sources.",
  },
  {
    question: "Are the calculations accurate?",
    answer: "Our calculations are based on official rules and regularly updated. However, always cross-check with your DDO or official sources for important decisions.",
  },
  {
    question: "Do you store my data?",
    answer: "No. All calculations happen in your browser. We do not store any personal or financial information.",
  },
  {
    question: "Can I suggest a new tool?",
    answer: "Yes! Use the form below to suggest new tools or features. We regularly add new tools based on user feedback.",
  },
  {
    question: "I found an error in a calculation. How do I report it?",
    answer: "Please use the form below with 'Data/Rule Correction' selected. Provide details of the error and the correct information if you know it.",
  },
];

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    reason: "feedback",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1000));

    setSubmitted(true);
    setLoading(false);
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-bold text-tn-text mb-4">
          Contact Us
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Have feedback, suggestions, or found an error? We&apos;d love to hear from you.
        </p>
        <p className="text-sm text-gray-500 tamil mt-2">
          கருத்துகள், பரிந்துரைகள் அல்லது பிழைகள் இருந்தால் எங்களை தொடர்பு கொள்ளவும்
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Contact Form */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h2 className="font-semibold text-tn-text mb-4 flex items-center gap-2">
            <Mail size={20} />
            Send us a Message
          </h2>

          {submitted ? (
            <div className="text-center py-12">
              <CheckCircle className="mx-auto text-green-500 mb-4" size={48} />
              <h3 className="text-xl font-semibold text-tn-text mb-2">Thank You!</h3>
              <p className="text-gray-600 mb-4">
                Your message has been received. We appreciate your feedback!
              </p>
              <button
                onClick={() => {
                  setSubmitted(false);
                  setFormData({ name: "", email: "", reason: "feedback", message: "" });
                }}
                className="text-tn-primary hover:underline"
              >
                Send another message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Your Name (Optional)
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-tn-primary focus:outline-none"
                  placeholder="Enter your name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email (Optional - for response)
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-tn-primary focus:outline-none"
                  placeholder="your.email@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reason for Contact
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {contactReasons.map((reason) => {
                    const Icon = reason.icon;
                    return (
                      <button
                        key={reason.id}
                        type="button"
                        onClick={() => setFormData({ ...formData, reason: reason.id })}
                        className={`flex items-center gap-2 p-2 rounded-lg text-sm transition-colors ${
                          formData.reason === reason.id
                            ? "bg-tn-primary text-white"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                      >
                        <Icon size={16} />
                        <span className="truncate">{reason.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Your Message *
                </label>
                <textarea
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-tn-primary focus:outline-none"
                  rows={5}
                  placeholder="Please describe your feedback, suggestion, or issue in detail..."
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading || !formData.message}
                className="w-full bg-tn-primary text-white py-3 rounded-lg font-medium hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>Sending...</>
                ) : (
                  <>
                    <Send size={18} />
                    Send Message
                  </>
                )}
              </button>
            </form>
          )}
        </div>

        {/* FAQ Section */}
        <div>
          <div className="bg-white rounded-xl shadow-sm border p-6 mb-6">
            <h2 className="font-semibold text-tn-text mb-4 flex items-center gap-2">
              <HelpCircle size={20} />
              Frequently Asked Questions
            </h2>
            <div className="space-y-4">
              {faqs.map((faq, i) => (
                <div key={i} className="border-b pb-4 last:border-0 last:pb-0">
                  <h3 className="font-medium text-tn-text mb-1">{faq.question}</h3>
                  <p className="text-sm text-gray-600">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="bg-gray-50 rounded-xl p-6">
            <h3 className="font-semibold text-tn-text mb-4">Quick Links</h3>
            <div className="space-y-2">
              <Link
                href="/tools"
                className="block p-3 bg-white rounded-lg hover:bg-gray-100 transition-colors text-sm"
              >
                Browse All Tools →
              </Link>
              <Link
                href="/faq"
                className="block p-3 bg-white rounded-lg hover:bg-gray-100 transition-colors text-sm"
              >
                Full FAQ Page →
              </Link>
              <Link
                href="/request"
                className="block p-3 bg-white rounded-lg hover:bg-gray-100 transition-colors text-sm"
              >
                Request a Document →
              </Link>
              <Link
                href="/about"
                className="block p-3 bg-white rounded-lg hover:bg-gray-100 transition-colors text-sm"
              >
                About Us →
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="mt-12 bg-amber-50 border border-amber-200 rounded-xl p-6">
        <div className="flex items-start gap-3">
          <AlertCircle className="text-amber-600 flex-shrink-0 mt-0.5" size={20} />
          <div>
            <h3 className="font-semibold text-amber-800 mb-1">Please Note</h3>
            <p className="text-sm text-amber-700">
              This is an unofficial portal. For official queries regarding your service matters,
              salary, or other administrative issues, please contact your respective DDO, DEO office,
              or the Directorate of School Education, Tamil Nadu.
            </p>
          </div>
        </div>
      </div>

      {/* Official Contacts */}
      <div className="mt-6 bg-blue-50 rounded-xl p-6">
        <h3 className="font-semibold text-blue-800 mb-4">Official Contacts</h3>
        <div className="grid md:grid-cols-2 gap-4 text-sm text-blue-700">
          <div>
            <p className="font-medium mb-2">Directorate of School Education</p>
            <p>DPI Campus, College Road</p>
            <p>Chennai - 600 006</p>
            <p className="mt-1">Phone: 044-28278803</p>
          </div>
          <div>
            <p className="font-medium mb-2">Useful Official Websites</p>
            <ul className="space-y-1">
              <li>• EMIS: emis.tnschools.gov.in</li>
              <li>• IFHRMS: ifhrms.tn.gov.in</li>
              <li>• TN Govt: tn.gov.in</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
