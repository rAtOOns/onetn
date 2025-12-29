import { z } from "zod";

// Common validation schemas for calculator inputs
// These provide type-safe validation with helpful error messages

// Basic Pay validation
export const basicPaySchema = z
  .number()
  .min(15700, "Basic pay cannot be less than minimum pay (₹15,700)")
  .max(250000, "Basic pay seems too high. Please verify.");

// Date validation
export const dateSchema = z
  .string()
  .refine((val) => !isNaN(Date.parse(val)), "Invalid date format")
  .refine((val) => {
    const date = new Date(val);
    const year = date.getFullYear();
    return year >= 1950 && year <= 2100;
  }, "Date must be between 1950 and 2100");

// DA Rate validation
export const daRateSchema = z
  .number()
  .min(0, "DA rate cannot be negative")
  .max(200, "DA rate cannot exceed 200%");

// Percentage validation (0-100)
export const percentageSchema = z
  .number()
  .min(0, "Percentage cannot be negative")
  .max(100, "Percentage cannot exceed 100%");

// Service years validation
export const serviceYearsSchema = z
  .number()
  .min(0, "Service years cannot be negative")
  .max(45, "Service years cannot exceed 45 years");

// Age validation
export const ageSchema = z
  .number()
  .int("Age must be a whole number")
  .min(18, "Age must be at least 18")
  .max(70, "Age cannot exceed 70");

// Pay Level validation (1-18)
export const payLevelSchema = z
  .number()
  .int("Pay level must be a whole number")
  .min(1, "Pay level must be at least 1")
  .max(18, "Pay level cannot exceed 18");

// City category validation
export const cityTypeSchema = z.enum(["X", "Y", "Z"], {
  message: "City type must be X, Y, or Z",
});

// GPF contribution percentage
export const gpfPercentSchema = z
  .number()
  .min(6, "Minimum GPF contribution is 6%")
  .max(100, "GPF contribution cannot exceed 100%");

// Leave days validation
export const leaveDaysSchema = z
  .number()
  .int("Leave days must be a whole number")
  .min(0, "Leave days cannot be negative")
  .max(500, "Leave days seem too high. Please verify.");

// Amount validation (positive number)
export const amountSchema = z
  .number()
  .min(0, "Amount cannot be negative")
  .max(100000000, "Amount seems too high. Please verify.");

// Salary Calculator Input Schema
export const salaryCalculatorSchema = z.object({
  basicPay: basicPaySchema,
  daRate: daRateSchema,
  cityType: cityTypeSchema,
  gpfPercent: gpfPercentSchema.optional().default(12),
  hasNHIS: z.boolean().optional().default(true),
  hasGroupInsurance: z.boolean().optional().default(false),
  hasCCA: z.boolean().optional().default(false),
  hasMA: z.boolean().optional().default(false),
  hasConveyance: z.boolean().optional().default(false),
  conveyanceAmount: z.number().optional().default(0),
  personalPay: z.number().optional().default(0),
  otherAllowances: z.number().optional().default(0),
  otherDeductions: z.number().optional().default(0),
});

// Pension Calculator Input Schema
export const pensionCalculatorSchema = z.object({
  lastBasicPay: basicPaySchema,
  daRate: daRateSchema,
  qualifyingServiceYears: serviceYearsSchema,
  qualifyingServiceMonths: z.number().min(0).max(11).optional().default(0),
  commutationPercent: percentageSchema.max(40, "Commutation cannot exceed 40%"),
  retirementAge: ageSchema,
});

// Gratuity Calculator Input Schema
export const gratuityCalculatorSchema = z.object({
  lastBasicPay: basicPaySchema,
  daRate: daRateSchema,
  qualifyingServiceYears: serviceYearsSchema,
  qualifyingServiceMonths: z.number().min(0).max(11).optional().default(0),
});

// Leave Encashment Calculator Input Schema
export const leaveEncashmentSchema = z.object({
  basicPay: basicPaySchema,
  daRate: daRateSchema,
  elBalance: leaveDaysSchema.max(300, "EL balance cannot exceed 300 days"),
  hplBalance: leaveDaysSchema.max(180, "HPL balance cannot exceed 180 days"),
});

// Age Calculator Input Schema
export const ageCalculatorSchema = z.object({
  dateOfBirth: dateSchema,
  referenceDate: dateSchema.optional(),
});

// Service Calculator Input Schema
export const serviceCalculatorSchema = z.object({
  dateOfJoining: dateSchema,
  dateOfBirth: dateSchema,
  breakInServiceDays: z.number().min(0).optional().default(0),
});

// HRA Calculator Input Schema
export const hraCalculatorSchema = z.object({
  basicPay: basicPaySchema,
  daRate: daRateSchema,
  cityType: cityTypeSchema,
  rentPaid: amountSchema,
});

// Increment Calculator Input Schema
export const incrementCalculatorSchema = z.object({
  currentBasicPay: basicPaySchema,
  payLevel: payLevelSchema,
  lastIncrementDate: dateSchema,
});

// Type exports for use in components
export type SalaryCalculatorInput = z.infer<typeof salaryCalculatorSchema>;
export type PensionCalculatorInput = z.infer<typeof pensionCalculatorSchema>;
export type GratuityCalculatorInput = z.infer<typeof gratuityCalculatorSchema>;
export type LeaveEncashmentInput = z.infer<typeof leaveEncashmentSchema>;
export type AgeCalculatorInput = z.infer<typeof ageCalculatorSchema>;
export type ServiceCalculatorInput = z.infer<typeof serviceCalculatorSchema>;
export type HRACalculatorInput = z.infer<typeof hraCalculatorSchema>;
export type IncrementCalculatorInput = z.infer<typeof incrementCalculatorSchema>;

// Validation helper function
export function validateInput<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): { success: true; data: T } | { success: false; errors: string[] } {
  const result = schema.safeParse(data);
  if (result.success) {
    return { success: true, data: result.data };
  }
  return {
    success: false,
    errors: result.error.issues.map((e) => e.message),
  };
}
