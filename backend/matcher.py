import os
import joblib
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity


BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MODEL_DIR = os.path.join(BASE_DIR, "models")

model = joblib.load(
    os.path.join(MODEL_DIR, "matching_model.pkl")
)

vectorizer = joblib.load(
    os.path.join(MODEL_DIR, "tfidf_vectorizer.pkl")
)

scoring_config = joblib.load(
    os.path.join(MODEL_DIR, "scoring_config.pkl")
)

embedding_model = SentenceTransformer(
    os.path.join(MODEL_DIR, "embedding_model")
)


def clean_text(text):
    import re

    text = str(text).lower()
    text = re.sub(r"\s+", " ", text)
    text = re.sub(r"[^a-zA-Z0-9\s]", " ", text)

    return text.strip()


def predict_match(resume_text, job_text):

    resume_clean = clean_text(resume_text)
    job_clean = clean_text(job_text)

    combined = (
        "resume "
        + resume_clean
        + " jobdescription "
        + job_clean
    )

    tfidf_input = vectorizer.transform([combined])

    ml_probability = model.predict_proba(
        tfidf_input
    )[0][1]

    resume_vector = embedding_model.encode(
        [resume_clean]
    )

    job_vector = embedding_model.encode(
        [job_clean]
    )

    semantic_score = cosine_similarity(
        resume_vector,
        job_vector
    )[0][0]

    hybrid_score = (
        ml_probability * scoring_config["ml_weight"]
        + semantic_score * scoring_config["semantic_weight"]
    )

    final_score = round(
        float(hybrid_score) * 100,
        2
    )

    if final_score >= scoring_config["high_threshold"]:
        readiness = "HIGH"
    elif final_score >= scoring_config["moderate_threshold"]:
        readiness = "MODERATE"
    else:
        readiness = "LOW"

    return {
    "match_score": float(final_score),
    "shortlisting_readiness": readiness,
    "semantic_score": float(round(
        float(semantic_score) * 100,
        2
    )),
    "ml_score": float(round(
        float(ml_probability) * 100,
        2
    ))
}