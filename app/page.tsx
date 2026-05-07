import { AssessmentForm } from "@/components/AssessmentForm";

export default function Home() {
  return (
    <main className="mx-auto w-full max-w-4xl px-4 py-10 sm:px-6">
      <header className="mb-8 space-y-3">
        <h1 className="text-3xl font-bold text-slate-900">Leadership Self-Assessment</h1>
        <p className="text-sm leading-6 text-slate-600">
          Complete all nine questions on a 1-5 scale. You will see your score immediately and
          receive a detailed PDF report by email.
        </p>
      </header>
      <AssessmentForm />
    </main>
  );
}
