import { describe, it, expect } from "vitest";
import {
  calculateDA,
  calculateHRA,
  getCCA,
  calculateProfessionalTax,
  calculateGPF,
  calculateSalary,
  calculatePension,
  calculateGratuity,
  calculateLeaveEncashment,
  calculateAge,
  formatCurrency,
} from "./salary";

describe("Salary Calculator Functions", () => {
  describe("calculateDA", () => {
    it("should calculate DA at default rate (55%)", () => {
      expect(calculateDA(50000)).toBe(27500);
    });

    it("should calculate DA at custom rate", () => {
      expect(calculateDA(50000, 50)).toBe(25000);
    });

    it("should round to nearest rupee", () => {
      expect(calculateDA(33333, 55)).toBe(18333);
    });

    it("should handle zero basic pay", () => {
      expect(calculateDA(0)).toBe(0);
    });
  });

  describe("calculateHRA", () => {
    it("should calculate HRA for X category (24%)", () => {
      expect(calculateHRA(50000, "X")).toBe(12000);
    });

    it("should calculate HRA for Y category (16%)", () => {
      expect(calculateHRA(50000, "Y")).toBe(8000);
    });

    it("should calculate HRA for Z category (8%)", () => {
      expect(calculateHRA(50000, "Z")).toBe(4000);
    });
  });

  describe("getCCA", () => {
    it("should return Chennai CCA for X category", () => {
      expect(getCCA("X")).toBe(600);
    });

    it("should return other cities CCA for Y category", () => {
      expect(getCCA("Y")).toBe(300);
    });

    it("should return 0 for Z category", () => {
      expect(getCCA("Z")).toBe(0);
    });
  });

  describe("calculateProfessionalTax", () => {
    it("should return 0 for salary <= 21000", () => {
      expect(calculateProfessionalTax(21000)).toBe(0);
      expect(calculateProfessionalTax(15000)).toBe(0);
    });

    it("should return 135 for salary 21001-30000", () => {
      expect(calculateProfessionalTax(25000)).toBe(135);
      expect(calculateProfessionalTax(30000)).toBe(135);
    });

    it("should return 315 for salary 30001-45000", () => {
      expect(calculateProfessionalTax(35000)).toBe(315);
      expect(calculateProfessionalTax(45000)).toBe(315);
    });

    it("should return 690 for salary 45001-60000", () => {
      expect(calculateProfessionalTax(50000)).toBe(690);
    });

    it("should return 1025 for salary 60001-75000", () => {
      expect(calculateProfessionalTax(70000)).toBe(1025);
    });

    it("should return max 1250 for salary > 75000", () => {
      expect(calculateProfessionalTax(100000)).toBe(1250);
      expect(calculateProfessionalTax(500000)).toBe(1250);
    });
  });

  describe("calculateGPF", () => {
    it("should calculate GPF at 10%", () => {
      expect(calculateGPF(50000, 10)).toBe(5000);
    });

    it("should calculate GPF at 12%", () => {
      expect(calculateGPF(50000, 12)).toBe(6000);
    });

    it("should round to nearest rupee", () => {
      expect(calculateGPF(33333, 10)).toBe(3333);
    });
  });

  describe("calculateSalary", () => {
    it("should calculate complete salary breakdown", () => {
      const result = calculateSalary({
        basicPay: 50000,
        cityType: "Y",
        gpfPercent: 10,
      });

      expect(result.basicPay).toBe(50000);
      expect(result.da).toBe(27500); // 55% of 50000
      expect(result.hra).toBe(8000); // 16% of 50000
      expect(result.cca).toBe(300); // Y city
      expect(result.ma).toBe(350); // Medical allowance
      expect(result.gpf).toBe(5000); // 10% of basic
      expect(result.nhis).toBe(50);
      expect(result.groupInsurance).toBe(100);
      expect(result.grossSalary).toBe(50000 + 27500 + 8000 + 300 + 350);
      expect(result.netSalary).toBe(result.grossSalary - result.totalDeductions);
    });

    it("should handle Chennai (X) city correctly", () => {
      const result = calculateSalary({
        basicPay: 50000,
        cityType: "X",
      });

      expect(result.hra).toBe(12000); // 24%
      expect(result.cca).toBe(600); // Chennai CCA
    });

    it("should handle Z city correctly", () => {
      const result = calculateSalary({
        basicPay: 50000,
        cityType: "Z",
      });

      expect(result.hra).toBe(4000); // 8%
      expect(result.cca).toBe(0); // No CCA
    });

    it("should handle optional deductions", () => {
      const result = calculateSalary({
        basicPay: 50000,
        cityType: "Y",
        hasNHIS: false,
        hasGroupInsurance: false,
      });

      expect(result.nhis).toBe(0);
      expect(result.groupInsurance).toBe(0);
    });
  });

  describe("calculatePension", () => {
    it("should calculate full pension for 33+ years service", () => {
      expect(calculatePension(100000, 33)).toBe(50000); // 50%
      expect(calculatePension(100000, 40)).toBe(50000); // Still 50%
    });

    it("should calculate proportional pension for less service", () => {
      expect(calculatePension(100000, 20)).toBe(30303); // ~30.3%
    });

    it("should handle minimum service", () => {
      expect(calculatePension(100000, 10)).toBe(15152); // ~15.15%
    });
  });

  describe("calculateGratuity", () => {
    it("should calculate gratuity correctly", () => {
      // (Basic/4) * Years * 2 = (100000/4) * 30 * 2 = 1500000
      expect(calculateGratuity(100000, 30)).toBe(1500000);
    });

    it("should cap gratuity at 20 lakhs", () => {
      expect(calculateGratuity(200000, 40)).toBe(2000000);
    });

    it("should handle short service", () => {
      // (50000/4) * 10 * 2 = 250000
      expect(calculateGratuity(50000, 10)).toBe(250000);
    });
  });

  describe("calculateLeaveEncashment", () => {
    it("should calculate leave encashment correctly", () => {
      const result = calculateLeaveEncashment(50000, 55, 100);
      // Daily rate = (50000 + 27500) / 30 = 2583.33
      // Encashment = 2583.33 * 100 = 258333
      expect(result).toBeGreaterThan(250000);
      expect(result).toBeLessThan(260000);
    });

    it("should cap at 300 days", () => {
      const result100 = calculateLeaveEncashment(50000, 55, 100);
      const result300 = calculateLeaveEncashment(50000, 55, 300);
      const result500 = calculateLeaveEncashment(50000, 55, 500);

      expect(result300).toBe(result500); // Both capped at 300
      // Allow for minor rounding differences
      expect(Math.abs(result300 - result100 * 3)).toBeLessThanOrEqual(1);
    });
  });

  describe("calculateAge", () => {
    it("should calculate age correctly", () => {
      const dob = new Date("1990-06-15");
      const refDate = new Date("2024-12-29");
      const age = calculateAge(dob, refDate);

      expect(age.years).toBe(34);
      expect(age.months).toBe(6);
      expect(age.days).toBe(14);
    });

    it("should handle birthday on same day", () => {
      const dob = new Date("1990-12-29");
      const refDate = new Date("2024-12-29");
      const age = calculateAge(dob, refDate);

      expect(age.years).toBe(34);
      expect(age.months).toBe(0);
      expect(age.days).toBe(0);
    });
  });

  describe("formatCurrency", () => {
    it("should format in Indian currency format", () => {
      expect(formatCurrency(100000)).toBe("₹1,00,000");
      expect(formatCurrency(1234567)).toBe("₹12,34,567");
    });

    it("should handle zero", () => {
      expect(formatCurrency(0)).toBe("₹0");
    });

    it("should round decimals", () => {
      expect(formatCurrency(1000.75)).toBe("₹1,001");
    });
  });
});
