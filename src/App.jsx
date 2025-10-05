import { BrowserRouter as Router, Routes, Route, Link, useParams } from "react-router-dom";
import Quiz from "./components/Quiz";
import { MODULES } from "./data/modules";

function Home() {
  return (
    <div style={styles.home}>
      <h1>Medical Quiz Hub</h1>
      <p>Select a module:</p>
      <div style={styles.modules}>
        {MODULES.map((m) => (
          <Link key={m.id} to={`/quiz/${m.id}`} style={styles.moduleButton}>
            {m.name}
          </Link>
        ))}
      </div>
    </div>
  );
}

function QuizWrapper() {
  const { moduleId } = useParams();
  const module = MODULES.find((m) => m.id === moduleId);
  if (!module) return <p>Module not found</p>;
  return <Quiz sheetId={module.sheetId} title={module.name} />;
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
  },
  modules: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
    marginTop: "1.5rem",
  },
  moduleButton: {
    backgroundColor: "#2196F3",
    color: "white",
    textDecoration: "none",
    padding: "0.75rem 2rem",
    borderRadius: "8px",
    fontSize: "1.1rem",
    transition: "background-color 0.2s",
  },
};
