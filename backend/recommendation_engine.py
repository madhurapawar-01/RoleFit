def generate_recommendations(skill_analysis, requirements):

    missing_skills = skill_analysis.get("missing_skills", [])

    must_have = requirements.get("must_have", [])
    important = requirements.get("important", [])
    nice_to_have = requirements.get("nice_to_have", [])

    recommendations = []

    # -------------------------------------------------
    # PRIORITY 1: Missing must-have skills
    # -------------------------------------------------

    high_priority = [
        skill for skill in missing_skills
        if skill in must_have
    ]

    # -------------------------------------------------
    # PRIORITY 2: Missing important skills
    # -------------------------------------------------

    medium_priority = [
        skill for skill in missing_skills
        if skill in important
    ]

    # -------------------------------------------------
    # PRIORITY 3: Missing nice-to-have skills
    # -------------------------------------------------

    low_priority = [
        skill for skill in missing_skills
        if skill in nice_to_have
    ]

    # -------------------------------------------------
    # CREATE PERSONALIZED SUGGESTIONS
    # -------------------------------------------------

    if high_priority:

        recommendations.append({
            "priority": "High",
            "title": "Focus on Required Skills",
            "message": (
                "These skills are important requirements for the role: "
                + ", ".join(high_priority[:5])
                + "."
            ),
            "skills": high_priority
        })

    if medium_priority:

        recommendations.append({
            "priority": "Medium",
            "title": "Strengthen Your Profile",
            "message": (
                "Developing these skills can improve your compatibility "
                "with the role: "
                + ", ".join(medium_priority[:5])
                + "."
            ),
            "skills": medium_priority
        })

    if low_priority:

        recommendations.append({
            "priority": "Low",
            "title": "Build Additional Advantage",
            "message": (
                "These additional skills could make your profile stronger: "
                + ", ".join(low_priority[:5])
                + "."
            ),
            "skills": low_priority
        })

    # -------------------------------------------------
    # GENERAL RESUME SUGGESTION
    # -------------------------------------------------

    if missing_skills:

        resume_tip = (
            "Update your resume with relevant projects, certifications, "
            "or practical experience that demonstrate the required skills."
        )

    else:

        resume_tip = (
            "Your resume covers the major detected skills for this role. "
            "Focus on clearly demonstrating your experience through projects and achievements."
        )

    return {
        "recommendations": recommendations,
        "resume_tip": resume_tip
    }