import { useState } from "react";

export default function Home() {
  const [subject, setSubject] = useState("");
  const [hours, setHours] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const generatePlan = async () => {
    if (!subject || !hours) return;

    setLoading(true);
    setResult("");

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subject, hours }),
      });

      const data = await res.json();
      setResult(data.plan);
    } catch (error) {
      setResult("Something went wrong.");
    }

    setLoading(false);
  };

  return (
    <div className="container">
      <h1>🔥 AI Study Planner</h1>

      <input
        type="text"
        placeholder="Enter Subject"
        value={subject}
        onChange={(e) => setSubject(e.target.value)}
      />

      <input
        type="number"
        placeholder="Hours Available"
        value={hours}
        onChange={(e) => setHours(e.target.value)}
      />

      <button onClick={generatePlan} disabled={loading}>
        {loading ? "⚡ Generating..." : "Generate Plan"}
      </button>

      {result && (
        <div className="result">
          <h2>Your Plan:</h2>
          <pre>{result}</pre>
        </div>
      )}
    </div>
  );
}
