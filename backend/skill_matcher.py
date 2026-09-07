import re


# =========================================================
# SKILL DATABASE
# Canonical skill name : possible variations
# =========================================================

SKILL_ALIASES = {
    "Python": ["python"],
    "Java": ["java"],
    "C++": ["c++", "cpp"],
    "SQL": ["sql"],
    "MySQL": ["mysql"],
    "Excel": ["excel", "microsoft excel"],
    "Pandas": ["pandas"],
    "NumPy": ["numpy"],
    "Power BI": ["power bi", "powerbi"],
    "Statistics": ["statistics", "statistical analysis"],
    "Data Visualization": [
        "data visualization",
        "data visualisation"
    ],

    # Web Development
    "React.js": [
        "react",
        "react.js",
        "reactjs"
    ],

    "Node.js": [
        "node.js",
        "nodejs",
        "node"
    ],

    "JavaScript": [
        "javascript",
        "js"
    ],

    "HTML": [
        "html",
        "html5"
    ],

    "CSS": [
        "css",
        "css3"
    ],

    # Backend / Frameworks
    "Spring Boot": [
        "spring boot",
        "springboot"
    ],

    "MongoDB": [
        "mongodb",
        "mongo db",
        "mongo"
    ],

    "Firebase": ["firebase"],
    "Android": ["android"],

    # Cloud
    "AWS": [
        "aws",
        "amazon web services"
    ],

    "Azure": [
        "azure",
        "microsoft azure"
    ],

    "GCP": [
        "gcp",
        "google cloud platform",
        "google cloud"
    ],

    # AI / ML
    "Machine Learning": [
        "machine learning",
        "ml"
    ],

    "TensorFlow": [
        "tensorflow",
        "tf"
    ],

    # Tools
    "Git": [
        "git",
        "github",
        "gitlab"
    ]
}


# =========================================================
# HELPER FUNCTION
# Check whether a skill alias exists safely in text
# =========================================================

def skill_exists(text, alias):

    alias = alias.lower()

    # Special handling for skills containing symbols
    if alias in ["c++", "c#"]:

        return alias in text

    # Normal word boundary matching
    pattern = r"(?<!\w)" + re.escape(alias) + r"(?!\w)"

    return bool(re.search(pattern, text))


# =========================================================
# EXTRACT SKILLS
# =========================================================

def extract_skills(text):

    text = text.lower()

    found_skills = []

    for canonical_skill, aliases in SKILL_ALIASES.items():

        for alias in aliases:

            if skill_exists(text, alias):

                found_skills.append(canonical_skill)

                # Stop checking aliases once skill is found
                break

    return sorted(set(found_skills))


# =========================================================
# COMPARE RESUME WITH JOB DESCRIPTION
# =========================================================

def compare_skills(resume_text, job_description):

    resume_skills = set(extract_skills(resume_text))

    job_skills = set(extract_skills(job_description))

    matched_skills = sorted(
        resume_skills.intersection(job_skills)
    )

    missing_skills = sorted(
        job_skills.difference(resume_skills)
    )

    return {
        "resume_skills": sorted(resume_skills),

        "required_skills": sorted(job_skills),

        "matched_skills": matched_skills,

        "missing_skills": missing_skills
    }