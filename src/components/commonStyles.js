// src/components/commonStyles.js
// Shared layout and visual styles for Quiz, MatchingQuiz, and DeathScreen components.

export const commonStyles = {
  // --- Global container and background ---
  container: {
    position: "relative",
    width: "100vw",
    height: "100vh",
    overflow: "hidden",
    fontFamily: "sans-serif",
    color: "#fff",
    textShadow: "0 1px 3px rgba(0,0,0,0.7)",
  },

  background: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    backgroundSize: "cover",
    backgroundPosition: "center",
    zIndex: 0,
    transition: "background-image 1s ease-in-out",
  },

  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    backgroundColor: "rgba(0,0,0,0.35)",
    zIndex: 1,
  },

  // --- Navigation / header elements ---
  homeButton: {
    position: "fixed",
    top: "1rem",
    left: "1rem",
    textDecoration: "none",
    color: "#fff",
    background: "rgba(0,0,0,0.4)",
    padding: "0.6rem 1rem",
    borderRadius: "8px",
    zIndex: 4,
    fontWeight: "bold",
    fontSize: "clamp(0.8rem, 2.5vw, 1rem)",
  },

  // --- Layout containers ---
  content: {
    position: "relative",
    zIndex: 3,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "flex-start",
    height: "100%",
    paddingTop: "3rem",
    gap: "1rem",
    overflowY: "auto",
  },

  title: {
    fontSize: "clamp(1.8rem, 5vw, 2.5rem)",
    fontWeight: "700",
    textAlign: "center",
    marginBottom: "1rem",
  },

  // --- Main content box (scrollable quiz/matching box) ---
quizBox: {
  background: "rgba(0, 0, 0, 0.55)",
  borderRadius: "12px",
  padding: "clamp(1rem, 4vw, 2rem)",
  paddingBottom: "3rem",       // ✅ gives bottom breathing room
  width: "90%",
  maxWidth: "800px",
  maxHeight: "85vh",           // ✅ more vertical space
  overflowY: "auto",           // ✅ single scrollable container
  overflowX: "hidden",
  textAlign: "center",
  boxShadow: "0 4px 15px rgba(0,0,0,0.3)",
  scrollbarWidth: "thin",
  scrollbarColor: "rgba(255,255,255,0.3) transparent",
},




  // --- Answer options layout ---
  optionsContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "1rem",
    marginTop: "1.5rem",
    marginBottom: "1.5rem",
    width: "100%",
  },

  optionButton: {
    display: "block",
    width: "100%",
    maxWidth: "600px",
    backgroundColor: "rgba(255,255,255,0.1)",
    color: "#fff",
    border: "2px solid rgba(255,255,255,0.25)",
    borderRadius: "10px",
    padding: "0.9rem 1.2rem",
    fontSize: "1.05rem",
    cursor: "pointer",
    transition: "background-color 0.25s ease, transform 0.2s ease",
    textAlign: "left",
  },

  optionButtonHover: {
    backgroundColor: "rgba(255,255,255,0.25)",
    transform: "scale(1.02)",
  },

  // --- Navigation buttons ---
  navButtons: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexWrap: "wrap",
    gap: "1rem",
    marginTop: "1.5rem",
    marginBottom: "1rem",
  },

  navButton: {
    backgroundColor: "#2196F3",
    border: "none",
    color: "white",
    padding: "0.9rem 1.5rem",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold",
    fontSize: "1rem",
    minWidth: "120px",
    transition: "background-color 0.25s ease, transform 0.2s ease",
  },

  submitButton: {
    backgroundColor: "#4CAF50",
    border: "none",
    color: "white",
    padding: "1rem 1.6rem",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold",
    fontSize: "1rem",
    minWidth: "140px",
    transition: "background-color 0.25s ease, transform 0.2s ease",
  },

  finishButton: {
    backgroundColor: "#FF9800",
    border: "none",
    color: "white",
    padding: "1rem 1.6rem",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold",
    fontSize: "1rem",
    minWidth: "140px",
    transition: "background-color 0.25s ease, transform 0.2s ease",
  },

  explanationBox: {
    marginTop: "1.5rem",
    backgroundColor: "rgba(255,255,255,0.1)",
    padding: "1rem",
    borderRadius: "8px",
    lineHeight: "1.5",
  },

  progress: {
    marginTop: "1.2rem",
    marginBottom: "2rem",       // ⬆️ added extra space below
    fontSize: "clamp(0.9rem, 3vw, 1rem)",
    textAlign: "center",
    opacity: 0.9,
  },

  timer: {
    display: "inline-block",
    padding: "0.5rem 1rem",
    borderRadius: "8px",
    marginBottom: "1rem",
    fontWeight: "bold",
  },

  // --- Hiker and progress visuals ---
  hiker: {
    position: "absolute",
    bottom: "0px",
    left: "20px",
    width: "60px",
    zIndex: 2,
    transition: "bottom 0.5s ease-in-out, left 0.5s ease-in-out",
  },

  // --- Matching quiz layout ---
  matchingContainer: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: "2rem",
    flexWrap: "wrap",
    marginTop: "1.5rem",
    width: "100%",
    },

  matchingColumn: {
    flex: "1 1 45%",
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
    alignItems: "stretch",
    marginBottom: "2rem",   // ✅ extra safety
  },

  matchingItem: {
    backgroundColor: "rgba(255,255,255,0.1)",
    border: "2px solid rgba(255,255,255,0.25)",
    borderRadius: "8px",
    padding: "0.75rem 1rem",
    fontSize: "1rem",
    color: "#fff",
    cursor: "pointer",
    textAlign: "center",
    userSelect: "none",
    transition:
      "background-color 0.25s ease, transform 0.2s ease, opacity 0.6s ease",
  },

  matchingItemFade: {
    opacity: 0.3,
    transform: "scale(0.97)",
  },
};

// --- Death / Survive shared screen elements ---
commonStyles.centerContainer = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "flex-start",
  width: "100%",
  height: "100%",
  overflowY: "auto",
  padding: "2rem 1rem",
  gap: "1rem",
};

commonStyles.deathBox = {
  background: "rgba(0,0,0,0.6)",
  borderRadius: "12px",
  padding: "2rem",
  width: "90%",
  maxWidth: "700px",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  textAlign: "center",
  boxShadow: "0 4px 15px rgba(0,0,0,0.3)",
};

commonStyles.deathTitle = {
  fontSize: "3rem",
  fontWeight: "900",
  letterSpacing: "1.5px",
  textTransform: "uppercase",
  color: "#FF5252",
  textShadow: "0 0 20px rgba(255,0,0,0.8)",
  marginBottom: "0.5rem",
};

commonStyles.surviveTitle = {
  fontSize: "3rem",
  fontWeight: "900",
  letterSpacing: "1.2px",
  textTransform: "uppercase",
  color: "#81C784",
  textShadow: "0 0 15px rgba(76,175,80,0.8)",
  marginBottom: "0.5rem",
};

commonStyles.deathText = {
  fontSize: "1.2rem",
  marginBottom: "1.5rem",
  color: "#fff",
  lineHeight: "1.5",
  maxWidth: "600px",
};

commonStyles.continueButton = {
  display: "inline-block",
  backgroundColor: "#2196F3",
  color: "#fff",
  padding: "clamp(0.75rem, 2.5vw, 1rem) 1.5rem",
  borderRadius: "8px",
  textDecoration: "none",
  fontWeight: "bold",
  cursor: "pointer",
  transition: "background-color 0.2s",
  border: "none",
};

commonStyles.continueButtonHover = { backgroundColor: "#1976D2" };