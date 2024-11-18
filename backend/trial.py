import spacy.cli
spacy.cli.download('en_core_web_sm')

import re
import spacy
import PyPDF2
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np
from typing import List, Dict, Tuple  

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
    {"title": "Content Writer", "skills": ["writing", "copywriting", "seo", "content creation", "blogging", "editing"]},
    {"title": "Data Engineer", "skills": ["python", "sql", "apache spark", "hadoop", "etl", "data warehousing"]},
    {"title": "Data Analyst", "skills": ["excel", "sql", "tableau", "power bi", "python", "data visualization"]},
    {"title": "QA Engineer", "skills": ["selenium", "jira", "python", "automation", "cucumber", "testng"]},
    {"title": "Network Security Engineer", "skills": ["firewalls", "vpn", "linux", "windows", "tcp/ip", "encryption"]},
    {"title": "Mobile Security Engineer", "skills": ["ios security", "android security", "reverse engineering", "penetration testing"]},
    {"title": "Robotics Engineer", "skills": ["python", "robotics", "ros", "automation", "c++", "sensors"]},
    {"title": "Cloud Engineer", "skills": ["aws", "azure", "gcp", "terraform", "cloud networking", "kubernetes"]},
    {"title": "Salesforce Developer", "skills": ["salesforce", "apex", "visualforce", "soql", "javascript"]},
    {"title": "Embedded Systems Engineer", "skills": ["c", "c++", "python", "rtos", "embedded linux", "microcontrollers"]},
    {"title": "Digital Marketing Specialist", "skills": ["seo", "google ads", "facebook ads", "content marketing", "analytics"]},
    {"title": "Growth Hacker", "skills": ["seo", "social media", "content marketing", "analytics", "growth strategies"]},
    {"title": "Operations Manager", "skills": ["project management", "logistics", "operations", "analytics", "excel"]},
]


    
    # Sample job description to compare against
    job_description = "Looking for a data scientist with experience in Python, NLP, and machine learning."
    
    # Calculate similarity between resume and job description
    rankings = rank_resumes_with_embeddings([resume_text], job_description)
    ranking_percentage = rankings[0] * 100

    # Extract matches for skills, experience, and education
    skills_match = ranking_percentage
    experience_match = calculate_experience_match(resume_text)
    education_match = calculate_education_match(resume_text)

    # Recommend jobs based on extracted skills
    recommendations = recommend_jobs(skills, job_database)

    return {
        'skills_match': skills_match,
        'experience_match': experience_match,
        'education_match': education_match,
        'overall_percentage': ranking_percentage,
        'recommendations': recommendations,
        'skills': skills
    }
