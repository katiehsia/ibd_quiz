import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Confetti from "react-confetti";

export default function Quiz({ sheetId, title }) {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [submittedAnswers, setSubmittedAnswers] = useState({});
  const [score, setScore] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);

  const SHEET_URL = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:json`;

  // --- Fetch questions from Google Sheet ---
  useEffect(() => {
    fetch(SHEET_URL)
      .then((res) => res.text())
      .then((text) => {
        const json = JSON.parse(text.substring(47).slice(0, -2));
        const rows = json.table.rows.map((r) => ({
          text: r.c[0]?.v,
          options: [r.c[1]?.v, r.c[2]?.v, r.c[3]?.v, r.c[4]?.v],
          correct: r.c[5]?.v,
          explanation: r.c[6]?.v || "",
        }));
        setQuestions(rows);
        setLoading(false);
      })
      .catch((err) => console.error("Error fetching sheet:", err));
  }, [SHEET_URL]);

  // --- Show confetti only if >80% correct ---
  useEffect(() => {
    if (Object.keys(submittedAnswers).length === questions.length && questions.length > 0) {
      const percent = (score / questions.length) * 100;
      if (percent > 80) {
        setShowConfetti(true);
        const timer = setTimeout(() => setShowConfetti(false), 6000);
        return () => clearTimeout(timer);
      }
    }
  }, [score, questions.length, submittedAnswers]);

  if (loading)
    return <p style={{ textAlign: "center" }}>Loading questions...</p>;
  if (questions.length === 0) return <p>No questions found.</p>;

  const current = questions[currentIndex];
  const quizDone = Object.keys(submittedAnswers).length === questions.length;

  const selected = selectedAnswers[currentIndex];
  const submitted = submittedAnswers[currentIndex];

  // --- Handle selecting an option ---
  const handleSelect = (option) => {
    if (!submitted) {
      setSelectedAnswers({ ...selectedAnswers, [currentIndex]: option });
    }
  };

  // --- Handle submitting an answer ---
  const handleSubmit = () => {
    if (selected && !submitted) {
      const correct = current.correct;
      const isCorrect = selected === correct;
      setSubmittedAnswers({ ...submittedAnswers, [currentIndex]: true });
      if (isCorrect) setScore((s) => s + 1);
    }
  };

  // --- Navigation buttons ---
  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((i) => i + 1);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex((i) => i - 1);
    }
  };

  // --- Compute overall score after completion ---
  const totalQuestions = questions.length;

  return (
    <div style={styles.container}>
      <Link to="/" style={styles.homeLink}>🏠 Home</Link>
      {showConfetti && <Confetti recycle={false} numberOfPieces={300} />}

      {!quizDone ? (
        <>
          <h2>{title}</h2>
          <p style={styles.score}>
            Score: <strong>{score}</strong> / {totalQuestions}
          </p>

          <h3 style={styles.question}>
            Question {currentIndex + 1} of {totalQuestions}
          </h3>
          <p style={styles.text}>{current.text}</p>

          <div style={styles.options}>
            {current.options.map((option) => (
              <button
                key={option}
                onClick={() => handleSelect(option)}
                disabled={submitted}
                style={{
                  ...styles.button,
                  backgroundColor:
                    selected === option
                      ? submitted
                        ? option === current.correct
                          ? "#4CAF50"
                          : "#f44336"
                        : "#2196F3"
                      : "#eee",
                  color: selected === option ? "white" : "black",
                }}
              >
                {option}
              </button>
            ))}
          </div>

          {/* Navigation & Submit */}
          <div style={styles.navButtons}>
            {/* Previous */}
            <button
              onClick={handlePrevious}
              disabled={currentIndex === 0}
              style={{
                ...styles.nav,
                opacity: currentIndex === 0 ? 0.6 : 1,
              }}
              onMouseEnter={(e) => {
                if (currentIndex > 0) e.target.style.backgroundColor = "#757575"; // darker gray
              }}
              onMouseLeave={(e) => {
                if (currentIndex > 0) e.target.style.backgroundColor = "#9E9E9E"; // reset gray
              }}
            >
              ⬅️ Previous
            </button>

            {/* Submit or Next */}
            {!submitted ? (
              <button
                onClick={handleSubmit}
                disabled={!selected}
                style={{
                  ...styles.submit,
                  opacity: !selected ? 0.6 : 1,
                  backgroundColor: !selected ? "#a5d6a7" : "#4CAF50",
                }}
                onMouseEnter={(e) => {
                  if (selected) e.target.style.backgroundColor = "#43A047"; // darker green
                }}
                onMouseLeave={(e) => {
                  if (selected) e.target.style.backgroundColor = "#4CAF50"; // reset
                }}
              >
                Submit
              </button>
            ) : (
              <button
                onClick={handleNext}
                disabled={currentIndex === questions.length - 1}
                style={{
                  ...styles.next,
                  opacity: currentIndex === questions.length - 1 ? 0.6 : 1,
                }}
                onMouseEnter={(e) => {
                  if (currentIndex < questions.length - 1)
                    e.target.style.backgroundColor = "#FB8C00"; // darker orange
                }}
                onMouseLeave={(e) => {
                  if (currentIndex < questions.length - 1)
                    e.target.style.backgroundColor = "#FF9800"; // reset orange
                }}
              >
                Next ➡️
              </button>
            )}
          </div>


          {submitted && (
            <>
              <p style={styles.feedback}>
                {selected === current.correct
                  ? "✅ Correct!"
                  : `❌ Incorrect. The correct answer was ${current.correct}.`}
              </p>
              {current.explanation && (
                <p style={styles.explanation}>💡 {current.explanation}</p>
              )}
            </>
          )}
        </>
      ) : (
        <div style={styles.complete}>
          <h2>🎉 Quiz Complete!</h2>
          <p>
            You scored <strong>{score}</strong> out of {totalQuestions}.
          </p>
          <Link to="/" style={styles.returnHome}>
            🏠 Return to Home
          </Link>
        </div>
      )}
    </div>
  );
}

// --- Inline CSS ---
const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    width: "100%",
    textAlign: "center",
    fontFamily: "sans-serif",
    backgroundColor: "#f9f9f9",
    padding: "1rem",
    position: "relative",
    overflow: "hidden",
  },
  homeLink: {
    position: "absolute",
    top: "20px",
    left: "20px",
    textDecoration: "none",
    backgroundColor: "#ddd",
    color: "black",
    padding: "0.4rem 0.8rem",
    borderRadius: "6px",
  },
  score: { marginBottom: "1.5rem", fontSize: "1.1rem" },
  question: { marginBottom: "0.5rem" },
  text: { fontSize: "1.2rem", marginBottom: "1.5rem", maxWidth: "600px" },
  options: {
    display: "flex",
    flexDirection: "column",
    gap: "0.75rem",
    width: "100%",
    maxWidth: "400px",
  },
  button: {
    padding: "0.75rem",
    border: "none",
    borderRadius: "8px",
    fontSize: "1rem",
    cursor: "pointer",
    transition: "0.2s ease",
  },
  navButtons: {
    display: "flex",
    justifyContent: "space-between",
    gap: "1rem",
    marginTop: "1.5rem",
  },
  nav: {
    backgroundColor: "#9E9E9E",
    color: "white",
    border: "none",
    padding: "0.75rem 2rem",
    borderRadius: "8px",
    fontSize: "1rem",
    cursor: "pointer",
  },
  submit: {
    backgroundColor: "#4CAF50", // base green
    color: "white",
    border: "none",
    padding: "0.75rem 2rem",
    borderRadius: "8px",
    fontSize: "1rem",
    cursor: "pointer",
    transition: "background-color 0.2s ease",
  },
  next: {
    backgroundColor: "#FF9800",
    color: "white",
    border: "none",
    padding: "0.75rem 2rem",
    borderRadius: "8px",
    fontSize: "1rem",
    cursor: "pointer",
  },
  feedback: { marginTop: "1rem", fontSize: "1.1rem" },
  explanation: {
    marginTop: "0.75rem",
    fontSize: "1rem",
    maxWidth: "400px",
    backgroundColor: "#fff8e1",
    border: "1px solid #ffecb3",
    borderRadius: "8px",
    padding: "0.75rem",
  },
  complete: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "100vh",
    backgroundColor: "#e8f5e9",
    textAlign: "center",
    padding: "2rem",
  },
  returnHome: {
    marginTop: "1.5rem",
    backgroundColor: "#4CAF50",
    color: "white",
    textDecoration: "none",
    padding: "0.75rem 2rem",
    borderRadius: "8px",
    fontSize: "1rem",
  },
};
