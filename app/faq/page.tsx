"use client";

import Link from "next/link";
import { ArrowLeft, HelpCircle, ChevronDown, ChevronUp, Search, ArrowRight } from "lucide-react";
import { useState } from "react";
import PageContainer from "@/components/ui/page-container";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { getFaqCardCategory, getFaqCategoryIcon } from "@/lib/faq-categories";

interface FAQ {
  id: string;
  question: string;
  questionTamil: string;
  answer: string;
  category: string;
}

const faqs: FAQ[] = [
  // Salary & DA
  {
    id: "da-revision",
    question: "When is the next DA revision expected?",
    questionTamil: "அடுத்த அகவிலைப்படி திருத்தம் எப்போது?",
    answer: "DA is typically revised twice a year - in January and July. The Tamil Nadu government announces DA hikes through Government Orders (G.O.) after the Central Government announces its DA revision. The current DA rate is 55% effective from January 2025.",
    category: "Salary & DA",
  },
  {
    id: "da-calculation",
    question: "How is DA calculated?",
    questionTamil: "அகவிலைப்படி எவ்வாறு கணக்கிடப்படுகிறது?",
    answer: "DA (Dearness Allowance) is calculated as a percentage of your Basic Pay. Formula: DA Amount = Basic Pay × DA Rate / 100. For example, if your Basic Pay is ₹36,900 and DA rate is 55%, your DA = ₹36,900 × 55% = ₹20,295 per month.",
    category: "Salary & DA",
  },
  {
    id: "hra-rates",
    question: "What are the HRA rates for different cities?",
    questionTamil: "வெவ்வேறு நகரங்களுக்கான HRA விகிதங்கள் என்ன?",
    answer: "HRA rates in Tamil Nadu: X cities (Chennai/Metro) - 24% of Basic Pay, Y cities (District HQ) - 16% of Basic Pay, Z cities (Other areas) - 8% of Basic Pay. CCA (City Compensatory Allowance) is ₹600 for Chennai and ₹300 for District HQs.",
    category: "Salary & DA",
  },
  // Leave
  {
    id: "cl-eligibility",
    question: "How many Casual Leaves am I entitled to?",
    questionTamil: "எனக்கு எத்தனை தற்காலிக விடுப்புகள் கிடைக்கும்?",
    answer: "Government employees are entitled to 12 Casual Leaves (CL) per calendar year. CL cannot be accumulated and lapses if not used within the year. Maximum 8 CLs can be taken at a time. CL is not a right and can be refused.",
    category: "Leave",
  },
  {
    id: "el-accumulation",
    question: "What is the maximum Earned Leave I can accumulate?",
    questionTamil: "நான் சேர்க்கக்கூடிய அதிகபட்ச ஈட்டிய விடுப்பு என்ன?",
    answer: "You can accumulate a maximum of 300 days of Earned Leave (EL). EL is credited at the rate of 15 days for every 6 months of service. At retirement, EL up to 300 days can be encashed.",
    category: "Leave",
  },
  {
    id: "maternity-leave",
    question: "What is the maternity leave entitlement?",
    questionTamil: "மகப்பேறு விடுப்பு உரிமை என்ன?",
    answer: "Female employees are entitled to 180 days (6 months) of Maternity Leave with full pay for up to 2 surviving children. Additional 60 days without pay can be taken. Male employees get 15 days Paternity Leave.",
    category: "Leave",
  },
  // GPF & Pension
  {
    id: "gpf-minimum",
    question: "What is the minimum GPF contribution?",
    questionTamil: "குறைந்தபட்ச GPF பங்களிப்பு என்ன?",
    answer: "The minimum GPF contribution is 6% of Basic Pay. You can contribute up to 100% of your Basic Pay. The government provides interest on GPF at the rate announced annually (currently 7.1%).",
    category: "GPF & Pension",
  },
  {
    id: "gpf-advance",
    question: "Can I take an advance from my GPF account?",
    questionTamil: "GPF கணக்கிலிருந்து முன்பணம் பெற முடியுமா?",
    answer: "Yes, you can take refundable and non-refundable advances from GPF for specified purposes like education, medical treatment, house construction, marriage, etc. Maximum advance depends on the purpose and your GPF balance.",
    category: "GPF & Pension",
  },
  {
    id: "pension-eligibility",
    question: "What is the minimum service required for pension?",
    questionTamil: "ஓய்வூதியத்திற்கு தேவையான குறைந்தபட்ச சேவை என்ன?",
    answer: "Minimum 10 years of qualifying service is required for pension eligibility. For full pension (50% of last drawn Basic Pay), you need 33 years of qualifying service. Proportionate pension is given for service between 10-33 years.",
    category: "GPF & Pension",
  },
  {
    id: "commutation",
    question: "How much pension can I commute?",
    questionTamil: "நான் எவ்வளவு ஓய்வூதியத்தை மாற்றலாம்?",
    answer: "You can commute up to 40% of your basic pension to receive a lump sum amount. The commuted value depends on your age at retirement. After commutation, your monthly pension will be reduced proportionately for 15 years.",
    category: "GPF & Pension",
  },
  // Transfer
  {
    id: "transfer-request",
    question: "How can I apply for transfer?",
    questionTamil: "இடமாற்றத்திற்கு எவ்வாறு விண்ணப்பிப்பது?",
    answer: "Transfer requests are submitted during the annual transfer counseling period. You need to apply through the EMIS portal with preferences. Transfers are based on seniority, vacancy, and the department's transfer policy guidelines.",
    category: "Transfer",
  },
  {
    id: "spouse-station",
    question: "Can I get posting with my spouse?",
    questionTamil: "என் துணையுடன் பணியிடம் பெற முடியுமா?",
    answer: "Yes, government employees can request spouse station posting. Both spouses should be government employees. Application should be submitted during counseling with marriage certificate and spouse's posting order.",
    category: "Transfer",
  },
  // Exams
  {
    id: "tet-validity",
    question: "What is the validity of TET certificate?",
    questionTamil: "TET சான்றிதழின் செல்லுபடியாகும் காலம் என்ன?",
    answer: "TN TET certificate is valid for lifetime for recruitment purposes. However, this is subject to government policies and candidates should check the latest notifications during recruitment.",
    category: "Exams",
  },
  {
    id: "trb-age-limit",
    question: "What is the age limit for TRB recruitment?",
    questionTamil: "TRB ஆட்சேர்ப்புக்கான வயது வரம்பு என்ன?",
    answer: "General category: 18-57 years. SC/ST/MBC/BC: 18-62 years. Age relaxation is provided as per government norms. The age is calculated as on the date specified in the notification.",
    category: "Exams",
  },
  // Service
  {
    id: "increment-date",
    question: "When do I get my annual increment?",
    questionTamil: "எனது வருடாந்திர ஊதிய உயர்வு எப்போது?",
    answer: "Annual increment is given on July 1st every year if you have completed at least 6 months of service by June 30th. The increment is 3% of Basic Pay rounded off to the nearest ₹100.",
    category: "Service",
  },
  {
    id: "promotion-eligibility",
    question: "What is the minimum service for promotion?",
    questionTamil: "பதவி உயர்வுக்கு குறைந்தபட்ச சேவை என்ன?",
    answer: "Promotion eligibility varies by cadre. Generally, 5-8 years of service in the current post is required. Promotion is based on seniority-cum-merit and vacancy availability. Departmental exams may be required for some posts.",
    category: "Service",
  },
];

const categories = [
  "All",
  "Salary & DA",
  "Leave",
  "GPF & Pension",
  "Transfer",
  "Exams",
  "Service",
];

export default function FAQPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filteredFaqs = faqs.filter((faq) => {
    const matchesSearch =
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.questionTamil.includes(searchQuery) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All" || faq.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const groupedFaqs = filteredFaqs.reduce((acc, faq) => {
    if (!acc[faq.category]) acc[faq.category] = [];
    acc[faq.category].push(faq);
    return acc;
  }, {} as Record<string, FAQ[]>);

  return (
    <PageContainer padding="lg">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link
          href="/"
          className="p-2 hover:bg-emerald-100 rounded-lg transition-colors"
        >
          <ArrowLeft size={20} className="text-tn-primary" />
        </Link>
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-tn-text flex items-center gap-3">
            <HelpCircle className="text-tn-primary" size={32} />
            Frequently Asked Questions
          </h1>
          <p className="text-sm text-gray-500 tamil">அடிக்கடி கேட்கப்படும் கேள்விகள்</p>
        </div>
      </div>

      {/* Search */}
      <div className="relative mb-8">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
        <input
          type="text"
          placeholder="Search questions..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-tn-primary focus:border-transparent"
        />
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap gap-2 mb-8">
        {categories.map((cat) => (
          <Button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            variant={selectedCategory === cat ? "primary" : "outline"}
            size="md"
          >
            {cat}
          </Button>
        ))}
      </div>

      {/* FAQ List */}
      {Object.keys(groupedFaqs).length === 0 ? (
        <EmptyState
          icon={<HelpCircle size={48} />}
          title="No questions found"
          titleTamil="கேள்விகள் கிடைக்கவில்லை"
          description="Try adjusting your search or category filter"
          descriptionTamil="உங்கள் தேடல் அல்லது வகை வடிப்பு மாற்றிப்பாருங்கள்"
        />
      ) : (
        <div className="space-y-8">
          {Object.entries(groupedFaqs).map(([category, categoryFaqs]) => (
            <div key={category}>
              <h2 className="text-xl font-semibold text-tn-text mb-4 flex items-center gap-3">
                <span className="text-2xl">{getFaqCategoryIcon(category)}</span>
                {category}
                <span className="text-sm font-normal text-gray-500 ml-auto">({categoryFaqs.length})</span>
              </h2>
              <div className="space-y-3">
                {categoryFaqs.map((faq) => (
                  <Card
                    key={faq.id}
                    category={getFaqCardCategory(category)}
                    variant="elevated"
                  >
                    <button
                      onClick={() => setExpandedId(expandedId === faq.id ? null : faq.id)}
                      className="w-full text-left flex items-start justify-between gap-4 group"
                    >
                      <div className="flex-1">
                        <h3 className="font-medium text-tn-text group-hover:text-tn-primary transition-colors">
                          {faq.question}
                        </h3>
                        {faq.questionTamil && (
                          <p className="text-xs text-gray-500 tamil mt-0.5">{faq.questionTamil}</p>
                        )}
                      </div>
                      <div className="flex-shrink-0">
                        {expandedId === faq.id ? (
                          <ChevronUp className="text-tn-primary" size={20} />
                        ) : (
                          <ChevronDown className="text-gray-400 group-hover:text-tn-primary transition-colors" size={20} />
                        )}
                      </div>
                    </button>
                    {expandedId === faq.id && (
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <p className="text-gray-700 text-sm leading-relaxed">{faq.answer}</p>
                      </div>
                    )}
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Still Have Questions */}
      <Card category="reference" className="mt-10">
        <CardHeader
          title="Still have questions?"
          subtitle="Check our Government Orders section for official rules and regulations"
          category="reference"
        />
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <Link href="/go">
              <Button variant="primary" size="md" icon={<ArrowRight size={16} />}>
                Browse GOs
              </Button>
            </Link>
            <Link href="/tools">
              <Button variant="secondary" size="md" icon={<ArrowRight size={16} />}>
                Use Calculators
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </PageContainer>
  );
}
