import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Confetti from "react-confetti";
import mountainImage from "../assets/mountain.jpg"; // ✅ local background image

export default function Quiz({ sheetId, title }) {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [submittedAnswers, setSubmittedAnswers] = useState({});
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  const navigate = useNavigate();
  const SHEET_URL = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:json`;

  // --- Fetch questions ---
  useEffect(() => {
    fetch(SHEET_URL)
      .then((res) => res.text())
      .then((text) => {
        const json = JSON.parse(text.substr(47).slice(0, -2));
        const rows = json.table.rows.map((r) =>
          r.c.map((cell) => (cell ? cell.v : ""))
        );
        const formatted = rows.map(
          ([question, optA, optB, optC, optD, correct, explanation]) => ({
            question,
            options: shuffleArray([optA, optB, optC, optD]),
            correct,
            explanation,
          })
        );
        setQuestions(formatted);
        setLoading(false);
      })
      .catch((err) => console.error("Error loading sheet:", err));
  }, [SHEET_URL]);

  const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  if (loading) return <p style={{ color: "white" }}>Loading questions...</p>;

  const total = questions.length;
  const current = questions[currentIndex];
  const selected = selectedAnswers[currentIndex];
  const submitted = submittedAnswers[currentIndex];

  const handleSelect = (answer) => {
    if (!submitted) {
      setSelectedAnswers({ ...selectedAnswers, [currentIndex]: answer });
    }
  };

  const handleSubmitAnswer = () => {
    if (!selected) return;
    const isCorrect = selected === current.correct;
    if (!submittedAnswers[currentIndex]) {
      setSubmittedAnswers({
        ...submittedAnswers,
        [currentIndex]: { selected, isCorrect },
      });
      if (isCorrect) setScore((prev) => prev + 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < total - 1) setCurrentIndex(currentIndex + 1);
  };

  const handlePrev = () => {
    if (currentIndex > 0) setCurrentIndex(currentIndex - 1);
  };

  const handleFinish = () => {
    const percent = (score / total) * 100;
    if (percent >= 80) setShowConfetti(true);
    setShowResults(true);
  };

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

        {/* --- Final Results Page --- */}
        {showResults ? (
          <div style={styles.results}>
            <h2>Quiz Complete 🎉</h2>
            <p>
              Your score: {score} / {total} (
              {Math.round((score / total) * 100)}%)
            </p>
            <Link to="/" style={styles.homeReturnButton}>
              Back to Home
            </Link>
          </div>
        ) : (
          /* --- Question-by-question view --- */
          <div style={styles.quizBox}>
            <h2 style={styles.question}>{current.question}</h2>

            <div style={styles.optionsContainer}>
              {current.options.map((opt, i) => {
                const isSelected = selected === opt;
                const isCorrectAnswer = current.correct === opt;
                const isSubmitted = !!submitted;
                let background = "rgba(255,255,255,0.1)";

                if (isSubmitted) {
                  if (isCorrectAnswer) background = "rgba(76, 175, 80, 0.4)";
                  else if (isSelected) background = "rgba(244, 67, 54, 0.4)";
                } else if (isSelected) {
                  background = "rgba(255,255,255,0.25)";
                }

                return (
                  <button
                    key={i}
                    style={{ ...styles.optionButton, backgroundColor: background }}
                    onClick={() => handleSelect(opt)}
                    disabled={isSubmitted}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>

            {/* --- Buttons --- */}
            <div style={styles.navButtons}>
              <button
                style={{
                  ...styles.navButton,
                  opacity: currentIndex === 0 ? 0.5 : 1,
                }}
                disabled={currentIndex === 0}
                onClick={handlePrev}
              >
                ⬅ Prev
              </button>

              {!submitted ? (
                <button
                  style={{
                    ...styles.submitButton,
                    opacity: selected ? 1 : 0.5,
                  }}
                  onClick={handleSubmitAnswer}
                  disabled={!selected}
                >
                  Submit Answer
                </button>
              ) : currentIndex === total - 1 ? (
                <button style={styles.finishButton} onClick={handleFinish}>
                  Finish Quiz 🎯
                </button>
              ) : (
                <button style={styles.navButton} onClick={handleNext}>
                  Next ➡
                </button>
              )}
            </div>

            {/* --- Explanation --- */}
            {submitted && (
              <div style={styles.explanationBox}>
                <p>
                  {submitted.isCorrect ? "✅ Correct!" : "❌ Incorrect."}
                </p>
                <p>
                  <strong>Correct answer:</strong> {current.correct}
                </p>
                {current.explanation && (
                  <p style={{ marginTop: "0.5rem" }}>
                    <strong>Explanation:</strong> {current.explanation}
                  </p>
                )}
              </div>
            )}

            <p style={styles.progress}>
              Question {currentIndex + 1} / {total}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// --- Styles ---
const styles = {
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
    backgroundColor: "rgba(0,0,0,0.35)",
    zIndex: 1,
  },
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
  },
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
  title: {
    marginBottom: "1rem",
    fontSize: "clamp(1.5rem, 5vw, 2.5rem)",
  },
  quizBox: {
    background: "rgba(0, 0, 0, 0.55)",
    borderRadius: "12px",
    padding: "clamp(1rem, 4vw, 2rem)",
    width: "100%",
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
  navButtons: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "1.5rem",
  },
  navButton: {
    backgroundColor: "#2196F3",
    border: "none",
    color: "white",
    padding: "0.75rem 1.25rem",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold",
  },
  submitButton: {
    backgroundColor: "#4CAF50",
    border: "none",
    color: "white",
    padding: "0.75rem 1.25rem",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold",
  },
  finishButton: {
    backgroundColor: "#FF9800",
    border: "none",
    color: "white",
    padding: "0.75rem 1.25rem",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold",
  },
  explanationBox: {
    marginTop: "1.5rem",
    backgroundColor: "rgba(255,255,255,0.1)",
    padding: "1rem",
    borderRadius: "8px",
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
    width: "100%",
    maxWidth: "700px",
    boxShadow: "0 4px 15px rgba(0,0,0,0.3)",
  },
  homeReturnButton: {
    display: "inline-block",
    marginTop: "1.5rem",
    backgroundColor: "#2196F3",
    color: "#fff",
    padding: "clamp(0.75rem, 2.5vw, 1rem) 1.5rem",
    borderRadius: "8px",
    textDecoration: "none",
    fontWeight: "bold",
    fontSize: "clamp(0.9rem, 3vw, 1rem)",
  },
};
