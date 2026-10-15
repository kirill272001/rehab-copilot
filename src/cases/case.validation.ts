import type { CreateCaseInput } from "./case.types.js";

type ValidationResult =
  | { success: true; data: CreateCaseInput }
  | { success: false; errors: Record<string, string> };

export function validateCreateCase(input: unknown): ValidationResult {
  if (typeof input !== "object" || input === null || Array.isArray(input)) {
    return {
      success: false,
      errors: { body: "Request body must be an object" },
    };
  }

  const body = input as Record<string, unknown>;
  const errors: Record<string, string> = {};

  function readText(field: string, maxLength: number): string {
    const value = body[field];

    if (typeof value !== "string") {
      errors[field] = "Must be a string";
      return "";
    }

    const trimmed = value.trim();

    if (trimmed.length === 0) {
      errors[field] = "Must not be empty";
    } else if (trimmed.length > maxLength) {
      errors[field] = `Must not exceed ${maxLength} characters`;
    }

    return trimmed;
  }

  const title = readText("title", 100);
  const symptoms = readText("symptoms", 3000);
  const patientHistory = readText("patientHistory", 5000);
  const age = body.age;

  if (typeof age !== "number" || !Number.isInteger(age)) {
    errors.age = "Must be an integer";
  } else if (age < 18 || age > 120) {
    errors.age = "Must be between 18 and 120";
  }

  if (Object.keys(errors).length > 0) {
    return { success: false, errors };
  }

  return {
    success: true,
    data: {
      title,
      age: age as number,
      symptoms,
      patientHistory,
    },
  };
}
