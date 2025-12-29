/**
 * Centralized rate constants for TN Government employees
 * Update this single file when rates change
 * Last updated: January 2025
 */

// Dearness Allowance (DA) Rate - Revised twice a year (Jan & July)
export const CURRENT_DA_RATE = 55; // 55% as of January 2025
export const DA_EFFECTIVE_DATE = "2025-01-01";

// Dearness Relief (DR) for pensioners - same as DA
export const CURRENT_DR_RATE = 55;

// House Rent Allowance (HRA) Rates by City Category
export const HRA_RATES = {
  X: 24, // Metro cities (Chennai)
  Y: 16, // Other major cities
  Z: 8,  // Other areas
} as const;

// City Compensatory Allowance (CCA)
export const CCA_RATES = {
  chennai: 600,
  other_cities: 300,
  none: 0,
} as const;

// GPF Interest Rate (Financial Year 2024-25)
export const GPF_INTEREST_RATE = 7.1;
export const GPF_INTEREST_EFFECTIVE_FROM = "2024-04-01";

// NPS Contribution Rates
export const NPS_EMPLOYEE_CONTRIBUTION = 10; // 10% of Basic + DA
export const NPS_GOVT_CONTRIBUTION = 14; // 14% of Basic + DA

// TNGIS (Tamil Nadu Government Insurance Scheme)
export const TNGIS_RATES = {
  scheme_A: { premium: 120, coverage: 200000 },
  scheme_B: { premium: 240, coverage: 300000 },
  scheme_C: { premium: 360, coverage: 400000 },
  scheme_D: { premium: 480, coverage: 500000 },
} as const;

// Pension Commutation Factors (Age-based)
export const COMMUTATION_FACTORS: Record<number, number> = {
  40: 9.81, 41: 9.63, 42: 9.45, 43: 9.27, 44: 9.08,
  45: 8.90, 46: 8.72, 47: 8.54, 48: 8.36, 49: 8.18,
  50: 8.00, 51: 7.82, 52: 7.64, 53: 7.46, 54: 7.28,
  55: 8.45, 56: 8.27, 57: 8.10, 58: 7.92, 59: 7.74,
  60: 7.56, 61: 7.38, 62: 7.20, 63: 7.02, 64: 6.85,
  65: 6.67,
};

// Gratuity calculation constants
export const GRATUITY_MULTIPLIER = 16.5; // months for full service
export const MAX_GRATUITY_AMOUNT = 2000000; // Rs. 20 Lakhs

// Leave encashment limits
export const MAX_EL_ENCASHMENT_DAYS = 300;
export const MAX_HPL_ENCASHMENT_DAYS = 180;

// Festival Advance
export const FESTIVAL_ADVANCE_AMOUNT = 8000;
export const FESTIVAL_ADVANCE_RECOVERY_MONTHS = 10;

// Children Education Allowance (CEA)
export const CEA_RATES = {
  school: { tuition: 2250, hostel: 6750 }, // Per month
  college: { tuition: 3000, hostel: 9000 },
} as const;

// Hostel Subsidy Rates (Per month)
export const HOSTEL_SUBSIDY_RATES = {
  school: { subsidy: 1500, boarding: 2000, total: 3500 },
  higher_secondary: { subsidy: 2000, boarding: 2500, total: 4500 },
  graduate: { subsidy: 2000, boarding: 2500, total: 4500 },
  post_graduate: { subsidy: 2500, boarding: 3000, total: 5500 },
} as const;

// Pay Matrix Levels (7th Pay Commission TN)
export const PAY_LEVELS = {
  1: { minPay: 15700, maxPay: 50000, description: "MTS/Peon" },
  2: { minPay: 19500, maxPay: 63200, description: "LDC/Driver" },
  3: { minPay: 21700, maxPay: 69100, description: "UDC" },
  4: { minPay: 25500, maxPay: 81100, description: "Assistant" },
  5: { minPay: 29200, maxPay: 92300, description: "Senior Assistant" },
  6: { minPay: 35400, maxPay: 112400, description: "Superintendent" },
  7: { minPay: 44900, maxPay: 142400, description: "Section Officer" },
  8: { minPay: 47600, maxPay: 151100, description: "Under Secretary" },
  9: { minPay: 53100, maxPay: 167800, description: "Deputy Secretary" },
  10: { minPay: 56100, maxPay: 177500, description: "Joint Secretary" },
  11: { minPay: 67700, maxPay: 208700, description: "Additional Secretary" },
  12: { minPay: 78800, maxPay: 209200, description: "Secretary" },
  13: { minPay: 123100, maxPay: 215900, description: "Principal Secretary" },
} as const;

// Standard increment percentage
export const ANNUAL_INCREMENT_PERCENT = 3;

// TA/DA Rates by Grade
export const TA_DA_RATES = {
  grade_1: { dailyAllowance: 750, travelClass: "AC First/Business" },
  grade_2: { dailyAllowance: 600, travelClass: "AC 2-Tier" },
  grade_3: { dailyAllowance: 450, travelClass: "AC 3-Tier" },
  grade_4: { dailyAllowance: 300, travelClass: "Sleeper" },
} as const;

// LTC Rates
export const LTC_BLOCK_YEARS = 4;
export const LTC_MAX_DISTANCE_KM = 2500;

// Historical DA rates for arrears calculation
export const DA_HISTORY = [
  { fromDate: "2024-07-01", toDate: "2024-12-31", rate: 53 },
  { fromDate: "2025-01-01", toDate: null, rate: 55 },
] as const;

// Type exports
export type CityCategory = keyof typeof HRA_RATES;
export type PayLevel = keyof typeof PAY_LEVELS;
export type TNGISScheme = keyof typeof TNGIS_RATES;
