"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  FileText,
  Printer,
  Copy,
  Check,
  Calendar,
  User,
  Building,
  Mail,
  ClipboardList,
  Wallet,
  Plane,
  Heart,
  AlertCircle,
} from "lucide-react";

type LetterCategory = "leave" | "gpf" | "transfer" | "medical" | "general";

interface LetterTemplate {
  id: string;
  name: string;
  nameTamil: string;
  category: LetterCategory;
  icon: typeof FileText;
}

const letterTemplates: LetterTemplate[] = [
  // Leave
  { id: "casual-leave", name: "Casual Leave", nameTamil: "தற்காலிக விடுப்பு", category: "leave", icon: Calendar },
  { id: "earned-leave", name: "Earned Leave", nameTamil: "ஈட்டிய விடுப்பு", category: "leave", icon: Calendar },
  { id: "medical-leave", name: "Medical Leave", nameTamil: "மருத்துவ விடுப்பு", category: "leave", icon: Heart },
  { id: "maternity-leave", name: "Maternity Leave", nameTamil: "மகப்பேறு விடுப்பு", category: "leave", icon: Heart },
  // GPF
  { id: "gpf-advance", name: "GPF Advance", nameTamil: "GPF முன்பணம்", category: "gpf", icon: Wallet },
  { id: "gpf-withdrawal", name: "GPF Withdrawal", nameTamil: "GPF திரும்பப்பெறுதல்", category: "gpf", icon: Wallet },
  // Transfer
  { id: "transfer-request", name: "Transfer Request", nameTamil: "இடமாற்றம் கோரிக்கை", category: "transfer", icon: Plane },
  { id: "spouse-posting", name: "Spouse Station", nameTamil: "துணை நிலைய கோரிக்கை", category: "transfer", icon: Plane },
  // Medical
  { id: "medical-reimbursement", name: "Medical Reimbursement", nameTamil: "மருத்துவ செலவு திருப்பி", category: "medical", icon: Heart },
  // General
  { id: "general-request", name: "General Request", nameTamil: "பொது கோரிக்கை", category: "general", icon: Mail },
  { id: "representation", name: "Representation", nameTamil: "மனு", category: "general", icon: AlertCircle },
];

const categories = [
  { id: "leave" as LetterCategory, name: "Leave", nameTamil: "விடுப்பு", icon: Calendar },
  { id: "gpf" as LetterCategory, name: "GPF", nameTamil: "GPF", icon: Wallet },
  { id: "transfer" as LetterCategory, name: "Transfer", nameTamil: "இடமாற்றம்", icon: Plane },
  { id: "medical" as LetterCategory, name: "Medical", nameTamil: "மருத்துவம்", icon: Heart },
  { id: "general" as LetterCategory, name: "General", nameTamil: "பொது", icon: Mail },
];

// Tamil date formatter
function formatTamilDate(date: Date): string {
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear();
  return `${day}.${month}.${year}`;
}

// Letter content generators
function generateLeaveContent(
  leaveType: string,
  fromDate: string,
  toDate: string,
  reason: string,
  days: number
): { subject: string; body: string } {
  const leaveNames: Record<string, { en: string; ta: string }> = {
    "casual-leave": { en: "Casual Leave", ta: "தற்காலிக விடுப்பு" },
    "earned-leave": { en: "Earned Leave", ta: "ஈட்டிய விடுப்பு" },
    "medical-leave": { en: "Medical Leave", ta: "மருத்துவ விடுப்பு" },
    "maternity-leave": { en: "Maternity Leave", ta: "மகப்பேறு விடுப்பு" },
  };

  const leaveName = leaveNames[leaveType] || { en: "Leave", ta: "விடுப்பு" };

  return {
    subject: `${leaveName.ta} கோரிக்கை - ${days} நாட்கள்`,
    body: `எனக்கு ${fromDate} முதல் ${toDate} வரை ${days} நாட்கள் ${leaveName.ta} தேவைப்படுகிறது.

காரணம்: ${reason}

எனவே, மேற்கண்ட நாட்களுக்கு ${leaveName.ta} வழங்குமாறு தாழ்மையுடன் கேட்டுக்கொள்கிறேன்.`,
  };
}

function generateGPFContent(
  gpfType: string,
  amount: string,
  purpose: string
): { subject: string; body: string } {
  const isAdvance = gpfType === "gpf-advance";

  return {
    subject: isAdvance ? `GPF முன்பணம் கோரிக்கை - ₹${amount}` : `GPF திரும்பப்பெறுதல் கோரிக்கை - ₹${amount}`,
    body: `என்னுடைய GPF கணக்கிலிருந்து ₹${amount} (ரூபாய் ${amount} மட்டும்) ${isAdvance ? "முன்பணமாக" : "இறுதி திரும்பப்பெறுதலாக"} பெற விரும்புகிறேன்.

பயன்படுத்தும் நோக்கம்: ${purpose}

எனவே, தேவையான நடவடிக்கை எடுக்குமாறு தாழ்மையுடன் கேட்டுக்கொள்கிறேன்.`,
  };
}

function generateTransferContent(
  transferType: string,
  currentPlace: string,
  requestedPlace: string,
  reason: string
): { subject: string; body: string } {
  const isSpouse = transferType === "spouse-posting";

  return {
    subject: isSpouse ? "துணை நிலைய கோரிக்கை" : "இடமாற்றம் கோரிக்கை",
    body: `தற்போது நான் ${currentPlace} இல் பணிபுரிந்து வருகிறேன்.

${isSpouse ? `என் துணை அரசு பணியில் ${requestedPlace} இல் பணிபுரிந்து வருகிறார். எனவே, குடும்பத்துடன் இணைந்து வாழ தங்கள் உதவி தேவை.` : `${requestedPlace} இற்கு இடமாற்றம் கோருகிறேன்.`}

காரணம்: ${reason}

எனவே, எனக்கு ${requestedPlace} இற்கு இடமாற்றம் வழங்குமாறு தாழ்மையுடன் கேட்டுக்கொள்கிறேன்.`,
  };
}

function generateMedicalContent(
  amount: string,
  hospitalName: string,
  treatmentFor: string
): { subject: string; body: string } {
  return {
    subject: `மருத்துவ செலவு திருப்பி கோரிக்கை - ₹${amount}`,
    body: `நான் / என் குடும்பத்தினர் ${treatmentFor} க்காக ${hospitalName} மருத்துவமனையில் சிகிச்சை பெற்றேன்/பெற்றார்.

மொத்த மருத்துவ செலவு: ₹${amount}

இத்துடன் மருத்துவ பில்கள் மற்றும் மருத்துவர் சான்றிதழ் இணைக்கப்பட்டுள்ளது.

எனவே, மேற்கண்ட தொகையை திருப்பி வழங்குமாறு தாழ்மையுடன் கேட்டுக்கொள்கிறேன்.`,
  };
}

function generateGeneralContent(
  subject: string,
  content: string
): { subject: string; body: string } {
  return {
    subject: subject,
    body: content,
  };
}

export default function LetterDraftsPage() {
  const [selectedCategory, setSelectedCategory] = useState<LetterCategory>("leave");
  const [selectedTemplate, setSelectedTemplate] = useState<string>("casual-leave");
  const [copied, setCopied] = useState(false);
  const letterRef = useRef<HTMLDivElement>(null);

  // Common fields
  const [senderName, setSenderName] = useState("");
  const [senderDesignation, setSenderDesignation] = useState("");
  const [senderOffice, setSenderOffice] = useState("");
  const [senderPlace, setSenderPlace] = useState("");
  const [recipientDesignation, setRecipientDesignation] = useState("");
  const [recipientOffice, setRecipientOffice] = useState("");

  // Leave fields
  const [leaveFromDate, setLeaveFromDate] = useState("");
  const [leaveToDate, setLeaveToDate] = useState("");
  const [leaveReason, setLeaveReason] = useState("");

  // GPF fields
  const [gpfAmount, setGpfAmount] = useState("");
  const [gpfPurpose, setGpfPurpose] = useState("");

  // Transfer fields
  const [currentPlace, setCurrentPlace] = useState("");
  const [requestedPlace, setRequestedPlace] = useState("");
  const [transferReason, setTransferReason] = useState("");

  // Medical fields
  const [medicalAmount, setMedicalAmount] = useState("");
  const [hospitalName, setHospitalName] = useState("");
  const [treatmentFor, setTreatmentFor] = useState("");

  // General fields
  const [generalSubject, setGeneralSubject] = useState("");
  const [generalContent, setGeneralContent] = useState("");

  const filteredTemplates = letterTemplates.filter((t) => t.category === selectedCategory);

  // Calculate leave days
  const leaveDays =
    leaveFromDate && leaveToDate
      ? Math.ceil(
          (new Date(leaveToDate).getTime() - new Date(leaveFromDate).getTime()) / (1000 * 60 * 60 * 24)
        ) + 1
      : 0;

  // Generate letter content based on template
  const getLetterContent = () => {
    switch (selectedCategory) {
      case "leave":
        return generateLeaveContent(
          selectedTemplate,
          leaveFromDate ? formatTamilDate(new Date(leaveFromDate)) : "____",
          leaveToDate ? formatTamilDate(new Date(leaveToDate)) : "____",
          leaveReason || "____________________",
          leaveDays
        );
      case "gpf":
        return generateGPFContent(
          selectedTemplate,
          gpfAmount || "____",
          gpfPurpose || "____________________"
        );
      case "transfer":
        return generateTransferContent(
          selectedTemplate,
          currentPlace || "____",
          requestedPlace || "____",
          transferReason || "____________________"
        );
      case "medical":
        return generateMedicalContent(
          medicalAmount || "____",
          hospitalName || "____",
          treatmentFor || "____________________"
        );
      case "general":
        return generateGeneralContent(
          generalSubject || "கோரிக்கை",
          generalContent || "____________________"
        );
      default:
        return { subject: "", body: "" };
    }
  };

  const letterContent = getLetterContent();
  const today = formatTamilDate(new Date());

  const handlePrint = () => {
    window.print();
  };

  const handleCopy = async () => {
    if (letterRef.current) {
      const text = letterRef.current.innerText;
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 print:hidden">
        <div className="flex items-center gap-4">
          <Link href="/" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-tn-text flex items-center gap-2">
              <FileText className="text-indigo-600" size={28} />
              Letter Drafts
            </h1>
            <p className="text-sm text-gray-500 tamil">கடித வரைவுகள்</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleCopy}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm"
          >
            {copied ? <Check size={16} className="text-green-600" /> : <Copy size={16} />}
            {copied ? "Copied!" : "Copy"}
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm"
          >
            <Printer size={16} />
            Print
          </button>
        </div>
      </div>

      {/* Info Banner */}
      <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4 mb-6 print:hidden">
        <p className="text-sm text-indigo-800">
          <strong>How to use:</strong> Select letter type, fill in details, and the Tamil letter will be generated automatically.
          You can print or copy the letter. Font used: <strong>Noto Sans Tamil</strong> (Unicode compliant).
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Left - Form */}
        <div className="space-y-6 print:hidden">
          {/* Category Selection */}
          <div className="bg-white rounded-xl shadow-sm border p-4">
            <h2 className="font-semibold text-tn-text mb-3 flex items-center gap-2">
              <ClipboardList size={18} />
              Select Category
            </h2>
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => {
                const Icon = cat.icon;
                return (
                  <button
                    key={cat.id}
                    onClick={() => {
                      setSelectedCategory(cat.id);
                      setSelectedTemplate(letterTemplates.find((t) => t.category === cat.id)?.id || "");
                    }}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      selectedCategory === cat.id
                        ? "bg-indigo-500 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    <Icon size={16} />
                    {cat.name}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Template Selection */}
          <div className="bg-white rounded-xl shadow-sm border p-4">
            <h2 className="font-semibold text-tn-text mb-3">Select Letter Type</h2>
            <div className="grid grid-cols-2 gap-2">
              {filteredTemplates.map((template) => (
                <button
                  key={template.id}
                  onClick={() => setSelectedTemplate(template.id)}
                  className={`p-3 rounded-lg text-left transition-colors ${
                    selectedTemplate === template.id
                      ? "bg-indigo-100 border-2 border-indigo-500"
                      : "bg-gray-50 border-2 border-transparent hover:bg-gray-100"
                  }`}
                >
                  <p className="font-medium text-sm">{template.name}</p>
                  <p className="text-xs text-gray-500 tamil">{template.nameTamil}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Common Details */}
          <div className="bg-white rounded-xl shadow-sm border p-4">
            <h2 className="font-semibold text-tn-text mb-3 flex items-center gap-2">
              <User size={18} />
              Your Details
            </h2>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Your Name / உங்கள் பெயர்</label>
                <input
                  type="text"
                  value={senderName}
                  onChange={(e) => setSenderName(e.target.value)}
                  placeholder="திரு. முருகன்"
                  className="w-full border rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Designation / பதவி</label>
                <input
                  type="text"
                  value={senderDesignation}
                  onChange={(e) => setSenderDesignation(e.target.value)}
                  placeholder="பட்டதாரி ஆசிரியர்"
                  className="w-full border rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Office/School / அலுவலகம்</label>
                <input
                  type="text"
                  value={senderOffice}
                  onChange={(e) => setSenderOffice(e.target.value)}
                  placeholder="அரசு மேல்நிலைப்பள்ளி, சென்னை"
                  className="w-full border rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Place / இடம்</label>
                <input
                  type="text"
                  value={senderPlace}
                  onChange={(e) => setSenderPlace(e.target.value)}
                  placeholder="சென்னை"
                  className="w-full border rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
          </div>

          {/* Recipient Details */}
          <div className="bg-white rounded-xl shadow-sm border p-4">
            <h2 className="font-semibold text-tn-text mb-3 flex items-center gap-2">
              <Building size={18} />
              Recipient Details
            </h2>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Designation / பதவி</label>
                <input
                  type="text"
                  value={recipientDesignation}
                  onChange={(e) => setRecipientDesignation(e.target.value)}
                  placeholder="தலைமை ஆசிரியர்"
                  className="w-full border rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Office / அலுவலகம்</label>
                <input
                  type="text"
                  value={recipientOffice}
                  onChange={(e) => setRecipientOffice(e.target.value)}
                  placeholder="அரசு மேல்நிலைப்பள்ளி, சென்னை"
                  className="w-full border rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
          </div>

          {/* Category-specific fields */}
          {selectedCategory === "leave" && (
            <div className="bg-white rounded-xl shadow-sm border p-4">
              <h2 className="font-semibold text-tn-text mb-3 flex items-center gap-2">
                <Calendar size={18} />
                Leave Details
              </h2>
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">From Date</label>
                    <input
                      type="date"
                      value={leaveFromDate}
                      onChange={(e) => setLeaveFromDate(e.target.value)}
                      className="w-full border rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">To Date</label>
                    <input
                      type="date"
                      value={leaveToDate}
                      onChange={(e) => setLeaveToDate(e.target.value)}
                      className="w-full border rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>
                {leaveDays > 0 && (
                  <p className="text-sm text-indigo-600 font-medium">Total: {leaveDays} days</p>
                )}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Reason / காரணம்</label>
                  <textarea
                    value={leaveReason}
                    onChange={(e) => setLeaveReason(e.target.value)}
                    placeholder="சொந்த வேலை காரணமாக..."
                    rows={2}
                    className="w-full border rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>
            </div>
          )}

          {selectedCategory === "gpf" && (
            <div className="bg-white rounded-xl shadow-sm border p-4">
              <h2 className="font-semibold text-tn-text mb-3 flex items-center gap-2">
                <Wallet size={18} />
                GPF Details
              </h2>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Amount (₹) / தொகை</label>
                  <input
                    type="number"
                    value={gpfAmount}
                    onChange={(e) => setGpfAmount(e.target.value)}
                    placeholder="100000"
                    className="w-full border rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Purpose / நோக்கம்</label>
                  <textarea
                    value={gpfPurpose}
                    onChange={(e) => setGpfPurpose(e.target.value)}
                    placeholder="வீடு கட்டுவதற்காக..."
                    rows={2}
                    className="w-full border rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>
            </div>
          )}

          {selectedCategory === "transfer" && (
            <div className="bg-white rounded-xl shadow-sm border p-4">
              <h2 className="font-semibold text-tn-text mb-3 flex items-center gap-2">
                <Plane size={18} />
                Transfer Details
              </h2>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Current Place / தற்போதைய இடம்</label>
                  <input
                    type="text"
                    value={currentPlace}
                    onChange={(e) => setCurrentPlace(e.target.value)}
                    placeholder="சென்னை"
                    className="w-full border rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Requested Place / கோரும் இடம்</label>
                  <input
                    type="text"
                    value={requestedPlace}
                    onChange={(e) => setRequestedPlace(e.target.value)}
                    placeholder="மதுரை"
                    className="w-full border rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Reason / காரணம்</label>
                  <textarea
                    value={transferReason}
                    onChange={(e) => setTransferReason(e.target.value)}
                    placeholder="பெற்றோர் நலம் பேணுவதற்காக..."
                    rows={2}
                    className="w-full border rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>
            </div>
          )}

          {selectedCategory === "medical" && (
            <div className="bg-white rounded-xl shadow-sm border p-4">
              <h2 className="font-semibold text-tn-text mb-3 flex items-center gap-2">
                <Heart size={18} />
                Medical Details
              </h2>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Amount (₹) / தொகை</label>
                  <input
                    type="number"
                    value={medicalAmount}
                    onChange={(e) => setMedicalAmount(e.target.value)}
                    placeholder="50000"
                    className="w-full border rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Hospital Name / மருத்துவமனை</label>
                  <input
                    type="text"
                    value={hospitalName}
                    onChange={(e) => setHospitalName(e.target.value)}
                    placeholder="அரசு பொது மருத்துவமனை"
                    className="w-full border rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Treatment For / சிகிச்சை</label>
                  <input
                    type="text"
                    value={treatmentFor}
                    onChange={(e) => setTreatmentFor(e.target.value)}
                    placeholder="கண் அறுவை சிகிச்சை"
                    className="w-full border rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>
            </div>
          )}

          {selectedCategory === "general" && (
            <div className="bg-white rounded-xl shadow-sm border p-4">
              <h2 className="font-semibold text-tn-text mb-3 flex items-center gap-2">
                <Mail size={18} />
                Letter Content
              </h2>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Subject / பொருள்</label>
                  <input
                    type="text"
                    value={generalSubject}
                    onChange={(e) => setGeneralSubject(e.target.value)}
                    placeholder="சான்றிதழ் கோரிக்கை"
                    className="w-full border rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Content / உள்ளடக்கம்</label>
                  <textarea
                    value={generalContent}
                    onChange={(e) => setGeneralContent(e.target.value)}
                    placeholder="உங்கள் கடிதத்தின் உள்ளடக்கத்தை இங்கே எழுதவும்..."
                    rows={5}
                    className="w-full border rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right - Letter Preview */}
        <div className="lg:sticky lg:top-4 lg:self-start">
          <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
            <div className="bg-indigo-50 p-3 border-b print:hidden">
              <h2 className="font-semibold text-indigo-800">Letter Preview / கடித முன்னோட்டம்</h2>
            </div>

            {/* Letter Content */}
            <div
              ref={letterRef}
              className="p-8 min-h-[600px] font-tamil leading-relaxed"
              style={{ fontFamily: "'Noto Sans Tamil', 'Tamil Sangam MN', sans-serif" }}
            >
              {/* Header - Place & Date */}
              <div className="text-right mb-6">
                <p>{senderPlace || "________________"}</p>
                <p>தேதி: {today}</p>
              </div>

              {/* Sender */}
              <div className="mb-4">
                <p className="font-semibold">அனுப்புநர்:</p>
                <p>{senderName || "________________"}</p>
                <p>{senderDesignation || "________________"}</p>
                <p>{senderOffice || "________________"}</p>
              </div>

              {/* Recipient */}
              <div className="mb-4">
                <p className="font-semibold">பெறுநர்:</p>
                <p>{recipientDesignation || "________________"}</p>
                <p>{recipientOffice || "________________"}</p>
              </div>

              {/* Subject */}
              <div className="mb-4">
                <p>
                  <span className="font-semibold">பொருள்: </span>
                  {letterContent.subject}
                </p>
              </div>

              {/* Salutation */}
              <div className="mb-4">
                <p className="font-semibold">மதிப்புற்குரிய ஐயா/அம்மா,</p>
              </div>

              {/* Body */}
              <div className="mb-6 text-justify whitespace-pre-line">
                {letterContent.body}
              </div>

              {/* Closing */}
              <div className="mt-8">
                <p>இப்படிக்கு,</p>
                <p className="mt-1">தங்கள் பணிவுள்ள,</p>
                <div className="mt-8">
                  <p className="border-t border-gray-400 pt-1 w-48">கையொப்பம்</p>
                  <p className="mt-2">{senderName || "________________"}</p>
                  <p>{senderDesignation || "________________"}</p>
                </div>
              </div>

              {/* Enclosures hint */}
              {(selectedCategory === "medical" || selectedCategory === "gpf") && (
                <div className="mt-8 pt-4 border-t border-dashed border-gray-300">
                  <p className="text-sm text-gray-600">
                    <span className="font-semibold">இணைப்புகள்:</span>
                    {selectedCategory === "medical" && " மருத்துவ பில்கள், மருத்துவர் சான்றிதழ்"}
                    {selectedCategory === "gpf" && " GPF அறிக்கை, அடையாள ஆவணங்கள்"}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Tips */}
          <div className="mt-4 bg-amber-50 rounded-xl p-4 print:hidden">
            <h3 className="font-semibold text-amber-800 mb-2">Tips</h3>
            <ul className="text-sm text-amber-700 space-y-1">
              <li>• Fill all details for a complete letter</li>
              <li>• Use Print button to get a clean printout</li>
              <li>• Copy button copies the text to clipboard</li>
              <li>• Letter follows TN Government standard format</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Print Styles */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+Tamil:wght@400;500;600;700&display=swap');

        .font-tamil {
          font-family: 'Noto Sans Tamil', 'Tamil Sangam MN', sans-serif;
        }

        @media print {
          body * {
            visibility: hidden;
          }

          #letter-content, #letter-content * {
            visibility: visible;
          }

          #letter-content {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            padding: 2cm;
          }

          .print\\:hidden {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}
