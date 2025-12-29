"use client";

import { useState, useRef, useCallback } from "react";
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
  Sparkles,
  CheckCircle,
  XCircle,
  ChevronDown,
  ChevronRight,
  Menu,
  X,
  Settings,
} from "lucide-react";
import {
  validateTamilText,
  ValidationResult,
  getErrorTypeLabel,
} from "@/lib/tamil-validator";

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
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Expanded sections
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(["category", "template", "sender", "recipient", "details"])
  );

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

  // Spell check state
  const [spellCheckResult, setSpellCheckResult] = useState<ValidationResult | null>(null);
  const [showSpellCheck, setShowSpellCheck] = useState(false);

  const filteredTemplates = letterTemplates.filter((t) => t.category === selectedCategory);

  // Calculate leave days
  const leaveDays =
    leaveFromDate && leaveToDate
      ? Math.ceil(
          (new Date(leaveToDate).getTime() - new Date(leaveFromDate).getTime()) / (1000 * 60 * 60 * 24)
        ) + 1
      : 0;

  // Toggle section
  const toggleSection = (section: string) => {
    setExpandedSections((prev) => {
      const next = new Set(prev);
      if (next.has(section)) {
        next.delete(section);
      } else {
        next.add(section);
      }
      return next;
    });
  };

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

  // Spell check handler
  const handleSpellCheck = useCallback(() => {
    const textToCheck = [
      senderName,
      senderDesignation,
      senderOffice,
      senderPlace,
      recipientDesignation,
      recipientOffice,
      leaveReason,
      gpfPurpose,
      currentPlace,
      requestedPlace,
      transferReason,
      hospitalName,
      treatmentFor,
      generalSubject,
      generalContent,
      letterContent.subject,
      letterContent.body,
    ].filter(Boolean).join(" ");

    const result = validateTamilText(textToCheck);
    setSpellCheckResult(result);
    setShowSpellCheck(true);
  }, [
    senderName, senderDesignation, senderOffice, senderPlace,
    recipientDesignation, recipientOffice, leaveReason, gpfPurpose,
    currentPlace, requestedPlace, transferReason, hospitalName,
    treatmentFor, generalSubject, generalContent, letterContent,
  ]);

  // Section header component
  const SectionHeader = ({ id, icon: Icon, title, titleTamil }: { id: string; icon: typeof User; title: string; titleTamil?: string }) => (
    <button
      onClick={() => toggleSection(id)}
      className="w-full flex items-center justify-between px-3 py-2 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors"
    >
      <div className="flex items-center gap-2">
        <Icon size={16} className="text-indigo-600" />
        <span className="font-medium text-sm text-indigo-900">{title}</span>
        {titleTamil && <span className="text-xs text-indigo-500 tamil hidden sm:inline">({titleTamil})</span>}
      </div>
      {expandedSections.has(id) ? (
        <ChevronDown size={16} className="text-indigo-400" />
      ) : (
        <ChevronRight size={16} className="text-indigo-400" />
      )}
    </button>
  );

  return (
    <div className="flex min-h-screen">
      {/* Mobile Menu Button */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="lg:hidden fixed bottom-4 left-4 z-50 bg-indigo-600 text-white p-3 rounded-full shadow-lg print:hidden"
      >
        {sidebarOpen ? <X size={24} /> : <Settings size={24} />}
      </button>

      {/* Sidebar Form */}
      <aside
        className={`
          fixed lg:sticky top-0 left-0 z-40 h-screen lg:h-auto
          w-80 bg-gradient-to-b from-indigo-50 to-purple-50 border-r border-indigo-100 overflow-y-auto
          transform transition-transform duration-300 ease-in-out print:hidden
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        <div className="p-4 space-y-3">
          {/* Sidebar Header */}
          <div className="flex items-center gap-3 mb-4">
            <Link href="/" className="p-2 hover:bg-white/50 rounded-lg transition-colors">
              <ArrowLeft size={18} />
            </Link>
            <div>
              <h1 className="font-bold text-indigo-900 flex items-center gap-2">
                <FileText className="text-indigo-600" size={20} />
                Letter Drafts
              </h1>
              <p className="text-xs text-indigo-500 tamil">கடித வரைவுகள்</p>
            </div>
          </div>

          {/* Category Selection */}
          <div>
            <SectionHeader id="category" icon={ClipboardList} title="Category" titleTamil="வகை" />
            {expandedSections.has("category") && (
              <div className="mt-2 flex flex-wrap gap-1.5 px-1">
                {categories.map((cat) => {
                  const Icon = cat.icon;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => {
                        setSelectedCategory(cat.id);
                        setSelectedTemplate(letterTemplates.find((t) => t.category === cat.id)?.id || "");
                      }}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                        selectedCategory === cat.id
                          ? "bg-indigo-500 text-white"
                          : "bg-white text-gray-600 hover:bg-indigo-100 border border-indigo-100"
                      }`}
                    >
                      <Icon size={14} />
                      {cat.name}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Template Selection */}
          <div>
            <SectionHeader id="template" icon={FileText} title="Letter Type" titleTamil="கடித வகை" />
            {expandedSections.has("template") && (
              <div className="mt-2 space-y-1 px-1">
                {filteredTemplates.map((template) => (
                  <button
                    key={template.id}
                    onClick={() => setSelectedTemplate(template.id)}
                    className={`w-full p-2 rounded-lg text-left text-sm transition-colors ${
                      selectedTemplate === template.id
                        ? "bg-indigo-500 text-white"
                        : "bg-white text-gray-700 hover:bg-indigo-50 border border-indigo-100"
                    }`}
                  >
                    <p className="font-medium">{template.name}</p>
                    <p className={`text-xs tamil ${selectedTemplate === template.id ? "text-indigo-100" : "text-gray-400"}`}>
                      {template.nameTamil}
                    </p>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Sender Details */}
          <div>
            <SectionHeader id="sender" icon={User} title="Your Details" titleTamil="உங்கள் விவரங்கள்" />
            {expandedSections.has("sender") && (
              <div className="mt-2 space-y-2 px-1">
                <input
                  type="text"
                  value={senderName}
                  onChange={(e) => setSenderName(e.target.value)}
                  placeholder="பெயர் / Name"
                  className="w-full border border-indigo-100 rounded-lg p-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
                <input
                  type="text"
                  value={senderDesignation}
                  onChange={(e) => setSenderDesignation(e.target.value)}
                  placeholder="பதவி / Designation"
                  className="w-full border border-indigo-100 rounded-lg p-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
                <input
                  type="text"
                  value={senderOffice}
                  onChange={(e) => setSenderOffice(e.target.value)}
                  placeholder="அலுவலகம் / Office"
                  className="w-full border border-indigo-100 rounded-lg p-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
                <input
                  type="text"
                  value={senderPlace}
                  onChange={(e) => setSenderPlace(e.target.value)}
                  placeholder="இடம் / Place"
                  className="w-full border border-indigo-100 rounded-lg p-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>
            )}
          </div>

          {/* Recipient Details */}
          <div>
            <SectionHeader id="recipient" icon={Building} title="Recipient" titleTamil="பெறுநர்" />
            {expandedSections.has("recipient") && (
              <div className="mt-2 space-y-2 px-1">
                <input
                  type="text"
                  value={recipientDesignation}
                  onChange={(e) => setRecipientDesignation(e.target.value)}
                  placeholder="பதவி / Designation"
                  className="w-full border border-indigo-100 rounded-lg p-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
                <input
                  type="text"
                  value={recipientOffice}
                  onChange={(e) => setRecipientOffice(e.target.value)}
                  placeholder="அலுவலகம் / Office"
                  className="w-full border border-indigo-100 rounded-lg p-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>
            )}
          </div>

          {/* Category-specific fields */}
          <div>
            <SectionHeader
              id="details"
              icon={selectedCategory === "leave" ? Calendar : selectedCategory === "gpf" ? Wallet : selectedCategory === "transfer" ? Plane : selectedCategory === "medical" ? Heart : Mail}
              title={
                selectedCategory === "leave" ? "Leave Details" :
                selectedCategory === "gpf" ? "GPF Details" :
                selectedCategory === "transfer" ? "Transfer Details" :
                selectedCategory === "medical" ? "Medical Details" : "Letter Content"
              }
              titleTamil={
                selectedCategory === "leave" ? "விடுப்பு விவரங்கள்" :
                selectedCategory === "gpf" ? "GPF விவரங்கள்" :
                selectedCategory === "transfer" ? "இடமாற்ற விவரங்கள்" :
                selectedCategory === "medical" ? "மருத்துவ விவரங்கள்" : "உள்ளடக்கம்"
              }
            />
            {expandedSections.has("details") && (
              <div className="mt-2 space-y-2 px-1">
                {selectedCategory === "leave" && (
                  <>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">From Date</label>
                        <input
                          type="date"
                          value={leaveFromDate}
                          onChange={(e) => setLeaveFromDate(e.target.value)}
                          className="w-full border border-indigo-100 rounded-lg p-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">To Date</label>
                        <input
                          type="date"
                          value={leaveToDate}
                          onChange={(e) => setLeaveToDate(e.target.value)}
                          className="w-full border border-indigo-100 rounded-lg p-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                        />
                      </div>
                    </div>
                    {leaveDays > 0 && (
                      <p className="text-xs text-indigo-600 font-medium px-1">Total: {leaveDays} days</p>
                    )}
                    <textarea
                      value={leaveReason}
                      onChange={(e) => setLeaveReason(e.target.value)}
                      placeholder="காரணம் / Reason"
                      rows={2}
                      className="w-full border border-indigo-100 rounded-lg p-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                  </>
                )}

                {selectedCategory === "gpf" && (
                  <>
                    <input
                      type="number"
                      value={gpfAmount}
                      onChange={(e) => setGpfAmount(e.target.value)}
                      placeholder="தொகை (₹) / Amount"
                      className="w-full border border-indigo-100 rounded-lg p-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                    <textarea
                      value={gpfPurpose}
                      onChange={(e) => setGpfPurpose(e.target.value)}
                      placeholder="நோக்கம் / Purpose"
                      rows={2}
                      className="w-full border border-indigo-100 rounded-lg p-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                  </>
                )}

                {selectedCategory === "transfer" && (
                  <>
                    <input
                      type="text"
                      value={currentPlace}
                      onChange={(e) => setCurrentPlace(e.target.value)}
                      placeholder="தற்போதைய இடம் / Current Place"
                      className="w-full border border-indigo-100 rounded-lg p-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                    <input
                      type="text"
                      value={requestedPlace}
                      onChange={(e) => setRequestedPlace(e.target.value)}
                      placeholder="கோரும் இடம் / Requested Place"
                      className="w-full border border-indigo-100 rounded-lg p-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                    <textarea
                      value={transferReason}
                      onChange={(e) => setTransferReason(e.target.value)}
                      placeholder="காரணம் / Reason"
                      rows={2}
                      className="w-full border border-indigo-100 rounded-lg p-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                  </>
                )}

                {selectedCategory === "medical" && (
                  <>
                    <input
                      type="number"
                      value={medicalAmount}
                      onChange={(e) => setMedicalAmount(e.target.value)}
                      placeholder="தொகை (₹) / Amount"
                      className="w-full border border-indigo-100 rounded-lg p-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                    <input
                      type="text"
                      value={hospitalName}
                      onChange={(e) => setHospitalName(e.target.value)}
                      placeholder="மருத்துவமனை / Hospital"
                      className="w-full border border-indigo-100 rounded-lg p-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                    <input
                      type="text"
                      value={treatmentFor}
                      onChange={(e) => setTreatmentFor(e.target.value)}
                      placeholder="சிகிச்சை / Treatment For"
                      className="w-full border border-indigo-100 rounded-lg p-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                  </>
                )}

                {selectedCategory === "general" && (
                  <>
                    <input
                      type="text"
                      value={generalSubject}
                      onChange={(e) => setGeneralSubject(e.target.value)}
                      placeholder="பொருள் / Subject"
                      className="w-full border border-indigo-100 rounded-lg p-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                    <textarea
                      value={generalContent}
                      onChange={(e) => setGeneralContent(e.target.value)}
                      placeholder="உள்ளடக்கம் / Content"
                      rows={4}
                      className="w-full border border-indigo-100 rounded-lg p-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                  </>
                )}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="pt-2 space-y-2">
            <button
              onClick={handleSpellCheck}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-purple-100 hover:bg-purple-200 text-purple-700 rounded-lg text-sm font-medium transition-colors"
            >
              <Sparkles size={16} />
              Check Tamil Spelling
            </button>
            <div className="flex gap-2">
              <button
                onClick={handleCopy}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium transition-colors"
              >
                {copied ? <Check size={16} className="text-green-600" /> : <Copy size={16} />}
                {copied ? "Copied!" : "Copy"}
              </button>
              <button
                onClick={handlePrint}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-colors"
              >
                <Printer size={16} />
                Print
              </button>
            </div>
          </div>

          {/* Tips */}
          <div className="mt-4 bg-amber-50 rounded-lg p-3 border border-amber-100">
            <h3 className="font-medium text-amber-800 text-sm mb-1">Tips</h3>
            <ul className="text-xs text-amber-700 space-y-0.5">
              <li>• Fill all details for a complete letter</li>
              <li>• Letter follows TN Government standard format</li>
              <li>• Font: Noto Sans Tamil (Unicode compliant)</li>
            </ul>
          </div>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden print:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content - Letter Preview */}
      <main className="flex-1 min-w-0 bg-gray-100 print:bg-white">
        {/* Spell Check Results Panel */}
        {showSpellCheck && spellCheckResult && (
          <div className="m-4 bg-white rounded-xl shadow-sm border overflow-hidden print:hidden">
            <div className="flex items-center justify-between p-3 bg-purple-50 border-b">
              <div className="flex items-center gap-2">
                <Sparkles size={18} className="text-purple-600" />
                <h3 className="font-semibold text-purple-800">Tamil Spell Check</h3>
                {spellCheckResult.isValid ? (
                  <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-xs flex items-center gap-1">
                    <CheckCircle size={12} />
                    No errors
                  </span>
                ) : (
                  <span className="px-2 py-0.5 bg-red-100 text-red-700 rounded-full text-xs flex items-center gap-1">
                    <AlertCircle size={12} />
                    {spellCheckResult.stats.totalErrors} issue(s)
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <Link
                  href="/tools/tamil-spell-checker"
                  className="text-xs text-purple-600 hover:underline"
                >
                  Open Full Checker →
                </Link>
                <button
                  onClick={() => setShowSpellCheck(false)}
                  className="p-1 hover:bg-purple-100 rounded"
                >
                  <XCircle size={18} className="text-purple-400" />
                </button>
              </div>
            </div>

            {spellCheckResult.errors.length > 0 ? (
              <div className="p-3 max-h-36 overflow-y-auto">
                <div className="flex flex-wrap gap-2">
                  {spellCheckResult.errors.map((error, index) => (
                    <div
                      key={index}
                      className={`px-2 py-1 rounded-lg text-xs border ${
                        error.severity === "error"
                          ? "bg-red-50 border-red-200"
                          : error.severity === "warning"
                          ? "bg-yellow-50 border-yellow-200"
                          : "bg-blue-50 border-blue-200"
                      }`}
                    >
                      <span className="font-medium">&quot;{error.original}&quot;</span>
                      <span className="text-gray-400 mx-1">→</span>
                      <span className="font-medium text-green-700">&quot;{error.suggestion}&quot;</span>
                      <span className="text-gray-400 ml-1">({getErrorTypeLabel(error.type).tamil})</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="p-4 text-center text-green-600">
                <CheckCircle size={24} className="mx-auto mb-1" />
                <p className="text-sm">உங்கள் உரை சரியாக உள்ளது!</p>
              </div>
            )}
          </div>
        )}

        {/* Letter Preview */}
        <div className="p-4 lg:p-8">
          <div className="max-w-3xl mx-auto">
            {/* Preview Header */}
            <div className="flex items-center justify-between mb-4 print:hidden">
              <h2 className="font-semibold text-gray-700 flex items-center gap-2">
                <FileText size={18} className="text-indigo-600" />
                Letter Preview
                <span className="text-xs text-gray-400 tamil">/ கடித முன்னோட்டம்</span>
              </h2>
              <div className="lg:hidden flex gap-2">
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg text-xs"
                >
                  {copied ? <Check size={14} className="text-green-600" /> : <Copy size={14} />}
                  {copied ? "Copied!" : "Copy"}
                </button>
                <button
                  onClick={handlePrint}
                  className="flex items-center gap-1 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs"
                >
                  <Printer size={14} />
                  Print
                </button>
              </div>
            </div>

            {/* Letter Content */}
            <div className="bg-white rounded-xl shadow-lg border overflow-hidden print:shadow-none print:border-none print:rounded-none">
              <div
                ref={letterRef}
                id="letter-content"
                className="p-8 lg:p-12 min-h-[700px] font-tamil leading-relaxed"
                style={{ fontFamily: "'Noto Sans Tamil', 'Tamil Sangam MN', sans-serif" }}
              >
                {/* Header - Place & Date */}
                <div className="text-right mb-8">
                  <p className="text-lg">{senderPlace || "________________"}</p>
                  <p>தேதி: {today}</p>
                </div>

                {/* Sender */}
                <div className="mb-6">
                  <p className="font-semibold text-lg mb-1">அனுப்புநர்:</p>
                  <p>{senderName || "________________"}</p>
                  <p>{senderDesignation || "________________"}</p>
                  <p>{senderOffice || "________________"}</p>
                </div>

                {/* Recipient */}
                <div className="mb-6">
                  <p className="font-semibold text-lg mb-1">பெறுநர்:</p>
                  <p>{recipientDesignation || "________________"}</p>
                  <p>{recipientOffice || "________________"}</p>
                </div>

                {/* Subject */}
                <div className="mb-6">
                  <p>
                    <span className="font-semibold">பொருள்: </span>
                    {letterContent.subject}
                  </p>
                </div>

                {/* Salutation */}
                <div className="mb-6">
                  <p className="font-semibold">மதிப்புற்குரிய ஐயா/அம்மா,</p>
                </div>

                {/* Body */}
                <div className="mb-8 text-justify whitespace-pre-line leading-loose">
                  {letterContent.body}
                </div>

                {/* Closing */}
                <div className="mt-12">
                  <p>இப்படிக்கு,</p>
                  <p className="mt-1">தங்கள் பணிவுள்ள,</p>
                  <div className="mt-12">
                    <p className="border-t border-gray-400 pt-2 w-48">கையொப்பம்</p>
                    <p className="mt-3">{senderName || "________________"}</p>
                    <p>{senderDesignation || "________________"}</p>
                  </div>
                </div>

                {/* Enclosures hint */}
                {(selectedCategory === "medical" || selectedCategory === "gpf") && (
                  <div className="mt-12 pt-4 border-t border-dashed border-gray-300">
                    <p className="text-sm text-gray-600">
                      <span className="font-semibold">இணைப்புகள்:</span>
                      {selectedCategory === "medical" && " மருத்துவ பில்கள், மருத்துவர் சான்றிதழ்"}
                      {selectedCategory === "gpf" && " GPF அறிக்கை, அடையாள ஆவணங்கள்"}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

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
