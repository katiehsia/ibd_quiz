// src/components/DeathScreen.jsx
import { Link, useNavigate } from "react-router-dom";
import { commonStyles as styles } from "./commonStyles";

export default function DeathScreen({
  title,
  isDeath = true,
  onAction,
  buttonText,
}) {
  const navigate = useNavigate();

  const handleClick = () => {
    if (isDeath) {
      // Always return to home when dead
      navigate("/");
    } else if (onAction) {
      // Survived → continue to next question or next section
      onAction();
    }
  };

  return (
    <div
      style={{
        ...styles.centerContainer,
        overflowY: "auto",
        justifyContent: "flex-start",
        padding: "2rem 1rem",
      }}
    >
      {/* Outcome title */}
      <h2 style={isDeath ? styles.deathTitle : styles.surviveTitle}>
        {isDeath ? "You Died 💀" : "You Survived 🎉"}
      </h2>

      {/* Message box */}
      <div
        style={{
          ...styles.deathBox,
          marginTop: "1rem",
          marginBottom: "2rem",
        }}
      >
        <p style={styles.deathText}>
          {isDeath
            ? "You made three mistakes in a row. Your journey ends here... But don't worry — you can always try again to reach the summit!"
            : "Congratulations! You’ve conquered the matching challenge! Continue your ascent toward the summit."}
        </p>

        <button onClick={handleClick} style={styles.continueButton}>
          {buttonText || (isDeath ? "Return to Home" : "Continue ➡")}
        </button>
      </div>
    </div>
  );
}
