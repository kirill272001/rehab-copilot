export type CreateCaseInput = {
  title: string;
  age: number;
  symptoms: string;
  patientHistory: string;
};

export type RehabCase = CreateCaseInput & {
    id: string;
    createdAt: string;
}