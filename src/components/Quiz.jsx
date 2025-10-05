import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Confetti from "react-confetti";

export default function Quiz({ sheetId, title }) {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);

  const SHEET_URL = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:json`;

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

  useEffect(() => {
    // Turn on confetti when the quiz is done
    if (currentIndex >= questions.length && questions.length > 0) {
      setShowConfetti(true);
      const timer = setTimeout(() => setShowConfetti(false), 6000); // 6s confetti
      return () => clearTimeout(timer);
    }
  }, [currentIndex, questions.length]);

  if (loading)
    return <p style={{ textAlign: "center" }}>Loading questions...</p>;
  if (questions.length === 0) return <p>No questions found.</p>;

  const current = questions[currentIndex];
  const quizDone = currentIndex >= questions.length;

  const handleSelect = (option) => !submitted && setSelected(option);

  const handleSubmit = () => {
    if (selected) {
      setSubmitted(true);
      if (selected === current.correct) setScore((s) => s + 1);
    }
  };

  const handleNext = () => {
    setSelected(null);
    setSubmitted(false);
    setCurrentIndex((i) => i + 1);
  };

  return (
    <div style={styles.container}>
      <Link to="/" style={styles.homeLink}>🏠 Home</Link>
      {showConfetti && <Confetti recycle={false} numberOfPieces={300} />}

      {!quizDone ? (
        <>
          <h2>{title}</h2>
          <p style={styles.score}>
            Score: <strong>{score}</strong> / {questions.length}
          </p>

          <h3 style={styles.question}>
            Question {currentIndex + 1} of {questions.length}
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

          {!submitted ? (
            <button
              onClick={handleSubmit}
              disabled={!selected}
              style={{ ...styles.submit, opacity: !selected ? 0.6 : 1 }}
            >
              Submit
            </button>
          ) : (
            <button onClick={handleNext} style={styles.next}>
              Next
            </button>
          )}

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
            You scored <strong>{score}</strong> out of {questions.length}.
          </p>
          <Link to="/" style={styles.returnHome}>
            ⬅️ Return to Home
          </Link>
        </div>
      )}
    </div>
  );
}

// --- Inline CSS styles ---
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
    boxSizing: "border-box",
    margin: 0,
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
  score: {
    marginBottom: "1.5rem",
    fontSize: "1.1rem",
  },
  question: {
    marginBottom: "0.5rem",
  },
  text: {
    fontSize: "1.2rem",
    marginBottom: "1.5rem",
    maxWidth: "600px",
  },
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
  submit: {
    marginTop: "1.5rem",
    backgroundColor: "#2196F3",
    color: "white",
    border: "none",
    padding: "0.75rem 2rem",
    borderRadius: "8px",
    fontSize: "1rem",
    cursor: "pointer",
  },
  next: {
    marginTop: "1.5rem",
    backgroundColor: "#FF9800",
    color: "white",
    border: "none",
    padding: "0.75rem 2rem",
    borderRadius: "8px",
    fontSize: "1rem",
    cursor: "pointer",
  },
  feedback: {
    marginTop: "1rem",
    fontSize: "1.1rem",
  },
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
    boxSizing: "border-box",
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
