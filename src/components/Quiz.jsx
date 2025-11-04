import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Confetti from "react-confetti";
import MatchingQuiz from "./MatchingQuiz";
import DeathScreen from "./DeathScreen";
import mountainImage from "../assets/mountain.jpg";
import mountainImage2 from "../assets/mountain2.jpg";
import hikerImage from "../assets/hiker.png";
import { commonStyles as styles } from "./commonStyles";

export default function Quiz({
  sheetId,
  title,
  matchingSheetIds = [], // ✅ array of sheet IDs for matching quizzes
  matchingTriggerPoints = [3], // ✅ array of thresholds for triggering
}) {
  const mountainImages = [mountainImage, mountainImage2];
  const numMountains = mountainImages.length;

  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [submittedAnswers, setSubmittedAnswers] = useState({});
  const [score, setScore] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongStreak, setWrongStreak] = useState(0);
  const [showMatching, setShowMatching] = useState(false);
  const [matchingCount, setMatchingCount] = useState(0); // ✅ number of completed matching quizzes
  const [youDied, setYouDied] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [bgIndex, setBgIndex] = useState(0);
  const [hikerPos, setHikerPos] = useState({ bottom: "0%", left: "20%" });

  const SHEET_URL = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:json`;

  // --- Load main quiz questions ---
  useEffect(() => {
    fetch(SHEET_URL)
      .then((res) => res.text())
      .then((text) => {
        const json = JSON.parse(text.substr(47).slice(0, -2));
        const rows = json.table.rows.map((r) =>
          r.c.map((cell) => (cell ? cell.v : ""))
        );
        let formatted = rows.map(
          ([question, optA, optB, optC, optD, correct, explanation]) => ({
            question,
            options: shuffleArray([optA, optB, optC, optD]),
            correct,
            explanation,
          })
        );
        formatted = shuffleArray(formatted).slice(0, 20);
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

  // --- Hiker movement ---
  const updateHikerPosition = (totalCorrect) => {
    const segmentSize = total / numMountains;
    const mountainStage = Math.floor((totalCorrect - 1) / segmentSize);
    const localCorrect = totalCorrect - mountainStage * segmentSize;
    const clampedMountain = Math.min(mountainStage, numMountains - 1);
    const step = Math.min(localCorrect / segmentSize, 1);

    const bottomPct = 5 + step * 80;
    const leftPct = 20 + step * 30;

    if (clampedMountain !== bgIndex) {
      setBgIndex(clampedMountain);
      setHikerPos({ bottom: "0%", left: "20%" });
      return;
    }

    setHikerPos({
      bottom: `${bottomPct}%`,
      left: `${leftPct}%`,
    });
  };

  const handleSelect = (answer) => {
    if (!submitted)
      setSelectedAnswers({ ...selectedAnswers, [currentIndex]: answer });
  };

  const handleSubmitAnswer = () => {
    if (!selected) return;
    const isCorrect = selected === current.correct;

    if (!submittedAnswers[currentIndex]) {
      setSubmittedAnswers({
        ...submittedAnswers,
        [currentIndex]: { selected, isCorrect },
      });

      if (isCorrect) {
        const newScore = score + 1;
        const newCorrectCount = correctCount + 1;
        setScore(newScore);
        setCorrectCount(newCorrectCount);
        setWrongStreak(0);
        updateHikerPosition(newScore);

        // ✅ Check if a matching quiz should trigger
        const nextTrigger = matchingTriggerPoints[matchingCount];
        if (nextTrigger && newCorrectCount >= nextTrigger && !showMatching) {
          setShowMatching(true);
          return;
        }
      } else {
        const newStreak = wrongStreak + 1;
        setWrongStreak(newStreak);
        if (newStreak >= 3) setYouDied(true);
      }
    }
  };

  const handleNext = () => {
    if (currentIndex < total - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handleFinish = () => {
    const percent = (score / total) * 100;
    if (percent >= 80) setShowConfetti(true);
    setShowResults(true);
  };

  const backgroundImg = mountainImages[Math.min(bgIndex, numMountains - 1)];

  // --- Matching quiz overlay (multi-support) ---
  if (showMatching) {
    // ✅ pick matching sheet ID based on current matchingCount
    const currentSheetId =
      matchingSheetIds[matchingCount] ||
      matchingSheetIds[matchingSheetIds.length - 1]; // fallback to last if fewer IDs

    return (
      <MatchingQuiz
        matchingSheetId={currentSheetId}
        backgroundImg={backgroundImg}
        onSuccess={() => {
          setMatchingCount((n) => n + 1);
          setShowMatching(false);
          handleNext();
        }}
        onFail={() => setYouDied(true)}
      />
    );
  }

  // --- You Died screen ---
  if (youDied) {
    return (
      <div style={styles.container}>
        <div
          style={{ ...styles.background, backgroundImage: `url(${backgroundImg})` }}
        />
        <div style={styles.overlay} />
        <Link to="/" style={styles.homeButton}>
          ⬅ Home
        </Link>
        <div style={styles.content}>
          <h1 style={styles.title}>{title}</h1>
          <div style={styles.quizBox}>
            <DeathScreen title={title} isDeath={true} />
          </div>
        </div>
      </div>
    );
  }

  // --- Main quiz view ---
  return (
    <div style={styles.container}>
      <div
        style={{ ...styles.background, backgroundImage: `url(${backgroundImg})` }}
      />
      <div style={styles.overlay} />

      {/* 🧗‍♂️ Hiker */}
      <img
        src={hikerImage}
        alt="Hiker"
        style={{
          ...styles.hiker,
          position: "absolute",
          bottom: hikerPos.bottom,
          left: hikerPos.left,
          width: "70px",
          transition: "bottom 0.8s ease-in-out, left 0.8s ease-in-out",
          zIndex: 3,
        }}
      />

      <Link to="/" style={styles.homeButton}>
        ⬅ Home
      </Link>

      <div style={styles.content}>
        {showConfetti && <Confetti />}
        <h1 style={styles.title}>{title}</h1>

        <div style={styles.quizBox}>
          {showResults ? (
            <div style={{ animation: "fadeIn 1s ease-in-out" }}>
              <h2>Quiz Complete 🎉</h2>
              <p>
                Your score: {score} / {total} ({Math.round((score / total) * 100)}%)
              </p>

              <Link to="/" style={styles.continueButton}>
                Back to Home
              </Link>
            </div>
          ) : (
            <>
              <h2 style={styles.question}>{current.question}</h2>

              <div style={styles.optionsContainer}>
                {current.options.map((opt, i) => {
                  const isSelected = selected === opt;
                  const isCorrectAnswer = current.correct === opt;
                  const isSubmitted = !!submitted;
                  let background = "rgba(255,255,255,0.1)";
                  if (isSubmitted) {
                    if (isCorrectAnswer) background = "rgba(76,175,80,0.4)";
                    else if (isSelected) background = "rgba(244,67,54,0.4)";
                  } else if (isSelected) background = "rgba(255,255,255,0.25)";
                  return (
                    <button
                      key={i}
                      style={{
                        ...styles.optionButton,
                        backgroundColor: background,
                      }}
                      onClick={() => handleSelect(opt)}
                      disabled={isSubmitted}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>

              {/* Nav buttons */}
              <div style={styles.navButtons}>
                <button
                  style={{
                    ...styles.navButton,
                    opacity: currentIndex === 0 ? 0.5 : 1,
                  }}
                  disabled={currentIndex === 0}
                  onClick={() => setCurrentIndex(currentIndex - 1)}
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

              {/* Explanation */}
              {submitted && (
                <div style={styles.explanationBox}>
                  <p>{submitted.isCorrect ? "✅ Correct!" : "❌ Incorrect."}</p>
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
            </>
          )}
        </div>
      </div>
    </div>
  );
}
