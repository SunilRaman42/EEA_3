#!/usr/bin/env python3
"""
generate_synthetic_data.py
Generates realistic synthetic data for the Sub-Saharan Africa EdTech Landscape Review:
1. Teachers survey (SSA_Teacher_Survey_v1)
2. EdTech Providers survey (SSA_Provider_Survey_v1)
3. Expert Consultation (SSA_Expert_Consultation_R1_v1)

Features:
- Realistic distributions across 48 Sub-Saharan African countries
- Linguistic blocs: Anglophone, Francophone, Lusophone
- Real-world correlations (e.g. rural schools face higher power/internet constraints)
- Real-world inconsistencies: missing optional fields (~10%), mixed list delimiters (comma vs semicolon),
  whitespace quirks, and authentic-sounding qualitative remarks.
Outputs:
- data/raw/SSA_Survey_Responses_Mock.xlsx
"""

import os
import random
import numpy as np
import pandas as pd

random.seed(42)
np.random.seed(42)

# Country taxonomy with primary linguistic bloc and regional classification
COUNTRIES = [
    {"name": "Nigeria", "iso3": "NGA", "bloc": "Anglophone", "region": "West Africa", "weight": 14},
    {"name": "Kenya", "iso3": "KEN", "bloc": "Anglophone", "region": "East Africa", "weight": 12},
    {"name": "South Africa", "iso3": "ZAF", "bloc": "Anglophone", "region": "Southern Africa", "weight": 10},
    {"name": "Ghana", "iso3": "GHA", "bloc": "Anglophone", "region": "West Africa", "weight": 9},
    {"name": "Senegal", "iso3": "SEN", "bloc": "Francophone", "region": "West Africa", "weight": 7},
    {"name": "Côte d'Ivoire", "iso3": "CIV", "bloc": "Francophone", "region": "West Africa", "weight": 7},
    {"name": "Tanzania", "iso3": "TZA", "bloc": "Anglophone", "region": "East Africa", "weight": 7},
    {"name": "Rwanda", "iso3": "RWA", "bloc": "Anglophone", "region": "East Africa", "weight": 6},
    {"name": "Uganda", "iso3": "UGA", "bloc": "Anglophone", "region": "East Africa", "weight": 6},
    {"name": "Ethiopia", "iso3": "ETH", "bloc": "Anglophone", "region": "East Africa", "weight": 5},
    {"name": "Cameroon", "iso3": "CMR", "bloc": "Francophone", "region": "Central Africa", "weight": 5},
    {"name": "Mozambique", "iso3": "MOZ", "bloc": "Lusophone", "region": "Southern Africa", "weight": 4},
    {"name": "Angola", "iso3": "AGO", "bloc": "Lusophone", "region": "Central Africa", "weight": 4},
    {"name": "Congo, Dem. Rep.", "iso3": "COD", "bloc": "Francophone", "region": "Central Africa", "weight": 4},
    {"name": "Zambia", "iso3": "ZMB", "bloc": "Anglophone", "region": "Southern Africa", "weight": 4},
    {"name": "Zimbabwe", "iso3": "ZWE", "bloc": "Anglophone", "region": "Southern Africa", "weight": 3},
    {"name": "Malawi", "iso3": "MWI", "bloc": "Anglophone", "region": "Southern Africa", "weight": 3},
    {"name": "Benin", "iso3": "BEN", "bloc": "Francophone", "region": "West Africa", "weight": 3},
    {"name": "Burkina Faso", "iso3": "BFA", "bloc": "Francophone", "region": "West Africa", "weight": 3},
    {"name": "Mali", "iso3": "MLI", "bloc": "Francophone", "region": "West Africa", "weight": 3},
    {"name": "Niger", "iso3": "NER", "bloc": "Francophone", "region": "West Africa", "weight": 2},
    {"name": "Togo", "iso3": "TGO", "bloc": "Francophone", "region": "West Africa", "weight": 2},
    {"name": "Sierra Leone", "iso3": "SLE", "bloc": "Anglophone", "region": "West Africa", "weight": 2},
    {"name": "Liberia", "iso3": "LBR", "bloc": "Anglophone", "region": "West Africa", "weight": 2},
    {"name": "Botswana", "iso3": "BWA", "bloc": "Anglophone", "region": "Southern Africa", "weight": 2},
    {"name": "Namibia", "iso3": "NAM", "bloc": "Anglophone", "region": "Southern Africa", "weight": 2},
    {"name": "Madagascar", "iso3": "MDG", "bloc": "Francophone", "region": "East Africa", "weight": 2},
    {"name": "Cabo Verde", "iso3": "CPV", "bloc": "Lusophone", "region": "West Africa", "weight": 1},
    {"name": "Guinea-Bissau", "iso3": "GNB", "bloc": "Lusophone", "region": "West Africa", "weight": 1},
    {"name": "São Tomé and Príncipe", "iso3": "STP", "bloc": "Lusophone", "region": "Central Africa", "weight": 1},
]

# Helper for weighted random choice
country_names = [c["name"] for c in COUNTRIES]
country_weights = [c["weight"] for c in COUNTRIES]
total_w = sum(country_weights)
country_probs = [w / total_w for w in country_weights]

def pick_country():
    return np.random.choice(COUNTRIES, p=country_probs)

def maybe_missing(val, rate=0.10):
    """Introduce real-world missing data / skipped responses"""
    if random.random() < rate:
        return np.nan
    return val

def generate_teacher_data(n=600):
    rows = []
    
    school_types = [
        "Public / government", "Low-fee private", "Other private (fee-paying)",
        "Faith-based or mission school", "Community school", "School in a refugee camp or serving displaced learners"
    ]
    school_type_probs = [0.55, 0.18, 0.08, 0.10, 0.06, 0.03]
    
    locations = ["A major city", "A smaller town", "A rural area"]
    loc_probs = [0.38, 0.32, 0.30]
    
    teaching_levels = [
        "Primary (about ages 6 to 12)",
        "Lower secondary (about ages 12 to 15)",
        "Upper secondary (about ages 15 to 18)",
        "Early years / pre-primary (about ages 3 to 5)",
        "Primary; Lower secondary"
    ]
    
    subjects = ["Maths and science", "Languages and literacy", "Humanities and social studies", "All subjects", "Other"]
    
    sample_quotes = [
        "Solar power was installed two years ago but the batteries died. We only use tablets when sunlight permits.",
        "Students are very excited when we use WhatsApp quizzes, but parents complain about airtime costs.",
        "ChatGPT helps me prepare lesson plans in minutes, but it often confuses our local curriculum topics.",
        "We need offline content. Without internet connectivity in rural schools, expensive portals remain empty.",
        "Structured lesson plans on tablets have improved our attendance tracking significantly.",
        "Most learners speak Yoruba/Hausa at home; when AI tools only speak English, children struggle.",
        "Class size of 75 students makes individual device learning impossible without small group rotations.",
        "Mobile phones were banned last year, which reduced classroom distractions but stopped home study apps.",
        "Ministry platforms often go down right when end-of-term marks need to be submitted.",
        "We need practical training workshops, not just one-off webinars that assume high-speed wifi."
    ]

    for i in range(1, n + 1):
        c = pick_country()
        loc = np.random.choice(locations, p=loc_probs)
        st = np.random.choice(school_types, p=school_type_probs)
        
        # Power & internet correlated with location
        if loc == "A rural area":
            elec = np.random.choice(["Unreliable (frequent cuts)", "No electricity at all", "Mostly reliable", "Always reliable"], p=[0.42, 0.32, 0.20, 0.06])
            internet = np.random.choice(["No internet at all", "Mobile data only (personal cost)", "Intermittent / slow", "High-speed / reliable"], p=[0.38, 0.40, 0.18, 0.04])
        elif loc == "A smaller town":
            elec = np.random.choice(["Mostly reliable", "Unreliable (frequent cuts)", "Always reliable", "No electricity at all"], p=[0.44, 0.36, 0.15, 0.05])
            internet = np.random.choice(["Mobile data only (personal cost)", "Intermittent / slow", "High-speed / reliable", "No internet at all"], p=[0.45, 0.32, 0.15, 0.08])
        else: # Major city
            elec = np.random.choice(["Always reliable", "Mostly reliable", "Unreliable (frequent cuts)", "No electricity at all"], p=[0.38, 0.45, 0.16, 0.01])
            internet = np.random.choice(["High-speed / reliable", "Intermittent / slow", "Mobile data only (personal cost)", "No internet at all"], p=[0.34, 0.38, 0.25, 0.03])
            
        uses_digital = np.random.choice(["Yes", "No, not at present"], p=[0.82, 0.18])
        
        # Tools used
        tools_pool = ["Learning or subject apps", "Messaging groups (WhatsApp/Telegram)", "Content or video platforms",
                      "Tablet or phone with lesson guides", "Assessment or quiz tools", "AI tools (ChatGPT/Gemini)", "Radio or TV lessons"]
        tools_used = "; ".join(random.sample(tools_pool, k=random.randint(1, 3))) if uses_digital == "Yes" else ""
        
        # AI usage
        ai_use = np.random.choice(["Regularly", "Sometimes", "Tried once or twice", "Never"], p=[0.18, 0.27, 0.24, 0.31])
        ai_conf = np.random.choice(["Very confident", "Fairly confident", "A little", "Not at all"], p=[0.14, 0.35, 0.33, 0.18])
        ai_training = np.random.choice(["Yes, good support", "Yes, but limited", "No"], p=[0.11, 0.29, 0.60])
        
        # Workload impact
        workload = np.random.choice(["Reduce it a lot", "Reduce it a little", "No difference", "Add a little", "Add a lot"], p=[0.18, 0.34, 0.16, 0.22, 0.10])
        
        # Language comprehension
        lang_comp = np.random.choice(["Well", "Partly", "Hardly at all, it's a new language for them", "It varies a lot between students"], p=[0.42, 0.36, 0.08, 0.14])
        
        # Safety & wellbeing
        phone_rules = np.random.choice(["Phones not allowed at all", "Allowed only at certain times", "No rules", "Don't know"], p=[0.52, 0.33, 0.12, 0.03])
        know_report = np.random.choice(["Yes, there is a school procedure", "Yes, informally", "No"], p=[0.31, 0.44, 0.25])

        row = {
            "Response_ID": f"TCH-{i:04d}",
            "Country": c["name"],
            "Linguistic_Bloc": c["bloc"],
            "Region": c["region"],
            "School_Type": st,
            "School_Location": loc,
            "Class_Size": np.random.choice(["Fewer than 30", "30–50", "51–80", "More than 80"], p=[0.12, 0.41, 0.32, 0.15]),
            "Teaching_Levels": np.random.choice(teaching_levels),
            "Subject_Area": np.random.choice(subjects),
            "Experience_Years": np.random.choice(["Less than 3 years", "3–10 years", "More than 10 years"], p=[0.22, 0.46, 0.32]),
            "Uses_Digital_Tools": uses_digital,
            "Digital_Tools_Used": tools_used if uses_digital == "Yes" else "None",
            "Electricity_Reliability": elec,
            "Internet_Reliability": internet,
            "Student_Language_Comprehension": lang_comp,
            "Workload_Impact": workload,
            "AI_Use_Frequency": ai_use,
            "AI_Confidence": ai_conf,
            "AI_Training_Received": ai_training,
            "AI_Local_Language_Handling": np.random.choice(["Well", "Adequately", "Poorly", "Students mostly use English/French instead", "Don't know"], p=[0.10, 0.24, 0.36, 0.20, 0.10]),
            "Phone_Rules": phone_rules,
            "Harm_Reporting_Known": know_report,
            "Private_Tutoring_Prevalence": np.random.choice(["Almost none", "A small number", "About half", "Most students", "Don't know"], p=[0.24, 0.32, 0.22, 0.16, 0.06]),
            "Qualitative_Comment": np.random.choice(sample_quotes) if random.random() < 0.45 else np.nan
        }
        
        # Simulate realistic missing fields (5-8% random NaNs on optional items)
        for col in ["Class_Size", "AI_Confidence", "Student_Language_Comprehension", "Workload_Impact"]:
            row[col] = maybe_missing(row[col], 0.06)
            
        rows.append(row)
        
    return pd.DataFrame(rows)

def generate_provider_data(n=120):
    rows = []
    
    org_types = ["For-profit company", "Social enterprise", "NGO or non-profit", "Public body or state-owned organisation"]
    offerings = [
        "Learning content or apps for learners",
        "Tutoring or exam preparation",
        "Tools for teachers (lesson plans, coaching)",
        "School or learning-management systems",
        "Skills, vocational or workforce training",
        "Hardware, devices or connectivity"
    ]
    
    breakdown_stages = [
        "Budget availability or delays in funding release",
        "Lengthy or opaque public procurement cycles",
        "Lack of clear technical specifications from ministry",
        "Political changes or leadership turnover",
        "Teacher resistance or lack of continuous PD support"
    ]

    for i in range(1, n + 1):
        c = pick_country()
        ot = np.random.choice(org_types, p=[0.48, 0.28, 0.19, 0.05])
        
        # Number of SSA countries operated in
        op_count = np.random.choice([1, 2, 3, 5, 8], p=[0.45, 0.25, 0.15, 0.10, 0.05])
        ops = [c["name"]] + [other["name"] for other in random.sample(COUNTRIES, min(op_count - 1, len(COUNTRIES)-1))]
        ops = list(set(ops))
        
        # Real-world delimiter inconsistency: some use '; ', some ', '
        delim = "; " if random.random() > 0.3 else ", "
        operating_str = delim.join(ops)
        
        row = {
            "Provider_ID": f"PRV-{i:03d}",
            "Org_Name": f"EdTech Venture {i:03d}",
            "HQ_Country": c["name"],
            "Operating_Countries": operating_str,
            "Org_Type": ot,
            "Ownership_Model": np.random.choice([
                "Founded in Sub-Saharan Africa, mainly locally owned",
                "Founded in Sub-Saharan Africa, with foreign investment",
                "Subsidiary/branch of organization based outside SSA"
            ], p=[0.58, 0.26, 0.16]),
            "Founded_Period": np.random.choice(["Before 2010", "2010–2015", "2016–2020", "2021 or later"], p=[0.12, 0.28, 0.36, 0.24]),
            "Team_Size": np.random.choice(["1–10", "11–50", "51–200", "More than 200"], p=[0.38, 0.42, 0.15, 0.05]),
            "Primary_Offering": np.random.choice(offerings),
            "Target_Users": "; ".join(random.sample(["Learners", "Teachers", "School leaders", "Parents", "Ministries"], k=random.randint(1, 3))),
            "Active_Users_Past_12M": np.random.choice([
                "Fewer than 1,000", "1,000–10,000", "10,001–100,000", "100,001–1 million", "More than 1 million"
            ], p=[0.18, 0.32, 0.28, 0.16, 0.06]),
            "Delivery_Channels": "; ".join(random.sample([
                "Smartphone app", "Web browser", "Basic phone (SMS, USSD)", "Messaging apps (WhatsApp)", "Preloaded offline devices"
            ], k=random.randint(1, 2))),
            "Offline_Capability": np.random.choice(["Yes, fully offline", "Partly (syncs when connected)", "No, it needs a connection"], p=[0.32, 0.44, 0.24]),
            "Minimum_Device": np.random.choice(["A basic phone", "A low-cost smartphone", "A tablet or computer", "Dedicated device"], p=[0.18, 0.52, 0.26, 0.04]),
            "Data_Payment_Model": np.random.choice(["Users pay", "Covered by programme/donor", "Free via zero-rated telco deal", "Offline / no data needed"], p=[0.42, 0.28, 0.16, 0.14]),
            "Local_Language_Support": np.random.choice(["3 or more local languages", "1–2 local languages", "English/French/Portuguese only"], p=[0.24, 0.38, 0.38]),
            "Revenue_Model": np.random.choice(["Direct from families (B2C)", "Donor grants / philanthropic", "Ministry / public procurement (B2G)", "Schools fee (B2B)"], p=[0.34, 0.29, 0.21, 0.16]),
            "Evidence_Level_Held": np.random.choice([
                "Internal user metrics / analytics only",
                "Qualitative feedback / teacher testimonials",
                "Quasi-experimental study / independent evaluation",
                "Full Randomized Controlled Trial (RCT)"
            ], p=[0.38, 0.34, 0.20, 0.08]),
            "Procurement_Breakdown_Point": np.random.choice(breakdown_stages),
            "AI_Features_Included": np.random.choice(["Yes, embedded into core product", "Piloting / in development", "No AI features"], p=[0.26, 0.36, 0.38]),
            "Meaningful_Wellbeing_Safeguards": np.random.choice(["Strongly agree", "Agree", "Neither", "Disagree"], p=[0.32, 0.48, 0.15, 0.05])
        }
        
        # Missing values
        for col in ["Active_Users_Past_12M", "Data_Payment_Model", "Evidence_Level_Held"]:
            row[col] = maybe_missing(row[col], 0.08)
            
        rows.append(row)
        
    return pd.DataFrame(rows)

def generate_expert_data(n=80):
    rows = []
    
    vantages = [
        "Policy / ministry / regulator", "Research / academia", "Donor, funder or development partner",
        "NGO or agency delivery", "EdTech provision (building/selling)", "Mobile network or telecoms operator"
    ]
    
    pilot_outcomes = [
        "It stops completely or collapses",
        "It shrinks to a small token presence",
        "Ministry absorbs and funds core operational costs",
        "Community / parents step in to sustain it"
    ]
    
    constraints = [
        "Electricity and internet infrastructure gaps",
        "Teacher digital confidence and lack of continuous coaching",
        "Unsustainable recurrent funding when donor projects end",
        "Device procurement, maintenance and replacement costs",
        "Curriculum misalignment and language mismatch"
    ]
    
    equity_risks = [
        "Rural and remote learners",
        "Displaced, refugee and crisis-affected learners",
        "Girls and young women facing device access disparity",
        "Children with disabilities and special needs",
        "Learners speaking indigenous / non-dominant languages"
    ]

    for i in range(1, n + 1):
        c = pick_country()
        vantage = np.random.choice(vantages, p=[0.24, 0.26, 0.20, 0.16, 0.10, 0.04])
        
        row = {
            "Expert_ID": f"EXP-{i:03d}",
            "Evaluated_Country": c["name"],
            "Region": c["region"],
            "Linguistic_Bloc": c["bloc"],
            "Vantage_Point": vantage,
            "Years_In_System": np.random.choice(["Less than 2", "2–5", "6–10", "More than 10"], p=[0.08, 0.28, 0.36, 0.28]),
            "Primary_Decision_Driver": np.random.choice([
                "Donors and international agencies",
                "Ministry of Education leadership",
                "Commercial EdTech vendors",
                "Regional / local governments",
                "Schools and headteachers"
            ], p=[0.42, 0.33, 0.14, 0.07, 0.04]),
            "Primary_Funding_Source": np.random.choice([
                "Donors / development banks",
                "National government budget",
                "Parents / households out of pocket",
                "Private philanthropic foundations"
            ], p=[0.48, 0.26, 0.18, 0.08]),
            "Donor_Exit_Fate": np.random.choice(pilot_outcomes, p=[0.53, 0.31, 0.12, 0.04]),
            "Realistic_Evidence_Threshold": np.random.choice([
                "Proof of concept and user feedback",
                "Pre-post learning gain evaluation",
                "Quasi-experimental comparison group study",
                "Full Randomized Controlled Trial (RCT)"
            ], p=[0.31, 0.44, 0.19, 0.06]),
            "AI_Classroom_Readiness_Score": np.random.choice([1, 2, 3, 4, 5], p=[0.36, 0.34, 0.18, 0.09, 0.03]),
            "Top_System_Constraint": np.random.choice(constraints, p=[0.33, 0.29, 0.22, 0.11, 0.05]),
            "Most_Consequential_Equity_Risk": np.random.choice(equity_risks, p=[0.38, 0.24, 0.18, 0.12, 0.08]),
            "Telco_Role_Significance": np.random.choice([
                "Essential partner in zero-rating & connectivity",
                "Transactional payment provider only",
                "Limited or passive involvement",
                "Unexplored potential"
            ], p=[0.28, 0.34, 0.26, 0.12]),
            "Structured_Pedagogy_Support": np.random.choice([
                "Strongly agree - structured tablets provide essential scaffolding",
                "Agree with caveats - risks deskilling teachers if too rigid",
                "Disagree - too prescriptive for heterogeneous classrooms"
            ], p=[0.48, 0.38, 0.14])
        }
        
        # Missing values
        for col in ["Realistic_Evidence_Threshold", "AI_Classroom_Readiness_Score", "Most_Consequential_Equity_Risk"]:
            row[col] = maybe_missing(row[col], 0.05)
            
        rows.append(row)
        
    return pd.DataFrame(rows)

def main():
    os.makedirs("data/raw", exist_ok=True)
    out_path = "data/raw/SSA_Survey_Responses_Mock.xlsx"
    print(f"Generating synthetic survey responses...")
    
    df_teachers = generate_teacher_data(n=600)
    df_providers = generate_provider_data(n=120)
    df_experts = generate_expert_data(n=80)
    
    with pd.ExcelWriter(out_path, engine="openpyxl") as writer:
        df_teachers.to_excel(writer, sheet_name="Teachers", index=False)
        df_providers.to_excel(writer, sheet_name="Providers", index=False)
        df_experts.to_excel(writer, sheet_name="Experts", index=False)
        
    print(f"✓ Created {out_path} with sheets:")
    print(f"   - Teachers:  {len(df_teachers)} rows, {df_teachers.shape[1]} columns")
    print(f"   - Providers: {len(df_providers)} rows, {df_providers.shape[1]} columns")
    print(f"   - Experts:   {len(df_experts)} rows, {df_experts.shape[1]} columns")

if __name__ == "__main__":
    main()
