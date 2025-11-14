import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import DeathScreen from "./DeathScreen";
import { commonStyles as styles } from "./commonStyles";

export default function MatchingQuiz({ matchingSheetId, backgroundImg, onSuccess, onFail }) {
  const [pairs, setPairs] = useState([]);
  const [leftItems, setLeftItems] = useState([]);
  const [rightItems, setRightItems] = useState([]);
  const [matchedPairs, setMatchedPairs] = useState({});
  const [flashStates, setFlashStates] = useState({});
  const [hovered, setHovered] = useState(null);
  const [selected, setSelected] = useState(null);
  const [timeLeft, setTimeLeft] = useState(60);
  const [flash, setFlash] = useState(false);
  const [survived, setSurvived] = useState(false);
  const [died, setDied] = useState(false);
  const [columnTitles, setColumnTitles] = useState(["Left", "Right"]);
<<<<<<< HEAD
  const [touchDrag, setTouchDrag] = useState(null);
  const [dragGhost, setDragGhost] = useState(null);
=======
  const [touchDrag, setTouchDrag] = useState(null); // ✅ track touch drag
>>>>>>> parent of cfbd6b8 (mobile drag and drop)
  const timerRef = useRef(null);

  // --- Fetch matching pairs ---
  useEffect(() => {
    const url = `https://docs.google.com/spreadsheets/d/${matchingSheetId}/gviz/tq?tqx=out:json`;
    fetch(url)
      .then((r) => r.text())
      .then((t) => {
        const json = JSON.parse(t.substr(47).slice(0, -2));
        const rows = json.table.rows.map((r) => r.c.map((c) => (c ? c.v : "")));

        if (rows.length > 0) {
          setColumnTitles([rows[0][0] || "Left", rows[0][1] || "Right"]);
        }

        const parsed = rows
          .slice(1)
          .map((r) => ({ left: r[0], right: r[1] }))
          .filter((r) => r.left && r.right);

        setPairs(parsed);
        setLeftItems(parsed.map((p) => p.left));
        setRightItems(shuffle(parsed.map((p) => p.right)));
      })
      .catch((err) => {
        console.error("Error loading matching sheet:", err);
        setDied(true);
      });
  }, [matchingSheetId]);

  // --- Timer ---
  useEffect(() => {
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timerRef.current);
          setDied(true);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, []);

  useEffect(() => {
    if (timeLeft <= 10) setFlash((f) => !f);
  }, [timeLeft]);

  const shuffle = (arr) => {
    const copy = [...arr];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  };

  // --- Matching logic ---
  const attemptMatch = (leftValue, rightValue) => {
    const expectedRight = pairs.find((p) => p.left === leftValue)?.right;
    const isCorrect = expectedRight === rightValue;
    if (!isCorrect) {
      setDied(true);
      return;
    }
    setFlashStates((prev) => ({
      ...prev,
      [leftValue]: "green",
      [rightValue]: "green",
    }));
    setTimeout(() => {
      setFlashStates((prev) => ({
        ...prev,
        [leftValue]: "fade",
        [rightValue]: "fade",
      }));
      setMatchedPairs((prev) => ({ ...prev, [leftValue]: rightValue }));
    }, 600);
  };

  // --- Desktop drag/drop ---
  const handleDragStart = (e, value, side) => {
    e.dataTransfer.setData("text/plain", JSON.stringify({ value, side }));
  };
  const handleDragOver = (e, value) => {
    e.preventDefault();
    setHovered(value);
  };
  const handleDragLeave = () => setHovered(null);
  const handleDrop = (e, dropValue, dropSide) => {
    e.preventDefault();
    setHovered(null);
    const { value, side } = JSON.parse(e.dataTransfer.getData("text/plain"));
    if (side === dropSide) return;
    const leftValue = side === "left" ? value : dropValue;
    const rightValue = side === "right" ? value : dropValue;
    attemptMatch(leftValue, rightValue);
  };

<<<<<<< HEAD
  // --- Mobile touch drag/drop (true drag experience) ---
  const handleTouchStart = (value, side, e) => {
    e.preventDefault();
    const touch = e.touches[0];
    const ghost = document.createElement("div");
    ghost.innerText = value;
    Object.assign(ghost.style, {
      position: "fixed",
      top: `${touch.clientY - 20}px`,
      left: `${touch.clientX - 60}px`,
      padding: "6px 10px",
      background: "rgba(255,255,255,0.8)",
      color: "#000",
      borderRadius: "8px",
      boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
      zIndex: 9999,
      pointerEvents: "none",
      fontSize: "14px",
      fontWeight: "600",
    });
    document.body.appendChild(ghost);
    setDragGhost(ghost);
    setTouchDrag({ value, side });
  };

  const handleTouchMove = (e) => {
    if (!touchDrag || !dragGhost) return;
    const touch = e.touches[0];
    e.preventDefault();

    // Move ghost
    dragGhost.style.top = `${touch.clientY - 20}px`;
    dragGhost.style.left = `${touch.clientX - 60}px`;

    // Detect hovered element
    const elem = document.elementFromPoint(touch.clientX, touch.clientY);
    if (!elem) return;
    const targetValue = elem.getAttribute("data-value");
    const targetSide = elem.getAttribute("data-side");
    if (targetValue && targetSide && targetSide !== touchDrag.side) {
      setHovered(targetValue);
    } else {
      setHovered(null);
    }
  };

  const handleTouchEnd = (e) => {
    if (!touchDrag) return;
    const touch = e.changedTouches[0];
    const elem = document.elementFromPoint(touch.clientX, touch.clientY);

    // Remove ghost
    if (dragGhost) {
      dragGhost.remove();
      setDragGhost(null);
    }

    if (elem) {
      const targetValue = elem.getAttribute("data-value");
      const targetSide = elem.getAttribute("data-side");
      if (targetValue && targetSide && targetSide !== touchDrag.side) {
        const leftValue = touchDrag.side === "left" ? touchDrag.value : targetValue;
        const rightValue = touchDrag.side === "right" ? touchDrag.value : targetValue;
        attemptMatch(leftValue, rightValue);
      }
    }

    setHovered(null);
    setTouchDrag(null);
=======
  // --- Touch drag/drop for mobile ---
  const handleTouchStart = (value, side) => {
    setTouchDrag({ value, side });
  };
  const handleTouchEnd = (value, side) => {
    if (!touchDrag || touchDrag.side === side) return;
    const leftValue = touchDrag.side === "left" ? touchDrag.value : value;
    const rightValue = touchDrag.side === "right" ? touchDrag.value : value;
    setTouchDrag(null);
    attemptMatch(leftValue, rightValue);
>>>>>>> parent of cfbd6b8 (mobile drag and drop)
  };

  // --- Click-to-match fallback ---
  const handleClick = (value, side) => {
    if (!selected) {
      setSelected({ value, side });
      return;
    }
    if (selected.side === side) {
      setSelected({ value, side });
      return;
    }
    const leftValue = selected.side === "left" ? selected.value : value;
    const rightValue = selected.side === "right" ? selected.value : value;
    attemptMatch(leftValue, rightValue);
    setSelected(null);
  };

  // --- Completion check ---
  useEffect(() => {
    if (Object.keys(matchedPairs).length === pairs.length && pairs.length > 0) {
      clearInterval(timerRef.current);
      setSurvived(true);
    }
  }, [matchedPairs, pairs]);

  const getBgColor = (item) => {
    const flashState = flashStates[item];
    if (flashState === "green") return "rgba(76,175,80,0.5)";
    if (flashState === "fade") return "rgba(255,255,255,0.05)";
    return "rgba(255,255,255,0.1)";
  };
  const getOpacity = (item) => (flashStates[item] === "fade" ? 0.3 : 1);

  const timerBg =
    timeLeft <= 10
      ? flash
        ? "rgba(255,0,0,0.9)"
        : "rgba(255,0,0,0.35)"
      : "rgba(255,255,255,0.06)";

  // --- Death / Survival screens ---
  if (survived || died) {
    return (
      <div style={styles.container}>
        <div style={{ ...styles.background, backgroundImage: `url(${backgroundImg})` }} />
        <div style={styles.overlay} />
        <Link to="/" style={styles.homeButton}>
          ⬅ Home
        </Link>
        <div style={styles.content}>
          <h1 style={styles.title}>Matching Pop Quiz</h1>
          <div style={{ ...styles.quizBox, maxHeight: "85vh" }}>
            <DeathScreen
              title="Matching Pop Quiz"
              isDeath={died}
              onAction={died ? onFail : onSuccess}
              buttonText={died ? "Return to Home" : "Continue ➡"}
            />
          </div>
        </div>
      </div>
    );
  }

  // --- Main Matching UI ---
  return (
    <div style={styles.container}>
      <div style={{ ...styles.background, backgroundImage: `url(${backgroundImg})` }} />
      <div style={styles.overlay} />
      <Link to="/" style={styles.homeButton}>
        ⬅ Home
      </Link>
      <div style={styles.content}>
        <h1 style={styles.title}>Matching Pop Quiz</h1>
<<<<<<< HEAD
        <div
          style={{
            ...styles.quizBox,
            maxHeight: "85vh",
            paddingBottom: "3rem",

            // NEW — prevents horizontal shifting during touch drag
            overflowX: "hidden",
            width: "100%",
            position: "relative",
          }}
        >
          <p>Match each {columnTitles[0]} with its correct {columnTitles[1]}. One mistake = instant death.</p>
=======
        <div style={{ ...styles.quizBox, maxHeight: "85vh", paddingBottom: "3rem" }}>
          <p>
            Match each {columnTitles[0]} with its correct {columnTitles[1]}. One mistake =
            instant death.
          </p>
>>>>>>> parent of cfbd6b8 (mobile drag and drop)
          <div style={{ ...styles.timer, background: timerBg }}>⏱ {timeLeft}s</div>

          <div style={styles.matchingContainer}>
            {/* Left column */}
            <div style={styles.matchingColumn}>
              <h3 style={{ textAlign: "center", marginBottom: "0.5rem" }}>{columnTitles[0]}</h3>
              {leftItems.map((l) => (
                <div
                  key={l}
                  draggable={!matchedPairs[l]}
                  onDragStart={(e) => handleDragStart(e, l, "left")}
                  onDragOver={(e) => handleDragOver(e, l)}
                  onDragLeave={handleDragLeave}
                  onDrop={(e) => handleDrop(e, l, "left")}
                  onTouchStart={() => handleTouchStart(l, "left")}
                  onTouchEnd={() => handleTouchEnd(l, "left")}
                  onClick={() => handleClick(l, "left")}
                  style={{
                    ...styles.matchingItem,
                    backgroundColor: getBgColor(l),
                    opacity: getOpacity(l),
                    border:
                      hovered === l
                        ? "2px dashed #FFD54F"
                        : selected?.value === l
                        ? "2px solid #FFD54F"
                        : "2px solid rgba(255,255,255,0.25)",
                  }}
                >
                  {l}
                </div>
              ))}
            </div>

            {/* Right column */}
            <div style={styles.matchingColumn}>
              <h3 style={{ textAlign: "center", marginBottom: "0.5rem" }}>{columnTitles[1]}</h3>
              {rightItems.map((r) => (
                <div
                  key={r}
                  draggable={!Object.values(matchedPairs).includes(r)}
                  onDragStart={(e) => handleDragStart(e, r, "right")}
                  onDragOver={(e) => handleDragOver(e, r)}
                  onDragLeave={handleDragLeave}
                  onDrop={(e) => handleDrop(e, r, "right")}
                  onTouchStart={() => handleTouchStart(r, "right")}
                  onTouchEnd={() => handleTouchEnd(r, "right")}
                  onClick={() => handleClick(r, "right")}
                  style={{
                    ...styles.matchingItem,
                    backgroundColor: getBgColor(r),
                    opacity: getOpacity(r),
                    border:
                      hovered === r
                        ? "2px dashed #FFD54F"
                        : selected?.value === r
                        ? "2px solid #FFD54F"
                        : "2px solid rgba(255,255,255,0.25)",
                  }}
                >
                  {r}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
