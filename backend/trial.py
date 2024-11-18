import spacy.cli
import re
import spacy
import PyPDF2
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np
from typing import List, Dict, Tuple  

# Download the spaCy model if it's not installed
spacy.cli.download('en_core_web_sm')

# Load spaCy NLP model once
nlp = spacy.load('en_core_web_sm')

def extract_text_from_pdf(file_stream) -> str:
    """Extract text from a PDF file."""
    try:
        reader = PyPDF2.PdfReader(file_stream)
        text = ""
        for page in reader.pages:
            text += page.extract_text() or ""  # Handle None case
        return text
    except Exception as e:
        print(f"Error extracting text from PDF: {e}")
        return ""

def extract_skills(text: str) -> List[str]:
    """Extract skills from resume text using NLP."""
    doc = nlp(text)
    skills = set()
    predefined_skills = {"python", "machine learning", "nlp", "pandas", 
                         "html", "css", "javascript", "react", 
                         "aws", "docker", "kubernetes", "ci/cd"}

    for ent in doc.ents:
        if ent.label_ in ["ORG", "PRODUCT"] or ent.text.lower() in predefined_skills:
            skills.add(ent.text.lower())
    return list(skills)

def rank_resumes_with_embeddings(resume_texts: List[str], job_description: str) -> List[float]:
    """Calculate cosine similarity between resume texts and job description."""
    job_vector = nlp(job_description).vector
    doc_vectors = [nlp(resume_text).vector for resume_text in resume_texts]
    
    similarities = cosine_similarity([job_vector], doc_vectors)
    return similarities.flatten()

def recommend_jobs(resume_skills: List[str], job_database: List[Dict]) -> List[Tuple[str, float]]:
    recommendations = []
    for job in job_database:
        job_skills = set(job['skills'])
        resume_skills_set = set(resume_skills)
        match_score = len(resume_skills_set.intersection(job_skills)) / len(job_skills)
        print(f"Job: {job['title']}, Match Score: {match_score}")  # Debugging log
        if match_score > 0:
            recommendations.append((job['title'], match_score))
    return sorted(recommendations, key=lambda x: x[1], reverse=True)

def calculate_experience_match(resume_text: str) -> float:
    """
    Extracts the number of years of experience from the resume text.
    Compares it to a predefined experience requirement and returns a match percentage.
    """
    # Look for date patterns (e.g., "Jan 2019 - Dec 2022")
    date_pattern = re.compile(r"(\b\d{4}\b)")
    experience_years = []
    
    # Split resume text into lines and process
    for line in resume_text.splitlines():
        if "experience" in line.lower():  # Check for keywords indicating experience section
            dates = date_pattern.findall(line)
            if len(dates) >= 2:  # Assuming at least two dates indicate a date range
                start_year = int(dates[0])
                end_year = int(dates[-1])
                experience_years.append(end_year - start_year)
    
    # Sum up all experience years
    total_experience = sum(experience_years) if experience_years else 0
    
    # Set a predefined requirement (for example, 5 years of experience)
    required_experience = 1
    
    # Calculate match percentage
    experience_match = min((total_experience / required_experience) * 100, 100)
    
    return experience_match

def calculate_education_match(resume_text: str) -> float:
    """Calculate education match based on degree mentioned in resume."""
    education_keywords = ["bachelor", "master", "phd", "degree", "diploma","B.E"]
    degree_found = False
    
    # Check if resume contains any of the predefined education keywords
    for keyword in education_keywords:
        if keyword.lower() in resume_text.lower():
            degree_found = True
            break
    
    # Placeholder logic for education match percentage
    return 100 if degree_found else 50

def process_resume(file_stream) -> Dict:
    """Process the resume to extract data and match it with job requirements."""
    resume_text = extract_text_from_pdf(file_stream)
    if not resume_text:
        return {"error": "Could not extract text from resume."}
    
    # Extract skills from resume
    skills = extract_skills(resume_text)
    
    # Job database (sample data)
    job_database = [
    {"title": "Data Scientist", "skills": ["python", "machine learning", "nlp", "pandas", "sql", "tensorflow"]},
    {"title": "Web Developer", "skills": ["html", "css", "javascript", "react", "node.js", "express"]},
    {"title": "DevOps Engineer", "skills": ["aws", "docker", "kubernetes", "ci/cd", "terraform", "linux"]},
    {"title": "AI Engineer", "skills": ["python", "tensorflow", "pytorch", "nlp", "deep learning", "opencv"]},
    {"title": "Software Engineer", "skills": ["python", "javascript", "git", "react", "c++", "java"]},
    {"title": "Front-end Developer", "skills": ["html", "css", "javascript", "react", "redux", "tailwind css"]},
    {"title": "Back-end Developer", "skills": ["node.js", "express", "mongodb", "sql", "java", "c#", "docker"]},
    {"title": "Full Stack Developer", "skills": ["react", "node.js", "javascript", "sql", "html", "css", "express"]},
    {"title": "Mobile App Developer", "skills": ["flutter", "react native", "swift", "kotlin", "android", "ios"]},
    {"title": "Cloud Architect", "skills": ["aws", "azure", "gcp", "terraform", "kubernetes", "cloudformation"]},
    {"title": "Cybersecurity Specialist", "skills": ["python", "linux", "firewall", "network security", "encryption"]},
    {"title": "Database Administrator", "skills": ["sql", "postgresql", "mysql", "oracle", "mongodb", "nosql"]},
    {"title": "Machine Learning Engineer", "skills": ["python", "tensorflow", "pytorch", "scikit-learn", "nlp", "pandas"]},
    {"title": "AI Researcher", "skills": ["python", "deep learning", "neural networks", "tensorflow", "pytorch", "nlp"]},
    {"title": "Blockchain Developer", "skills": ["solidity", "ethereum", "smart contracts", "web3", "node.js", "python"]},
    {"title": "Game Developer", "skills": ["unity", "c#", "unreal engine", "c++", "blender", "3d modeling"]},
    {"title": "Network Engineer", "skills": ["cisco", "firewall", "network security", "routing", "switching", "linux"]},
    {"title": "Systems Administrator", "skills": ["linux", "windows", "bash scripting", "powershell", "docker", "aws"]},
    {"title": "Business Analyst", "skills": ["sql", "excel", "power bi", "tableau", "python", "data analysis"]},
    {"title": "Project Manager", "skills": ["agile", "scrum", "jira", "project management", "kanban", "risk management"]},
    {"title": "UX/UI Designer", "skills": ["figma", "adobe xd", "wireframing", "prototyping", "html", "css", "javascript"]},
    {"title": "SEO Specialist", "skills": ["seo", "google analytics", "html", "css", "wordpress", "content marketing"]},
    {"title": "Technical Support Engineer", "skills": ["linux", "windows", "network troubleshooting", "python", "bash scripting"]}
]
    
    job_recommendations = recommend_jobs(skills, job_database)
    experience_match = calculate_experience_match(resume_text)
    education_match = calculate_education_match(resume_text)

    # Return the final result as a dictionary
    return {
        "skills": skills,
        "job_recommendations": job_recommendations,
        "experience_match": experience_match,
        "education_match": education_match
    }

