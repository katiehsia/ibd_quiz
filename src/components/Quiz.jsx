import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Confetti from "react-confetti";
import mountainImage from "../assets/mountain.jpg"; // ✅ local image

export default function Quiz({ sheetId, title }) {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [submittedAnswers, setSubmittedAnswers] = useState({});
  const [score, setScore] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);

  const SHEET_URL = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:json`;

  // --- Shuffle helper ---
  const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  // --- Fetch questions from Google Sheet ---
  useEffect(() => {
    fetch(SHEET_URL)
      .then((res) => res.text())
      .then((text) => {
        const json = JSON.parse(text.substr(47).slice(0, -2));
        const rows = json.table.rows.map((r) =>
          r.c.map((cell) => (cell ? cell.v : ""))
        );
        const formatted = rows.map(([question, optA, optB, optC, optD, correct]) => ({
          question,
          options: shuffleArray([optA, optB, optC, optD]),
          correct,
        }));
        setQuestions(formatted);
        setLoading(false);
      })
      .catch((err) => console.error("Error loading sheet:", err));
  }, [SHEET_URL]);

  const handleSelect = (answer) => {
    setSelectedAnswers({ ...selectedAnswers, [currentIndex]: answer });
  };

  const handleSubmit = () => {
    const currentQuestion = questions[currentIndex];
    const selected = selectedAnswers[currentIndex];
    if (!selected) return;

    const isCorrect = selected === currentQuestion.correct;
    const updated = { ...submittedAnswers, [currentIndex]: selected };
    setSubmittedAnswers(updated);
    setScore((prev) => prev + (isCorrect ? 1 : 0));

    if (currentIndex + 1 < questions.length) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setShowConfetti(true);
    }
  };

  if (loading) return <p style={{ color: "white" }}>Loading questions...</p>;

  const current = questions[currentIndex];
  const total = questions.length;

  return (
    <div style={styles.container}>
      {/* Background and overlay */}
      <div
        style={{
          ...styles.background,
          backgroundImage: `url(${mountainImage})`,
        }}
      />
      <div style={styles.overlay} />

      {/* Fixed Home Button */}
      <Link to="/" style={styles.homeButton}>
        ⬅ Home
      </Link>

      <div style={styles.content}>
        {showConfetti && <Confetti />}
        <h1 style={styles.title}>{title}</h1>

        {!showConfetti ? (
          <div style={styles.quizBox}>
            <h2 style={styles.question}>{current.question}</h2>
            <div style={styles.optionsContainer}>
              {current.options.map((opt, i) => (
                <button
                  key={i}
                  style={{
                    ...styles.optionButton,
                    backgroundColor:
                      selectedAnswers[currentIndex] === opt
                        ? "rgba(255,255,255,0.25)"
                        : "rgba(255,255,255,0.1)",
                  }}
                  onClick={() => handleSelect(opt)}
                >
                  {opt}
                </button>
              ))}
            </div>
            <button style={styles.submitButton} onClick={handleSubmit}>
              {currentIndex + 1 === total ? "Finish Quiz" : "Next"}
            </button>
            <p style={styles.progress}>
              Question {currentIndex + 1} / {total}
            </p>
          </div>
        ) : (
          <div style={styles.results}>
            <h2>Quiz Complete! 🎉</h2>
            <p>
              Your score: {score} / {total} (
              {Math.round((score / total) * 100)}%)
            </p>
            <Link to="/" style={styles.restartButton}>
              Back to Home
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  // --- Overall container ---
  container: {
    position: "relative",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    width: "100%",
    overflowX: "hidden",
    fontFamily: "sans-serif",
    color: "#fff",
    textShadow: "0 1px 3px rgba(0,0,0,0.7)",
  },

  // --- Background + overlay ---
  background: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundAttachment: "fixed",
    zIndex: 0,
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.35)", // adjustable for transparency
    zIndex: 1,
  },

  // --- Content centering ---
  content: {
    position: "relative",
    zIndex: 2,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    width: "90%",
    maxWidth: "700px",
    padding: "2rem 1rem 4rem 1rem",
    boxSizing: "border-box",
    textAlign: "center",
  },

  // --- Fixed home button (always top left) ---
  homeButton: {
    position: "fixed",
    top: "1rem",
    left: "1rem",
    textDecoration: "none",
    color: "#fff",
    fontWeight: "bold",
    background: "rgba(0,0,0,0.4)",
    padding: "0.6rem 1rem",
    borderRadius: "8px",
    zIndex: 3,
    fontSize: "clamp(0.8rem, 2.5vw, 1rem)",
    transition: "background 0.3s",
  },

  // --- Title ---
  title: {
    marginBottom: "1rem",
    fontSize: "clamp(1.5rem, 5vw, 2.5rem)",
    lineHeight: 1.2,
  },

  // --- Quiz box centered ---
  quizBox: {
    background: "rgba(0, 0, 0, 0.55)",
    borderRadius: "12px",
    padding: "clamp(1rem, 4vw, 2rem)",
    width: "100%",
    maxWidth: "600px",
    boxShadow: "0 4px 15px rgba(0,0,0,0.3)",
  },

  question: {
    fontSize: "clamp(1rem, 4vw, 1.3rem)",
    marginBottom: "1rem",
  },

  optionsContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "0.75rem",
  },

  optionButton: {
    border: "none",
    borderRadius: "8px",
    padding: "clamp(0.75rem, 2.5vw, 1rem)",
    color: "#fff",
    backgroundColor: "rgba(255,255,255,0.1)",
    cursor: "pointer",
    transition: "background 0.3s, transform 0.1s",
    fontSize: "clamp(0.9rem, 3vw, 1rem)",
  },

  submitButton: {
    marginTop: "1.5rem",
    backgroundColor: "#4CAF50",
    border: "none",
    color: "white",
    padding: "clamp(0.75rem, 2.5vw, 1rem) 1.5rem",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold",
    transition: "background-color 0.3s",
    fontSize: "clamp(0.9rem, 3vw, 1rem)",
  },

  progress: {
    marginTop: "1rem",
    fontSize: "clamp(0.85rem, 3vw, 1rem)",
  },

  results: {
    background: "rgba(0,0,0,0.5)",
    borderRadius: "12px",
    padding: "clamp(1rem, 4vw, 2rem)",
    maxWidth: "600px",
    margin: "0 auto",
  },

  restartButton: {
    display: "inline-block",
    marginTop: "1.5rem",
    backgroundColor: "#4CAF50",
    color: "#fff",
    padding: "clamp(0.75rem, 2.5vw, 1rem) 1.5rem",
    borderRadius: "8px",
    textDecoration: "none",
    fontWeight: "bold",
    fontSize: "clamp(0.9rem, 3vw, 1rem)",
  },
};
