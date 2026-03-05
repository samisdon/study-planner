"use client";
import { useState, useEffect } from "react";

export default function Home() {
  const [examDate, setExamDate] = useState("");
  const [subjects, setSubjects] = useState("");
  const [dailyHours, setDailyHours] = useState(4);
  const [plan, setPlan] = useState([]);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const savedPlan = localStorage.getItem("studyPlan");
    const savedTheme = localStorage.getItem("theme");

    if (savedPlan) setPlan(JSON.parse(savedPlan));
    if (savedTheme === "dark") setDarkMode(true);
  }, []);

  useEffect(() => {
    localStorage.setItem("studyPlan", JSON.stringify(plan));
  }, [plan]);

  useEffect(() => {
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  const generatePlan = () => {
    if (!examDate || !subjects) {
      alert("Fill all fields");
      return;
    }

    const subjectList = subjects.split(",");
    const today = new Date();
    const exam = new Date(examDate);

    const daysLeft = Math.ceil(
      (exam.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (daysLeft <= 0) {
      alert("Exam date must be future");
      return;
    }

    let generatedPlan = [];

    for (let i = 0; i < daysLeft; i++) {
      const date = new Date();
      date.setDate(today.getDate() + i);

      generatedPlan.push({
        date: date.toDateString(),
        subject: subjectList[i % subjectList.length].trim(),
        hours: Math.ceil(dailyHours / subjectList.length),
        done: false,
      });
    }

    setPlan(generatedPlan);
  };

  const toggleDone = (index) => {
    const updated = [...plan];
    updated[index].done = !updated[index].done;
    setPlan(updated);
  };

  const progress =
    plan.length === 0
      ? 0
      : Math.round(
          (plan.filter((item) => item.done).length / plan.length) * 100
        );

  return (
    <div
      className={`min-h-screen flex items-center justify-center p-6 transition-all duration-500 ${
        darkMode
          ? "bg-gradient-to-br from-slate-900 via-purple-900 to-slate-800"
          : "bg-gradient-to-br from-indigo-200 via-purple-200 to-pink-200"
      }`}
    >
      <div
        className={`w-full max-w-xl rounded-2xl p-6 shadow-2xl backdrop-blur-lg border transition-all duration-300 ${
          darkMode
            ? "bg-white/10 text-white border-white/20"
            : "bg-white/70 text-slate-800 border-white/40"
        }`}
      >
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">
            ✨ AI Smart Study Planner
          </h1>

          <button
            onClick={() => setDarkMode(!darkMode)}
            className="px-3 py-1 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-sm hover:scale-105 transition"
          >
            {darkMode ? "Light" : "Dark"}
          </button>
        </div>

        <input
          type="date"
          className="w-full p-3 rounded-lg mb-4 text-black"
          value={examDate}
          onChange={(e) => setExamDate(e.target.value)}
        />

        <input
          type="text"
          placeholder="Subjects (Math, Physics, Chem)"
          className="w-full p-3 rounded-lg mb-4 text-black"
          value={subjects}
          onChange={(e) => setSubjects(e.target.value)}
        />

        <input
          type="number"
          placeholder="Daily Study Hours"
          className="w-full p-3 rounded-lg mb-4 text-black"
          value={dailyHours}
          onChange={(e) => setDailyHours(e.target.value)}
        />

        <button
          onClick={generatePlan}
          className="w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white font-semibold py-3 rounded-lg hover:scale-105 transition duration-300 shadow-lg"
        >
          🚀 Generate AI Plan
        </button>

        {plan.length > 0 && (
          <>
            <div className="mt-6">
              <p className="font-medium">Progress: {progress}%</p>
              <div className="w-full bg-white/30 h-3 rounded-full mt-2">
                <div
                  className="bg-gradient-to-r from-green-400 to-emerald-500 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>

            <div className="mt-6 max-h-80 overflow-y-auto">
              {plan.map((item, index) => (
                <div
                  key={index}
                  className={`flex justify-between items-center p-4 rounded-xl mb-3 shadow ${
                    darkMode ? "bg-white/10" : "bg-white"
                  }`}
                >
                  <div>
                    <p className="font-semibold">{item.date}</p>
                    <p className="text-sm opacity-80">
                      {item.subject} - {item.hours} hrs
                    </p>
                  </div>

                  <input
                    type="checkbox"
                    className="w-5 h-5 accent-emerald-500"
                    checked={item.done}
                    onChange={() => toggleDone(index)}
                  />
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
