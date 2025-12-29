/**
 * Salary calculation utilities
 * Pure functions that can be tested independently
 */

import { CURRENT_DA_RATE, HRA_RATES, CCA_RATES } from "@/lib/constants/rates";

export type CityCategory = "X" | "Y" | "Z";

export interface SalaryInput {
  basicPay: number;
  daRate?: number;
  cityType: CityCategory;
  gpfPercent?: number;
  hasNHIS?: boolean;
  hasGroupInsurance?: boolean;
  hasCCA?: boolean;
  hasMA?: boolean;
  personalPay?: number;
  otherAllowances?: number;
  otherDeductions?: number;
}

export interface SalaryResult {
  basicPay: number;
  da: number;
  hra: number;
  cca: number;
  ma: number;
  totalAllowances: number;
  grossSalary: number;
  gpf: number;
  nhis: number;
  groupInsurance: number;
  professionalTax: number;
  totalDeductions: number;
  netSalary: number;
}

// Fixed allowances
const MEDICAL_ALLOWANCE = 350;
const NHIS_DEDUCTION = 50;
const GROUP_INSURANCE_DEDUCTION = 100;

/**
 * Calculate Dearness Allowance
 */
export function calculateDA(basicPay: number, daRate: number = CURRENT_DA_RATE): number {
  return Math.round((basicPay * daRate) / 100);
}

/**
 * Calculate House Rent Allowance
 */
export function calculateHRA(basicPay: number, cityType: CityCategory): number {
  const hraPercent = HRA_RATES[cityType];
  return Math.round((basicPay * hraPercent) / 100);
}

/**
 * Get CCA amount based on city type
 */
export function getCCA(cityType: CityCategory): number {
  switch (cityType) {
    case "X":
      return CCA_RATES.chennai;
    case "Y":
      return CCA_RATES.other_cities;
    default:
      return CCA_RATES.none;
  }
}

/**
 * Calculate Professional Tax based on TN slabs
 */
export function calculateProfessionalTax(grossSalary: number): number {
  if (grossSalary <= 21000) return 0;
  if (grossSalary <= 30000) return 135;
  if (grossSalary <= 45000) return 315;
  if (grossSalary <= 60000) return 690;
  if (grossSalary <= 75000) return 1025;
  return 1250; // Maximum for TN
}

/**
 * Calculate GPF deduction
 */
export function calculateGPF(basicPay: number, gpfPercent: number): number {
  return Math.round((basicPay * gpfPercent) / 100);
}

/**
 * Calculate complete salary breakdown
 */
export function calculateSalary(input: SalaryInput): SalaryResult {
  const {
    basicPay,
    daRate = CURRENT_DA_RATE,
    cityType,
    gpfPercent = 10,
    hasNHIS = true,
    hasGroupInsurance = true,
    hasCCA = true,
    hasMA = true,
    personalPay = 0,
    otherAllowances = 0,
    otherDeductions = 0,
  } = input;

  // Calculate allowances
  const da = calculateDA(basicPay, daRate);
  const hra = calculateHRA(basicPay, cityType);
  const cca = hasCCA ? getCCA(cityType) : 0;
  const ma = hasMA ? MEDICAL_ALLOWANCE : 0;

  const totalAllowances = da + hra + cca + ma + personalPay + otherAllowances;
  const grossSalary = basicPay + totalAllowances;

  // Calculate deductions
  const gpf = calculateGPF(basicPay, gpfPercent);
  const nhis = hasNHIS ? NHIS_DEDUCTION : 0;
  const groupInsurance = hasGroupInsurance ? GROUP_INSURANCE_DEDUCTION : 0;
  const professionalTax = calculateProfessionalTax(grossSalary);

  const totalDeductions = gpf + nhis + groupInsurance + professionalTax + otherDeductions;
  const netSalary = grossSalary - totalDeductions;

  return {
    basicPay,
    da,
    hra,
    cca,
    ma,
    totalAllowances,
    grossSalary,
    gpf,
    nhis,
    groupInsurance,
    professionalTax,
    totalDeductions,
    netSalary,
  };
}

/**
 * Calculate pension amount
 */
export function calculatePension(
  lastBasicPay: number,
  qualifyingServiceYears: number,
  maxServiceYears: number = 33
): number {
  const pensionPercent = Math.min(qualifyingServiceYears / maxServiceYears, 1) * 50;
  return Math.round((lastBasicPay * pensionPercent) / 100);
}

/**
 * Calculate gratuity amount
 */
export function calculateGratuity(
  lastBasicPay: number,
  qualifyingServiceYears: number,
  maxGratuity: number = 2000000
): number {
  // Formula: (Basic Pay / 4) * Service Years * 2
  const gratuity = Math.round((lastBasicPay / 4) * qualifyingServiceYears * 2);
  return Math.min(gratuity, maxGratuity);
}

/**
 * Calculate leave encashment
 */
export function calculateLeaveEncashment(
  basicPay: number,
  daRate: number,
  leaveDays: number,
  maxDays: number = 300
): number {
  const eligibleDays = Math.min(leaveDays, maxDays);
  const da = calculateDA(basicPay, daRate);
  const totalPay = basicPay + da;
  const dailyRate = totalPay / 30;
  return Math.round(dailyRate * eligibleDays);
}

/**
 * Calculate age from date of birth
 */
export function calculateAge(
  dateOfBirth: Date,
  referenceDate: Date = new Date()
): { years: number; months: number; days: number } {
  let years = referenceDate.getFullYear() - dateOfBirth.getFullYear();
  let months = referenceDate.getMonth() - dateOfBirth.getMonth();
  let days = referenceDate.getDate() - dateOfBirth.getDate();

  if (days < 0) {
    months--;
    const lastMonth = new Date(referenceDate.getFullYear(), referenceDate.getMonth(), 0);
    days += lastMonth.getDate();
  }

  if (months < 0) {
    years--;
    months += 12;
  }

  return { years, months, days };
}

/**
 * Calculate service period
 */
export function calculateService(
  dateOfJoining: Date,
  dateOfRetirement: Date
): { years: number; months: number; days: number } {
  return calculateAge(dateOfJoining, dateOfRetirement);
}

/**
 * Format currency in Indian format
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}
