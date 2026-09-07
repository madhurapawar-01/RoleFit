# RoleFit

RoleFit is an intelligent resume and job description analysis system designed to help users understand how well their resume aligns with a specific job role.

The system analyzes a resume against a job description using machine learning, semantic similarity, and skill-based matching to generate a structured compatibility report.

---

## Overview

Job applications often require candidates to understand whether their skills and experience align with a particular role.

RoleFit simplifies this process by allowing users to upload their resume and provide details about a target job. The system then analyzes both documents and provides insights into:

- Overall role compatibility
- Machine learning compatibility score
- Semantic similarity
- Matched skills
- Missing skills
- Job requirements categorized by priority

RoleFit is designed as a decision-support tool and does not predict hiring outcomes.

---

## Features

### Resume Analysis

Upload a resume in PDF format and extract relevant textual information for analysis.

### Role Compatibility Score

Generates an overall compatibility score by combining multiple analysis techniques.

### Machine Learning Matching

Uses a trained machine learning model to evaluate resume and job description compatibility.

### Semantic Similarity

Analyzes contextual similarity between the resume and job description, allowing related experience to be recognized even when different wording is used.

### Skill Gap Detection

Identifies:

- Skills present in both the resume and job description
- Skills required for the role but missing from the resume

### Job Requirement Analysis

Categorizes detected job requirements into:

- Must Have
- Important
- Nice to Have

---

## System Architecture

```text
Resume PDF
    │
    ▼
Resume Parser
    │
    ▼
Text Extraction
    │
    ├──────────────► Skill Matcher
    │
    ├──────────────► Semantic Analysis
    │
    └──────────────► Machine Learning Model
                         │
                         ▼
                  Match Score Generation
                         │
                         ▼
                 Requirement Analysis
                         │
                         ▼
                   RoleFit Report
