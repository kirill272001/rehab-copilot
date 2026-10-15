import test from "node:test";
import assert from "node:assert/strict";
import { validateCreateCase } from "./case.validation.js";

const validInput = {
  title: "  Educational case  ",
  age: 30,
  symptoms: "  Low back pain  ",
  patientHistory: "  Symptoms started one week ago  ",
};

test("accepts valid input and trims text", () => {
  const result = validateCreateCase(validInput);

  assert.equal(result.success, true);

  if (!result.success) {
    throw new Error("Expected valid input");
  }

  assert.deepEqual(result.data, {
    title: "Educational case",
    age: 30,
    symptoms: "Low back pain",
    patientHistory: "Symptoms started one week ago",
  });
});

test("accepts boundary ages", () => {
  for (const age of [18, 120]) {
    const result = validateCreateCase({ ...validInput, age });
    assert.equal(result.success, true);
  }
});

test("rejects invalid ages", () => {
  const invalidAges = [17, 18.5, "30", 121];

  for (const age of invalidAges) {
    const result = validateCreateCase({ ...validInput, age });

    assert.equal(result.success, false);

    if (!result.success) {
      assert.ok(result.errors.age);
    }
  }
});

test("rejects empty and oversized text fields", () => {
  const fields = [
    { name: "title", maxLength: 100 },
    { name: "symptoms", maxLength: 3000 },
    { name: "patientHistory", maxLength: 5000 },
  ];

  for (const field of fields) {
    for (const value of ["   ", "a".repeat(field.maxLength + 1)]) {
      const result = validateCreateCase({
        ...validInput,
        [field.name]: value,
      });

      assert.equal(result.success, false);

      if (!result.success) {
        assert.ok(result.errors[field.name]);
      }
    }
  }
});

test("rejects missing required fields", () => {
  const result = validateCreateCase({});

  assert.equal(result.success, false);

  if (!result.success) {
    for (const field of ["title", "age", "symptoms", "patientHistory"]) {
      assert.ok(result.errors[field]);
    }
  }
});

test("rejects a body that is not an object", () => {
  for (const input of [null, undefined, [], "hello", 42]) {
    const result = validateCreateCase(input);
    assert.equal(result.success, false);
  }
});
