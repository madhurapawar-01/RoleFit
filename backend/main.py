from fastapi import FastAPI, UploadFile, File, Form, HTTPException
import tempfile
import os

from fastapi.middleware.cors import CORSMiddleware

from backend.resume_parser import extract_resume_text
from backend.matcher import predict_match
from backend.skill_matcher import compare_skills
from backend.requirement_analyzer import extract_requirements
from backend.recommendation_engine import generate_recommendations


app = FastAPI(
    title="RoleFit API",
    version="1.1.0"
)


# =========================================================
# CORS
# =========================================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# =========================================================
# HOME
# =========================================================

@app.get("/")
def home():
    return {
        "message": "RoleFit API is running"
    }


# =========================================================
# HEALTH CHECK
# =========================================================

@app.get("/health")
def health():
    return {
        "status": "healthy"
    }


# =========================================================
# RESUME ANALYSIS
# =========================================================

@app.post("/analyze")
async def analyze_resume(
    file: UploadFile = File(...),
    job_role: str = Form(...),
    company: str = Form(...),
    job_description: str = Form(...)
):

    # -----------------------------------------------------
    # VALIDATION
    # -----------------------------------------------------

    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(
            status_code=400,
            detail="Only PDF resumes are supported."
        )

    if not job_role.strip():
        raise HTTPException(
            status_code=400,
            detail="Job role is required."
        )

    if not company.strip():
        raise HTTPException(
            status_code=400,
            detail="Company name is required."
        )

    if len(job_description.strip()) < 50:
        raise HTTPException(
            status_code=400,
            detail="Job description is too short."
        )


    contents = await file.read()

    if not contents:
        raise HTTPException(
            status_code=400,
            detail="The uploaded PDF is empty."
        )


    temp_path = None

    try:

        # -------------------------------------------------
        # SAVE TEMPORARY PDF
        # -------------------------------------------------

        with tempfile.NamedTemporaryFile(
            delete=False,
            suffix=".pdf"
        ) as temp_file:

            temp_file.write(contents)
            temp_path = temp_file.name


        # -------------------------------------------------
        # EXTRACT RESUME TEXT
        # -------------------------------------------------

        resume_text = extract_resume_text(temp_path)


        # -------------------------------------------------
        # ML + SEMANTIC MATCHING
        # -------------------------------------------------

        result = predict_match(
            resume_text,
            job_description
        )


        # -------------------------------------------------
        # SKILL ANALYSIS
        # -------------------------------------------------

        skill_analysis = compare_skills(
            resume_text,
            job_description
        )


        # -------------------------------------------------
        # JOB REQUIREMENT ANALYSIS
        # -------------------------------------------------

        requirements = extract_requirements(
            job_description
        )


        # -------------------------------------------------
        # AI-STYLE PERSONALIZED RECOMMENDATIONS
        # -------------------------------------------------

        recommendations = generate_recommendations(
            skill_analysis,
            requirements
        )


        # -------------------------------------------------
        # FINAL RESPONSE
        # -------------------------------------------------

        return {
            "job_role": job_role,
            "company": company,

            "result": result,

            "skill_analysis": skill_analysis,

            "requirements": requirements,

            "recommendations": recommendations
        }


    except ValueError as error:

        raise HTTPException(
            status_code=400,
            detail=str(error)
        )


    except Exception as error:

        print("Analysis error:", error)

        raise HTTPException(
            status_code=500,
            detail="Resume analysis failed."
        )


    finally:

        if temp_path and os.path.exists(temp_path):
            os.remove(temp_path)