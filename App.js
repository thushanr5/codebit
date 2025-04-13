import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import PdfSummaryTool from "./PdfExtracter";

import MindMap from "./MindMap";
import StudyAids from "./StudyAids";
import MyNavBar from "./Navbar";
import FlashCards from "./FlashCards";

function Home() {
  return (
    <div className="home">
      <section>
        <h2 className="section-title">Welcome to StudySync</h2>
        <p className="section-subtitle">Transform how you study with interactive tools and AI-powered aids.</p>
      </section>

      <section className="mission">
        <h2>Mission Statement</h2>
        <p>
          Our mission is to help students transform lecture materials, meetings, and videos 
          into interactive, visual, and AI-powered study aids — like mindmaps, flashcards, 
          and chatbot-driven Q&A — so that anyone can learn smarter, not harder.
        </p>
      </section>

      <section className="demo">
        <h2>Demonstration</h2>
        <img
          src="https://placehold.co/600x300?text=Demo+Mindmap"
          alt="Demo Mind Map"
          className="demo-image"
        />
      </section>
    </div>
  );
}

function App() {
  const [message, setMessage] = useState("");
  const [error, setError] = useState(null);

  useEffect(() => {
    const apiUrl = "http://localhost:4040/";
    fetch(apiUrl)
      .then((res) => res.ok ? res.text() : Promise.reject(`HTTP error! Status: ${res.status}`))
      .then(setMessage)
      .catch((err) => setError(err.message));
  }, []);

  return (
    <Router>
      <div className="app-container">
        {/* Header */}
        <header className="app-header text-center py-4">
          <h1 className="title">StudySync</h1>
        </header>

        {/* Navigation */}
        <MyNavBar />

        {/* Page Content */}
        <div className="page-content container-fluid py-4">
          {error && <p className="error text-danger">Error: {error}</p>}
          {message && <p className="message text-success">Message: {message}</p>}

          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/mindmap" element={<MindMap />} />
            <Route path="/studyaids" element={<StudyAids />} />
            <Route path="/flashcards" element={<FlashCards />} />
            <Route path="/pdfextracter" element={<PdfSummaryTool/>} />
          </Routes>
        </div>

        <footer className="text-center text-muted mt-5 pb-3 border-top pt-3">
         © 2025 • Built with ❤️ by <strong>StudySync</strong>
        </footer>

      </div>
    </Router>
  );
}

export default App;
