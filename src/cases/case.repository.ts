import { randomUUID } from "node:crypto";
import { mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { DatabaseSync } from "node:sqlite";

import type { CreateCaseInput, RehabCase } from "./case.types.js";

export function createCaseRepository(
  filename = "data/rehab.sqlite",
) {
  const databasePath =
    filename === ":memory:" ? filename : resolve(filename);

  if (databasePath !== ":memory:") {
    mkdirSync(dirname(databasePath), { recursive: true });
  }

  const db = new DatabaseSync(databasePath);

  db.exec(`
    CREATE TABLE IF NOT EXISTS cases (
      id TEXT PRIMARY KEY NOT NULL,
      title TEXT NOT NULL,
      age INTEGER NOT NULL CHECK (age BETWEEN 18 AND 120),
      symptoms TEXT NOT NULL,
      patientHistory TEXT NOT NULL,
      createdAt TEXT NOT NULL
    ) STRICT
  `);

  function toCase(row: Record<string, unknown>): RehabCase {
    return {
      id: String(row.id),
      title: String(row.title),
      age: Number(row.age),
      symptoms: String(row.symptoms),
      patientHistory: String(row.patientHistory),
      createdAt: String(row.createdAt),
    };
  }

  function create(input: CreateCaseInput): RehabCase {
    const savedCase: RehabCase = {
      ...input,
      id: randomUUID(),
      createdAt: new Date().toISOString(),
    };

    const statement = db.prepare(`
      INSERT INTO cases (
        id, title, age, symptoms, patientHistory, createdAt
      )
      VALUES (?, ?, ?, ?, ?, ?)
    `);

    statement.run(
      savedCase.id,
      savedCase.title,
      savedCase.age,
      savedCase.symptoms,
      savedCase.patientHistory,
      savedCase.createdAt,
    );

    return savedCase;
  }

  function list(): RehabCase[] {
    const statement = db.prepare(`
      SELECT id, title, age, symptoms, patientHistory, createdAt
      FROM cases
      ORDER BY createdAt DESC, id ASC
    `);

    return statement.all().map(toCase);
  }

  function findById(id: string): RehabCase | undefined {
    const statement = db.prepare(`
      SELECT id, title, age, symptoms, patientHistory, createdAt
      FROM cases
      WHERE id = ?
    `);

    const row = statement.get(id);

    if (row === undefined) {
      return undefined;
    }

    return toCase(row);
  }

  function close(): void {
    db.close();
  }

  return { create, list, findById, close };
}