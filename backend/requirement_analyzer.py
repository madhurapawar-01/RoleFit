import re

from backend.skill_matcher import extract_skills


# =========================================================
# PRIORITY KEYWORDS
# =========================================================

MUST_HAVE_KEYWORDS = [
    "must have",
    "must",
    "required",
    "requirement",
    "mandatory",
    "essential",
    "strong knowledge of",
    "strong knowledge",
    "strong experience with",
    "strong experience in",
    "proficient in",
    "expertise in",
    "hands-on experience with",
]

NICE_TO_HAVE_KEYWORDS = [
    "nice to have",
    "nice-to-have",
    "preferred",
    "preferably",
    "a plus",
    "plus",
    "bonus",
    "good to have",
    "would be considered",
    "desirable",
]


# =========================================================
# DETECT PRIORITY OF A SENTENCE
# =========================================================

def get_sentence_priority(sentence):

    sentence = sentence.lower()

    # Nice-to-have is checked first because phrases such as
    # "experience with X is preferred" should not become must-have
    if any(keyword in sentence for keyword in NICE_TO_HAVE_KEYWORDS):
        return "nice_to_have"

    if any(keyword in sentence for keyword in MUST_HAVE_KEYWORDS):
        return "must_have"

    return "important"


# =========================================================
# MAIN REQUIREMENT EXTRACTOR
# =========================================================

def extract_requirements(job_description):

    if not job_description or not job_description.strip():
        return {
            "must_have": [],
            "important": [],
            "nice_to_have": []
        }

    text = job_description.lower()

    # Extract only skills supported by our SKILLS database
    detected_skills = extract_skills(text)

    # Store priority for every skill
    skill_priorities = {}

    # Split JD into meaningful sentences / lines
    sentences = re.split(
        r'[.!?\n\r]+',
        text
    )

    for sentence in sentences:

        sentence = sentence.strip()

        if not sentence:
            continue

        # Find all recognized skills inside this sentence
        sentence_skills = extract_skills(sentence)

        if not sentence_skills:
            continue

        priority = get_sentence_priority(sentence)

        for skill in sentence_skills:

            # Priority ranking:
            # must_have > important > nice_to_have
            priority_rank = {
                "nice_to_have": 1,
                "important": 2,
                "must_have": 3
            }

            # If skill appears for the first time
            if skill not in skill_priorities:
                skill_priorities[skill] = priority

            # If skill appears multiple times,
            # keep the highest priority
            else:

                current_priority = skill_priorities[skill]

                if (
                    priority_rank[priority]
                    > priority_rank[current_priority]
                ):
                    skill_priorities[skill] = priority


    # =====================================================
    # BUILD FINAL LISTS
    # =====================================================

    must_have = []
    important = []
    nice_to_have = []

    for skill in detected_skills:

        priority = skill_priorities.get(
            skill,
            "important"
        )

        if priority == "must_have":
            must_have.append(skill)

        elif priority == "nice_to_have":
            nice_to_have.append(skill)

        else:
            important.append(skill)


    # =====================================================
    # RETURN CLEAN DATA
    # =====================================================

    return {
        "must_have": sorted(set(must_have)),
        "important": sorted(set(important)),
        "nice_to_have": sorted(set(nice_to_have))
    }