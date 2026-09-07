import { useState } from "react";
import "./App.css";

function App() {
  const [file, setFile] = useState(null);
  const [jobRole, setJobRole] = useState("");
  const [company, setCompany] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [isDragging, setIsDragging] = useState(false);

  // RoleFit API states
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);

    const dropped = e.dataTransfer.files && e.dataTransfer.files[0];

    if (dropped && dropped.type === "application/pdf") {
      setFile(dropped);
      setError("");
    } else {
      setError("Please upload a valid PDF file.");
    }
  };

  const handleAnalyze = async () => {
    setError("");
    setResult(null);

    if (!file) {
      setError("Please upload your resume in PDF format.");
      return;
    }

    if (!jobRole.trim()) {
      setError("Please enter your target job role.");
      return;
    }

    if (!company.trim()) {
      setError("Please enter the company name.");
      return;
    }

    if (jobDescription.trim().length < 50) {
      setError(
        "Please enter a detailed job description of at least 50 characters."
      );
      return;
    }

    const formData = new FormData();

    formData.append("file", file);
    formData.append("job_role", jobRole);
    formData.append("company", company);
    formData.append("job_description", jobDescription);

    try {
      setLoading(true);

      const response = await fetch("http://127.0.0.1:8000/analyze", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Resume analysis failed.");
      }

      setResult(data);

      console.log("RoleFit Analysis Result:", data);

      setTimeout(() => {
        document
          .getElementById("results")
          ?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } catch (err) {
      console.error("Analysis error:", err);

      setError(
        err.message ||
          "Unable to connect to RoleFit API. Please make sure the backend is running."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleNewAnalysis = () => {
    setResult(null);

    setTimeout(() => {
      document
        .querySelector(".workspace-card")
        ?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const readiness =
    result?.result?.shortlisting_readiness?.toLowerCase() || "medium";

  return (
    <div className="app">

      {/* ================= NAVBAR ================= */}

      <nav className="navbar">
        <div className="nav-brand">
          <div className="nav-mark">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M13 2L3 14h7l-1 8 10-12h-7l1-8z"
                fill="white"
              />
            </svg>
          </div>

          <span>RoleFit</span>
        </div>

        <div className="nav-links">
          <a href="#how-it-works">How It Works</a>
          <a href="#features">Features</a>
        </div>

        <div className="nav-badge">
          <span className="dot"></span>
          AI Resume Analysis
        </div>
      </nav>

      {/* ================= MAIN ================= */}

      <main className="container">

        {/* ================= HERO ================= */}

        <section className="hero">
          <div className="hero-badge">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                d="M12 3v4M12 17v4M3 12h4M17 12h4M5.6 5.6l2.8 2.8M15.6 15.6l2.8 2.8M18.4 5.6l-2.8 2.8M8.4 15.6l2.8-2.8"
                strokeLinecap="round"
              />
            </svg>

            ROLEFIT
          </div>

          <h1>Land Your Next Role With Confidence.</h1>

          <p className="hero-subtitle">
            Upload your resume and compare it against your target job using
            machine learning, semantic analysis, and intelligent skill
            matching.
          </p>

          <div className="hero-visual">

            <div className="hero-chip">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"
                  strokeLinejoin="round"
                />
                <path
                  d="M14 2v6h6"
                  strokeLinejoin="round"
                />
              </svg>

              <span>Resume</span>
            </div>

            <div className="hero-link"></div>

            <div className="match-gauge">
              <div className="match-gauge-inner">
                <strong>
                  {result
                    ? `${Number(result.result.match_score).toFixed(2)}%`
                    : "83%"}
                </strong>
                <span>MATCH</span>
              </div>
            </div>

            <div className="hero-link"></div>

            <div className="hero-chip">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <rect x="3" y="4" width="18" height="16" rx="2" />
                <path
                  d="M8 2v4M16 2v4M3 10h18"
                  strokeLinecap="round"
                />
              </svg>

              <span>Job Description</span>
            </div>

          </div>
        </section>

        {/* ================= ANALYSIS FORM ================= */}

        <section className="workspace-card">

          <div className="workspace-header">
            <h2>Analyze Your Resume</h2>

            <p>
              Fill in the details below to generate your personalized match
              report.
            </p>
          </div>

          {/* FILE UPLOAD */}

          <div className="field-group">
            <label>Upload Resume (PDF)</label>

            <div
              className={`upload-zone ${
                isDragging ? "dragging" : ""
              } ${file ? "has-file" : ""}`}

              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}

              onDragLeave={() => setIsDragging(false)}

              onDrop={handleDrop}
            >
              <input
                type="file"
                accept=".pdf"

                onChange={(e) => {
                  const selectedFile = e.target.files[0];

                  if (selectedFile) {
                    if (selectedFile.type === "application/pdf") {
                      setFile(selectedFile);
                      setError("");
                    } else {
                      setError("Please upload a valid PDF file.");
                    }
                  }
                }}
              />

              <div className="upload-icon">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    d="M12 16V4M12 4l-4 4M12 4l4 4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />

                  <path
                    d="M4 16v3a2 2 0 002 2h12a2 2 0 002-2v-3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>

              <p className="upload-primary">
                Drop your resume here
              </p>

              <p className="upload-secondary">
                or click to browse
              </p>

              {file && (
                <span className="upload-filename">
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                  >
                    <path
                      d="M20 6L9 17l-5-5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>

                  {file.name}
                </span>
              )}
            </div>
          </div>

          {/* JOB ROLE + COMPANY */}

          <div className="target-grid">

            <div className="field-group">
              <label>Target Job Role</label>

              <input
                type="text"
                placeholder="Example: Android Developer"
                value={jobRole}
                onChange={(e) => setJobRole(e.target.value)}
              />
            </div>

            <div className="field-group">
              <label>Company Name</label>

              <input
                type="text"
                placeholder="Example: Google"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
              />
            </div>

          </div>

          {/* JOB DESCRIPTION */}

          <div className="field-group">
            <label>Job Description</label>

            <textarea
              placeholder="Paste the complete job description here..."
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              rows="8"
            />
          </div>

          {/* ANALYZE BUTTON */}

          <button
            className="analyze-btn"
            onClick={handleAnalyze}
            disabled={loading}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                d="M12 3v4M12 17v4M3 12h4M17 12h4M5.6 5.6l2.8 2.8M15.6 15.6l2.8 2.8M18.4 5.6l-2.8 2.8M8.4 15.6l-2.8-2.8"
                strokeLinecap="round"
              />
            </svg>

            {loading
              ? "Analyzing Your Resume..."
              : "Analyze Resume"}
          </button>

          {error && (
            <div className="error-message">
              ⚠️ {error}
            </div>
          )}

        </section>

        {/* ================================================= */}
        {/* PREMIUM RESULTS SECTION */}
        {/* ================================================= */}

        {result && (

          <section
            className="results-section"
            id="results"
          >

            {/* RESULTS HEADER */}

            <div className="results-header">

              <div className="result-badge">
                ✦ ANALYSIS COMPLETE
              </div>

              <h2>Your RoleFit Report</h2>

              <p>
                Personalized analysis for{" "}
                <strong>{result.job_role}</strong> at{" "}
                <strong>{result.company}</strong>
              </p>

            </div>

            {/* MAIN RESULT CARD */}

            <div className="result-card">

              <div className="result-top">

                <div className="result-job-info">

                  <span>TARGET ROLE</span>

                  <h3>{result.job_role}</h3>

                  <p>
                    {result.company}
                  </p>

                  <div className={`readiness-badge ${readiness}`}>
                    <span className="readiness-dot"></span>

                    {result.result.shortlisting_readiness} SHORTLISTING
                    READINESS
                  </div>

                </div>

                {/* MATCH SCORE CIRCLE */}

                <div
                  className="match-score-circle"
                  style={{
                    "--score": Number(result.result.match_score),
                  }}
                >

                  <div className="match-score-content">

                    <strong>
                      {Number(
                        result.result.match_score
                      ).toFixed(1)}
                      %
                    </strong>

                    <span>ROLE MATCH</span>

                  </div>

                </div>

              </div>

              {/* SCORE GRID */}

              <div className="score-grid">

                <div className="score-card">

                  <span className="score-card-label">
                    Overall Match
                  </span>

                  <div className="score-card-value">
                    {Number(result.result.match_score).toFixed(1)}
                    <span>%</span>
                  </div>

                </div>

                <div className="score-card">

                  <span className="score-card-label">
                    ML Compatibility
                  </span>

                  <div className="score-card-value">
                    {Number(result.result.ml_score).toFixed(1)}
                    <span>%</span>
                  </div>

                </div>

                <div className="score-card">

                  <span className="score-card-label">
                    Semantic Similarity
                  </span>

                  <div className="score-card-value">
                    {Number(result.result.semantic_score).toFixed(1)}
                    <span>%</span>
                  </div>

                </div>

              </div>

              {/* SKILL ANALYSIS */}

              <div className="analysis-section">

                <div className="analysis-section-title">

                  <h3>Skill Analysis</h3>

                  <span>
                    Skills detected from your resume and job description
                  </span>

                </div>

                <div className="skill-grid">

                  {/* MATCHED SKILLS */}

                  <div className="skill-box">

                    <h4>✓ Matched Skills</h4>

                    <div className="skill-tags">

                      {result.skill_analysis.matched_skills?.length > 0 ? (

                        result.skill_analysis.matched_skills.map(
                          (skill) => (
                            <span
                              className="skill-tag matched"
                              key={skill}
                            >
                              {skill}
                            </span>
                          )
                        )

                      ) : (

                        <span className="requirement-item">
                          No matching skills detected
                        </span>

                      )}

                    </div>

                  </div>

                  {/* MISSING SKILLS */}

                  <div className="skill-box">

                    <h4>⚠ Missing Skills</h4>

                    {result.skill_analysis.missing_skills?.length > 0 ? (

                      <div className="skill-tags">

                        {result.skill_analysis.missing_skills.map(
                          (skill) => (
                            <span
                              className="skill-tag missing"
                              key={skill}
                            >
                              {skill}
                            </span>
                          )
                        )}

                      </div>

                    ) : (

                      <div className="no-missing-skills">

                        <span>🎉</span>

                        No important skills are missing!

                      </div>

                    )}

                  </div>

                </div>

              </div>

              {/* REQUIREMENTS */}

              {result.requirements && (

                <div className="analysis-section">

                  <div className="analysis-section-title">

                    <h3>Job Requirements</h3>

                    <span>
                      Skills identified from the job description
                    </span>

                  </div>

                  <div className="requirements-grid">

                    {/* MUST HAVE */}

                    <div className="requirement-box must-have">

                      <h4>Must Have</h4>

                      <div className="requirement-list">

                        {result.requirements.must_have?.length > 0 ? (

                          result.requirements.must_have.map(
                            (item) => (
                              <span
                                className="requirement-item"
                                key={item}
                              >
                                {item}
                              </span>
                            )
                          )

                        ) : (

                          <span className="requirement-item">
                            None detected
                          </span>

                        )}

                      </div>

                    </div>

                    {/* IMPORTANT */}

                    <div className="requirement-box important">

                      <h4>Important</h4>

                      <div className="requirement-list">

                        {result.requirements.important?.length > 0 ? (

                          result.requirements.important.map(
                            (item) => (
                              <span
                                className="requirement-item"
                                key={item}
                              >
                                {item}
                              </span>
                            )
                          )

                        ) : (

                          <span className="requirement-item">
                            None detected
                          </span>

                        )}

                      </div>

                    </div>

                    {/* NICE TO HAVE */}

                    <div className="requirement-box nice-to-have">

                      <h4>Nice to Have</h4>

                      <div className="requirement-list">

                        {result.requirements.nice_to_have?.length > 0 ? (

                          result.requirements.nice_to_have.map(
                            (item) => (
                              <span
                                className="requirement-item"
                                key={item}
                              >
                                {item}
                              </span>
                            )
                          )

                        ) : (

                          <span className="requirement-item">
                            None detected
                          </span>

                        )}

                      </div>

                    </div>

                  </div>

                </div>

              )}

              {/* NEW ANALYSIS */}

              <button
                className="new-analysis-btn"
                onClick={handleNewAnalysis}
              >
                ← Start New Analysis
              </button>

            </div>

          </section>

        )}

        {/* ================= FEATURES ================= */}

        <section
          className="features"
          id="features"
        >

          <div className="feature-item">

            <div className="feature-icon">

              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="12" cy="12" r="3" />

                <path
                  d="M12 2v4M12 18v4M4.9 4.9l2.8 2.8M16.3 16.3l2.8 2.8M2 12h4M18 12h4M4.9 19.1l2.8-2.8M16.3 7.7l2.8-2.8"
                  strokeLinecap="round"
                />

              </svg>

            </div>

            <h3>Machine Learning Matching</h3>

            <p>
              Scores your resume against the role using trained ranking models,
              not simple keyword counts.
            </p>

          </div>

          <div className="feature-item">

            <div className="feature-icon">

              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  d="M4 6h16M4 12h10M4 18h16"
                  strokeLinecap="round"
                />
              </svg>

            </div>

            <h3>Semantic Analysis</h3>

            <p>
              Understands meaning and context, so relevant experience is
              recognized even with different wording.
            </p>

          </div>

          <div className="feature-item">

            <div className="feature-icon">

              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  d="M9 3H5a2 2 0 00-2 2v4M15 3h4a2 2 0 012 2v4M9 21H5a2 2 0 01-2-2v-4M15 21h4a2 2 0 002-2v-4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>

            </div>

            <h3>Skill Gap Detection</h3>

            <p>
              Flags specific skills missing from your resume so you know what
              areas need improvement.
            </p>

          </div>

        </section>

      </main>

      <footer className="footer">
        Built by Madhura Pawar · RoleFit
      </footer>

    </div>
  );
}

export default App;