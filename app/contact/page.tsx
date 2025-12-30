"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail, MessageSquare, AlertCircle, CheckCircle, Send, HelpCircle, Bug, Lightbulb, ArrowRight } from "lucide-react";
import PageContainer from "@/components/ui/page-container";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

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
    <PageContainer padding="lg">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-tn-text mb-4">
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
        <Card category="reference" variant="elevated">
          <CardHeader
            title="Send us a Message"
            icon={<Mail size={20} />}
            category="reference"
          />

          <CardContent>
            {submitted ? (
              <div className="text-center py-8">
                <CheckCircle className="mx-auto text-emerald-500 mb-4" size={48} />
                <h3 className="text-lg font-semibold text-tn-text mb-2">Thank You!</h3>
                <p className="text-gray-600 mb-4">
                  Your message has been received. We appreciate your feedback!
                </p>
                <Button
                  variant="primary"
                  onClick={() => {
                    setSubmitted(false);
                    setFormData({ name: "", email: "", reason: "feedback", message: "" });
                  }}
                >
                  Send another message
                </Button>
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

              <Button
                type="submit"
                variant="primary"
                fullWidth
                disabled={loading || !formData.message}
                isLoading={loading}
                icon={loading ? undefined : <Send size={18} />}
              >
                {loading ? "Sending..." : "Send Message"}
              </Button>
            </form>
            )}
          </CardContent>
        </Card>

        {/* FAQ Section & Quick Links */}
        <div className="space-y-6">
          <Card category="reference" variant="elevated">
            <CardHeader
              title="Frequently Asked Questions"
              icon={<HelpCircle size={20} />}
              category="reference"
            />
            <CardContent>
              <div className="space-y-4">
                {faqs.map((faq, i) => (
                  <div key={i} className="border-b pb-4 last:border-0 last:pb-0">
                    <h3 className="font-medium text-tn-text mb-1">{faq.question}</h3>
                    <p className="text-sm text-gray-600">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Links */}
          <Card category="default" variant="elevated">
            <CardHeader title="Quick Links" category="default" />
            <CardContent>
              <div className="space-y-2">
                {[
                  { href: "/tools", label: "Browse All Tools" },
                  { href: "/faq", label: "Full FAQ Page" },
                  { href: "/request", label: "Request a Document" },
                  { href: "/about", label: "About Us" },
                ].map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors text-sm font-medium"
                  >
                    <span>{link.label}</span>
                    <ArrowRight size={16} />
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Disclaimer */}
      <Card category="reference" className="mt-10">
        <CardHeader
          title="Please Note"
          icon={<AlertCircle size={20} />}
          category="reference"
        />
        <CardContent>
          <p className="text-sm text-gray-700">
            This is an unofficial portal. For official queries regarding your service matters,
            salary, or other administrative issues, please contact your respective DDO, DEO office,
            or the Directorate of School Education, Tamil Nadu.
          </p>
        </CardContent>
      </Card>

      {/* Official Contacts */}
      <Card category="default" className="mt-6">
        <CardHeader title="Official Contacts" category="default" />
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <p className="font-medium text-tn-text">Directorate of School Education</p>
              <p className="text-sm text-gray-600">DPI Campus, College Road</p>
              <p className="text-sm text-gray-600">Chennai - 600 006</p>
              <p className="text-sm text-gray-600 mt-1">Phone: 044-28278803</p>
            </div>
            <div className="space-y-2">
              <p className="font-medium text-tn-text">Useful Official Websites</p>
              <ul className="space-y-1 text-sm text-gray-600">
                <li>• EMIS: emis.tnschools.gov.in</li>
                <li>• IFHRMS: ifhrms.tn.gov.in</li>
                <li>• TN Govt: tn.gov.in</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </PageContainer>
  );
}
