import test from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { createCaseRepository } from "./case.repository.js";

test("preserves a case after reopening the database", () => {
  const folder = mkdtempSync(join(tmpdir(), "rehab-test-"));
  const filename = join(folder, "test.sqlite");
  let repository = createCaseRepository(filename);

  try {
    const input = {
      title: "Educational case",
      age: 30,
      symptoms: "Low back pain",
      patientHistory: "Symptoms started one week ago",
    };

    const saved = repository.create(input);

    assert.equal(saved.title, input.title);
    assert.equal(saved.age, input.age);
    assert.equal(saved.symptoms, input.symptoms);
    assert.equal(saved.patientHistory, input.patientHistory);

    repository.close();
    repository = createCaseRepository(filename);

    const loaded = repository.findById(saved.id);
    assert.deepEqual(loaded, saved);

    const missingCase = repository.findById("missing-id");
    assert.equal(missingCase, undefined);
  } finally {
    repository.close();
    rmSync(folder, { recursive: true, force: true });
  }
});
test("returns an empty list for a new database", () => {
  const repository = createCaseRepository(":memory:");

  try {
    const cases = repository.list();
    assert.deepEqual(cases, []);
  } finally {
    repository.close();
  }
});
