import { HashRouter as Router, Routes, Route, Link, useParams } from "react-router-dom";
import Quiz from "./components/Quiz";
import { MODULES } from "./data/modules";

function Home() {
  return (
    <div style={styles.home}>
      <h1>Dr. Jangi's IBD Learning Home</h1>

      <div style={styles.buttonContainer}>
        {/* Pre Survey */}
        <a 
          href="https://google.com" 
          target="_blank" 
          rel="noopener noreferrer"
          style={styles.surveyButton}
        >
          Pre Survey
        </a>

        {/* Quiz Modules */}
        {MODULES.map((m) => (
          <Link key={m.id} to={`/quiz/${m.id}`} style={styles.moduleButton}>
            {m.name}
          </Link>
        ))}

        {/* Post Survey */}
        <a 
          href="https://google.com" 
          target="_blank" 
          rel="noopener noreferrer"
          style={styles.surveyButton}
        >
          Post Survey
        </a>
      </div>
    </div>
  );
}

function QuizWrapper() {
  const { moduleId } = useParams();
  const module = MODULES.find((m) => m.id === moduleId);
  if (!module) return <p>Module not found</p>;
  // pass matchingSheetId if present in module object
  return <Quiz sheetId={module.sheetId} matchingSheetId={module.matchingSheetId} title={module.name} />;
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/quiz/:moduleId" element={<QuizWrapper />} />
      </Routes>
    </Router>
  );
}

const styles = {
  home: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "100vh",
    backgroundColor: "#f5f5f5",
    textAlign: "center",
    fontFamily: "sans-serif",
    padding: "2rem",
  },
  buttonContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "1.2rem",
    marginTop: "2rem",
  },
  moduleButton: {
    backgroundColor: "#2196F3",
    color: "white",
    textDecoration: "none",
    padding: "0.75rem 2rem",
    borderRadius: "8px",
    fontSize: "1.1rem",
    transition: "background-color 0.2s",
    width: "220px",
    textAlign: "center",
  },
  surveyButton: {
    backgroundColor: "#20c997",
    color: "white",
    textDecoration: "none",
    padding: "0.75rem 2rem",
    borderRadius: "8px",
    fontSize: "1.1rem",
    transition: "background-color 0.2s",
    width: "220px",
    textAlign: "center",
  },
};
