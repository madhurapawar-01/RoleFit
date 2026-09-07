import fitz


def extract_resume_text(file_path):
    document = fitz.open(file_path)

    text = ""

    for page in document:
        text += page.get_text("text") + "\n"

    document.close()

    if not text.strip():
        raise ValueError(
            "The PDF contains no extractable text."
        )

    return text.strip()