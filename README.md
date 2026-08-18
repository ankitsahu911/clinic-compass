# Clinic Compass

PROJECT TITLE:
AI-Assisted Personalized Treatment Planning and Healthcare Decision Support Platform

PROBLEM STATEMENT:
PS61 — AI-driven Personalised Treatment Planning

PROJECT TYPE:
Software-only AI/ML web application.

TARGET USERS:
Primary user: Doctor / qualified healthcare professional.
Secondary users: Healthcare administrators and potentially patients for viewing approved information.

IMPORTANT SAFETY/SCOPE:
The system is a clinical decision-support prototype, NOT an autonomous medical diagnosis or prescription system.
The AI must not claim that a patient definitely has a disease or that a particular drug must be prescribed.
The final treatment decision must always remain with a qualified healthcare professional.
Use synthetic, public, or properly authorized datasets for development and demonstration.
Do not use real patient data without appropriate authorization and privacy safeguards.


==================================================
1. PROJECT OVERVIEW
==================================================

The project is an AI-assisted personalized treatment planning platform designed to help healthcare professionals analyze individual patient information and generate data-driven treatment-support insights.

Traditional treatment recommendations can be generic and may not consider:
- Individual patient characteristics
- Previous treatment response
- Medical history
- Treatment affordability
- Availability of diagnostic services at the patient's current healthcare facility
- Existing digital health records

The proposed platform combines machine learning, explainable AI, healthcare service information, medicine affordability information, and optional ABDM/ABHA integration.

The core system accepts patient clinical information, processes it through an ML model, predicts/compares treatment response or risk, and presents the results through a doctor-facing dashboard.

The system additionally provides:
1. AI-assisted treatment response analysis
2. Explainable AI
3. Generic vs branded medicine affordability comparison
4. Jan Aushadhi availability information where reliable data is available
5. PHC/CHC/District Hospital referral guidance
6. Optional ABDM/ABHA sandbox integration
7. Patient history management
8. Treatment analysis reports


==================================================
2. MAIN OBJECTIVE
==================================================

Build a web-based decision-support platform that answers:

"Given this patient's available clinical information and historical treatment-response data, what treatment options appear more suitable, what factors influenced the prediction, what lower-cost alternatives may exist, and whether the required investigations/services are available at the patient's current healthcare facility?"

The system should provide structured evidence to support a clinician's decision rather than replacing the clinician.


==================================================
3. MVP SCOPE
==================================================

For the initial MVP, DO NOT attempt to support dozens of diseases.

Recommended initial scope:
- Type 2 Diabetes as the primary condition.
- Hypertension can be added later if time permits.

The MVP must contain:

A. Patient Management
B. Clinical Data Entry
C. ML Treatment/Response Prediction
D. Explainable AI
E. Medicine Affordability Comparison
F. Healthcare Facility Referral Guidance
G. Doctor Dashboard
H. Backend API
I. Database
J. Model evaluation

Optional advanced feature:
K. ABDM/ABHA sandbox integration

Optional:
L. RAG/LLM explanation layer


==================================================
4. HIGH-LEVEL SYSTEM ARCHITECTURE
==================================================

                    +----------------------+
                    |      DOCTOR          |
                    +----------+-----------+
                               |
                               v
                    +----------------------+
                    |    React Frontend    |
                    |   Doctor Dashboard   |
                    +----------+-----------+
                               |
                         REST / JSON
                               |
                               v
                    +----------------------+
                    |    FastAPI Backend   |
                    +----------+-----------+
                               |
              +----------------+----------------+
              |                |                |
              v                v                v
       +-------------+  +-------------+  +-------------+
       | PostgreSQL  |  | ML Service  |  | Healthcare  |
       | Database    |  |             |  | Logic       |
       +-------------+  +------+------+  +------+------+
                              |                 |
                              v                 v
                       +-------------+   +-------------+
                       | XGBoost /   |   | Medicine +  |
                       | Random      |   | Facility DB |
                       | Forest      |   +-------------+
                       +------+------+
                              |
                              v
                       +-------------+
                       | SHAP / XAI  |
                       +-------------+

Optional external integration:

                    +----------------------+
                    |     ABDM / ABHA      |
                    |   Sandbox Services   |
                    +----------+-----------+
                               |
                         Consent-based
                         data exchange
                               |
                               v
                         FastAPI Backend


==================================================
5. TECHNOLOGY STACK
==================================================

FRONTEND:
- React
- JavaScript or TypeScript
- Tailwind CSS
- Recharts or Chart.js for graphs
- Axios for API communication
- React Router

BACKEND:
- Python
- FastAPI
- Pydantic
- Uvicorn

MACHINE LEARNING:
- Python
- pandas
- NumPy
- scikit-learn
- XGBoost
- SHAP
- joblib

DATABASE:
Preferred:
- PostgreSQL

For extremely fast local MVP development:
- SQLite can be used initially.

ORM:
- SQLAlchemy

DATA PROCESSING:
- pandas
- NumPy
- scikit-learn preprocessing

OPTIONAL AI/LLM:
- OpenAI-compatible LLM API or local LLM
- RAG framework such as LangChain/LlamaIndex if needed

The LLM is NOT the primary medical prediction engine.
The ML model should produce structured predictions.
The LLM, if used, should only convert structured results into understandable explanations using an approved knowledge base.

ABDM:
- ABDM/ABHA official sandbox APIs
- Implement only if sandbox credentials and required access are available.

DEPLOYMENT:
Frontend:
- Vercel or Netlify

Backend:
- Render / Railway / AWS / similar

Database:
- PostgreSQL provider

Alternative:
- Entire application can run locally for college demonstration.

VERSION CONTROL:
- Git
- GitHub


==================================================
6. MODULE 1 — USER AUTHENTICATION
==================================================

Create basic authentication for the prototype.

Roles:
- Doctor
- Admin

Doctor:
- Create/view patients
- Enter clinical information
- Run analysis
- View predictions
- View explanations
- View affordability
- View referral recommendations

Admin:
- Manage medicine data
- Manage healthcare facility data
- Manage service availability
- View system statistics

For the 4–5 day MVP, authentication can be simplified.


==================================================
7. MODULE 2 — PATIENT MANAGEMENT
==================================================

Doctor can create a patient profile.

Patient fields:

patient_id
name or demo identifier
age
sex
height
weight
BMI
known_conditions
allergies
current_medications
previous_treatments
current_facility
location
created_at

For demonstration, use synthetic patient IDs/names.

Example:

Patient ID:
P001

Age:
52

Sex:
Male

Condition:
Type 2 Diabetes

BMI:
27.4

HbA1c:
8.2

Previous treatment:
Metformin

Current facility:
PHC


==================================================
8. MODULE 3 — CLINICAL DATA
==================================================

Store relevant clinical measurements.

For diabetes MVP:

- Age
- Sex
- BMI
- Glucose
- HbA1c
- Blood pressure
- Duration of condition
- Previous treatment
- Previous treatment response
- Relevant comorbidities

Example database:

clinical_records:
id
patient_id
glucose
hba1c
bmi
systolic_bp
diastolic_bp
previous_treatment
previous_response
record_date


==================================================
9. MODULE 4 — MACHINE LEARNING ENGINE
==================================================

The core ML system should learn from historical/public data.

Possible models:

1. Logistic Regression
2. Random Forest
3. XGBoost

Recommended primary model:
XGBoost or Random Forest.

Do not train a huge neural network.

Pipeline:

Dataset
   ↓
Data cleaning
   ↓
Missing value handling
   ↓
Categorical encoding
   ↓
Feature scaling where required
   ↓
Train/test split
   ↓
Model training
   ↓
Cross-validation
   ↓
Evaluation
   ↓
Model selection
   ↓
Save model using joblib


==================================================
10. MODEL OUTPUT
==================================================

The model should NOT output:

"Patient must take Drug X."

Instead, output something like:

Treatment Option A:
Predicted response probability = 0.82

Treatment Option B:
Predicted response probability = 0.67

Treatment Option C:
Predicted response probability = 0.51

Then display:

"These predictions are based on patterns learned from the selected dataset and are intended only as clinical decision support."


==================================================
11. IMPORTANT ML DESIGN ISSUE
==================================================

The team must not fabricate treatment-response labels.

If the selected dataset does not contain treatment and outcome information, it cannot legitimately train a model that predicts treatment response.

Therefore:

OPTION A:
Find a public dataset containing treatment/outcome information.

OR

OPTION B:
Change the ML objective to a clinically appropriate risk/outcome prediction task and use the result to support treatment planning.

The final project documentation must clearly state:
- Dataset source
- Features
- Target variable
- Data preprocessing
- Model
- Evaluation metrics
- Limitations

Do NOT claim that the model is clinically validated.


==================================================
12. MODEL EVALUATION
==================================================

For classification:

Accuracy
Precision
Recall
F1-score
ROC-AUC
Confusion matrix

If probabilities are generated:
Calibration should also be considered.

Display the metrics in an admin/model evaluation page.

Example:

Model:
XGBoost

Accuracy:
XX%

Precision:
XX%

Recall:
XX%

F1:
XX%

ROC-AUC:
XX%


==================================================
13. MODULE 5 — EXPLAINABLE AI
==================================================

Use SHAP.

Purpose:
Explain which patient features influenced the prediction.

Example:

Prediction:
Treatment Option A — 82%

Important factors:
HbA1c
Previous treatment response
BMI
Age
Blood pressure

Display a horizontal feature-importance chart.

Example:

HbA1c              ██████████
Previous response  ████████
BMI                █████
Age                ███
BP                 ██

The doctor should be able to understand why the model produced its prediction.


==================================================
14. MODULE 6 — MEDICINE AFFORDABILITY
==================================================

This is an India-specific differentiating feature.

Create a medicine database.

Fields:

medicine_id
generic_name
brand_name
dosage
form
brand_price
generic_price
jan_aushadhi_available
source
last_verified
notes

Example:

Generic:
Medicine X

Branded:
Brand Y

Branded price:
₹180

Generic price:
₹65

Potential saving:
₹115

Jan Aushadhi availability:
Available / Not verified / Unknown

IMPORTANT:
Do not present invented medicine prices as current real-world prices.

Use a small verified dataset and store:
- source
- date last checked

For the MVP, 10–30 medicine records are sufficient.


==================================================
15. MODULE 7 — PHC / CHC / DISTRICT HOSPITAL REFERRAL
==================================================

The system should understand India's healthcare facility hierarchy for the prototype:

Sub-Centre
    ↓
PHC
    ↓
CHC
    ↓
District Hospital
    ↓
Medical College / Specialist Centre

Create facility database.

Fields:

facility_id
facility_name
facility_type
district
state
available_services

Service database:

service_id
service_name
facility_type
availability
notes

Example:

PHC:
Basic blood glucose
CBC
Basic examination

CHC:
HbA1c
X-ray
Ultrasound
Specialist services depending on facility

The exact availability must be treated as configurable data, not a universal assumption.


==================================================
16. REFERRAL LOGIC
==================================================

Input:

Current facility:
PHC

Required investigation:
HbA1c

System checks:
Is HbA1c available at current facility?

If YES:
"Investigation available locally."

If NO:
"Investigation not listed as available at current facility."

Then identify the next configured facility level:

PHC → CHC

Output:

"Consider referral to CHC for required investigation, subject to local facility availability."

Do not present referral logic as a real-time guaranteed hospital referral unless actual facility data is available.


==================================================
17. MODULE 8 — ABDM / ABHA INTEGRATION
==================================================

This is an advanced feature.

The architecture should support:

Manual patient entry
OR
ABDM/ABHA-based patient data

Flow:

Doctor
  ↓
Enter/select test ABHA patient
  ↓
Consent request
  ↓
Patient authorization
  ↓
ABDM sandbox
  ↓
Health record retrieval
  ↓
Normalize health data
  ↓
Store only necessary authorized information
  ↓
AI analysis

Potential demo:

"Patient history retrieved using consent-based ABDM sandbox integration."

IMPORTANT:
Do not depend on this module for the basic MVP because external sandbox registration, credentials, API availability, and integration requirements can delay development.

Build an interface such as:

PatientDataProvider:
    ManualProvider
    ABDMProvider

This allows the application to work even if ABDM integration is unavailable.


==================================================
18. MODULE 9 — DOCTOR DASHBOARD
==================================================

Main dashboard:

PATIENT INFORMATION

Patient:
P001

Age:
52

Condition:
Type 2 Diabetes

HbA1c:
8.2%

BMI:
27.4


AI ANALYSIS

Risk / predicted outcome:
Moderate

Treatment Option A:
82%

Treatment Option B:
68%

Treatment Option C:
51%


EXPLAINABILITY

Top influencing factors:
HbA1c
Previous treatment response
BMI
Age


AFFORDABILITY

Branded:
₹180

Generic:
₹65

Potential saving:
₹115

Jan Aushadhi:
Available / Not verified


REFERRAL

Current facility:
PHC

Required service:
HbA1c

Availability:
Not configured as available

Suggested next level:
CHC


DISCLAIMER:

"AI-generated decision support only.
Not a diagnosis or prescription.
Final clinical decision must be made by a qualified healthcare professional."


==================================================
19. BACKEND API DESIGN
==================================================

FastAPI endpoints:

AUTH:
POST /auth/login

PATIENTS:
POST /patients
GET /patients
GET /patients/{patient_id}
PUT /patients/{patient_id}

CLINICAL DATA:
POST /patients/{patient_id}/clinical-data
GET /patients/{patient_id}/clinical-data

AI:
POST /ai/analyze/{patient_id}
POST /ai/predict
GET /ai/explanation/{patient_id}

MEDICINES:
GET /medicines
GET /medicines/{medicine_id}
GET /medicines/search
GET /medicines/alternatives/{generic_name}

REFERRAL:
POST /referral/check
GET /facilities
GET /facilities/{facility_id}
GET /facilities/{facility_id}/services

ABDM:
POST /abdm/consent
GET /abdm/consent/{request_id}
GET /abdm/records/{patient_id}

REPORT:
GET /reports/{patient_id}
POST /reports/generate


==================================================
20. DATABASE SCHEMA
==================================================

users
------
id
name
email
password_hash
role
created_at


patients
--------
id
patient_code
age
sex
height
weight
bmi
known_conditions
allergies
current_medications
current_facility_id
created_at


clinical_records
----------------
id
patient_id
glucose
hba1c
systolic_bp
diastolic_bp
bmi
other_parameters
record_date


treatments
----------
id
name
category
description


treatment_predictions
---------------------
id
patient_id
treatment_id
probability
model_version
created_at


medicines
---------
id
generic_name
brand_name
dosage
form
brand_price
generic_price
jan_aushadhi_available
source
last_verified


facilities
----------
id
name
type
district
state


services
--------
id
name
description


facility_services
-----------------
facility_id
service_id
availability


referrals
---------
id
patient_id
current_facility_id
required_service
suggested_facility_type
reason
created_at


model_versions
--------------
id
model_name
version
dataset
metrics
created_at


abdm_records
------------
id
patient_id
external_record_id
record_type
retrieved_at
consent_reference


==================================================
21. FRONTEND PAGES
==================================================

1. Login
2. Dashboard
3. Patient List
4. Patient Profile
5. Add Patient
6. Clinical Data
7. AI Analysis
8. Treatment Comparison
9. Medicine Affordability
10. Referral Guidance
11. Reports
12. Settings
13. Optional ABDM Integration
14. Optional Model Performance page


==================================================
22. FRONTEND COMPONENTS
==================================================

PatientCard
ClinicalDataForm
TreatmentPredictionCard
PredictionChart
SHAPExplanationChart
MedicineComparisonCard
ReferralCard
FacilitySelector
RiskIndicator
PatientHistoryTimeline
ReportGenerator
ConsentStatus
ABDMConnectionStatus


==================================================
23. PROJECT FOLDER STRUCTURE
==================================================

project/
│
├── backend/
│   ├── app/
│   │   ├── main.py
│   │   ├── config.py
│   │   ├── database.py
│   │   │
│   │   ├── models/
│   │   │   ├── patient.py
│   │   │   ├── clinical_record.py
│   │   │   ├── medicine.py
│   │   │   ├── facility.py
│   │   │   └── prediction.py
│   │   │
│   │   ├── schemas/
│   │   │   ├── patient.py
│   │   │   ├── clinical.py
│   │   │   └── prediction.py
│   │   │
│   │   ├── routes/
│   │   │   ├── auth.py
│   │   │   ├── patients.py
│   │   │   ├── ai.py
│   │   │   ├── medicines.py
│   │   │   ├── referral.py
│   │   │   └── abdm.py
│   │   │
│   │   ├── services/
│   │   │   ├── prediction_service.py
│   │   │   ├── medicine_service.py
│   │   │   ├── referral_service.py
│   │   │   └── abdm_service.py
│   │   │
│   │   └── ml/
│   │       ├── train.py
│   │       ├── preprocess.py
│   │       ├── predict.py
│   │       ├── explain.py
│   │       └── models/
│   │
│   ├── requirements.txt
│   └── Dockerfile
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── hooks/
│   │   ├── utils/
│   │   └── App.jsx
│   ├── package.json
│   └── Dockerfile
│
├── data/
│   ├── clinical/
│   ├── medicines/
│   └── facilities/
│
├── notebooks/
│   ├── data_analysis.ipynb
│   └── model_training.ipynb
│
├── models/
│   └── treatment_model.pkl
│
├── docs/
│   ├── architecture.md
│   ├── api.md
│   └── methodology.md
│
├── docker-compose.yml
└── README.md


==================================================
24. DATASET REQUIREMENTS
==================================================

The ML dataset is one of the most important parts of the project.

The dataset must have:
- Clearly defined features
- Clearly defined target
- Sufficient samples
- Appropriate licensing/use permissions
- Documentation/source

The target must match the actual ML claim.

If the goal is treatment response prediction, the dataset must contain treatment and outcome/response information.

If such a dataset cannot be obtained quickly, change the ML target to something defensible, such as:
- outcome prediction
- risk prediction
- disease-control prediction

Then use that prediction as one input to treatment decision support.

Never create fake medical labels simply to make the model work.


==================================================
25. ML PIPELINE
==================================================

Raw dataset
    ↓
Data validation
    ↓
Remove duplicates
    ↓
Handle missing values
    ↓
Encode categorical variables
    ↓
Feature engineering
    ↓
Train/validation/test split
    ↓
Baseline model
    ↓
Random Forest / XGBoost
    ↓
Cross-validation
    ↓
Evaluation
    ↓
SHAP analysis
    ↓
Save model
    ↓
FastAPI inference service


==================================================
26. SECURITY AND PRIVACY
==================================================

Because this is a healthcare application:

- Do not expose patient information in frontend logs.
- Do not commit credentials/API keys to GitHub.
- Store secrets in environment variables.
- Hash passwords.
- Use HTTPS in deployment.
- Validate API inputs.
- Restrict database access.
- Minimize stored patient data.
- Use synthetic data for demonstrations.
- Obtain appropriate authorization before using real patient data.
- Do not send identifiable patient information to an external LLM.
- Keep ABDM credentials private.
- Implement audit logging if time permits.


==================================================
27. AI/LLM USAGE
==================================================

The LLM should NOT directly decide the treatment.

Preferred architecture:

Clinical data
     ↓
ML model
     ↓
Structured prediction
     ↓
Rules/knowledge base
     ↓
Optional LLM
     ↓
Human-readable explanation

Example:

ML output:
{
    "risk": "moderate",
    "option_a_probability": 0.82,
    "option_b_probability": 0.67,
    "important_features": [
        "HbA1c",
        "previous_response",
        "BMI"
    ]
}

The LLM can turn this into:

"Based on the model output, Option A has a higher predicted response for this patient profile. The strongest contributing factors were HbA1c and previous treatment response."

The LLM should not invent medical facts or medications.


==================================================
28. DEMO SCENARIO
==================================================

Use a synthetic test patient.

Example:

Patient:
P001

Age:
52

Condition:
Type 2 Diabetes

HbA1c:
8.2%

BMI:
27.4

Previous treatment:
Metformin

Current facility:
PHC

DEMO FLOW:

1. Doctor logs in.

2. Doctor opens patient P001.

3. Patient clinical history is displayed.

4. Doctor clicks:
"Run AI Analysis"

5. Backend sends data to ML model.

6. Model returns structured prediction.

7. Dashboard displays:
- Predicted outcome/risk
- Treatment-support options
- Confidence/probability
- Important features

8. Doctor opens:
"Explain Prediction"

9. SHAP chart shows important factors.

10. Doctor opens:
"Medicine Affordability"

11. System compares available generic/branded information.

12. Doctor opens:
"Referral Guidance"

13. System checks required service against current facility.

14. System displays:
"Next configured healthcare level: CHC"

15. Optional:
Demonstrate ABDM sandbox consent and retrieval using a test patient.

16. Generate a final report.

17. Show disclaimer:
"Decision support only — clinician review required."


==================================================
29. DEVELOPMENT PRIORITY
==================================================

MUST HAVE:
1. React frontend
2. FastAPI backend
3. Database
4. Patient management
5. Clinical data
6. ML model
7. Prediction API
8. Doctor dashboard

SHOULD HAVE:
9. SHAP explainability
10. Medicine affordability
11. Referral logic

STRETCH:
12. ABDM/ABHA integration
13. RAG/LLM explanation
14. PDF report generation
15. Authentication/role management
16. Advanced analytics


==================================================
30. 5-DAY DEVELOPMENT PLAN
==================================================

DAY 1:
- Setup React
- Setup FastAPI
- Setup database
- Create patient model
- Create patient form
- Create dashboard skeleton
- Establish frontend/backend communication

DAY 2:
- Obtain/clean dataset
- Train ML model
- Evaluate model
- Save model
- Create prediction API
- Test prediction pipeline

DAY 3:
- Integrate ML into dashboard
- Implement SHAP
- Implement medicine database
- Implement generic/branded comparison

DAY 4:
- Implement PHC/CHC/District referral logic
- Complete dashboard
- Improve UI
- Add reports
- Integration testing

DAY 5:
- Attempt ABDM sandbox integration
- Fix bugs
- Test complete demo
- Prepare architecture diagrams
- Prepare PPT
- Prepare documentation
- Prepare final demo dataset


==================================================
31. FINAL PRODUCT ARCHITECTURE
==================================================

                 +------------------+
                 |      DOCTOR      |
                 +--------+---------+
                          |
                          v
                 +------------------+
                 |  React Frontend  |
                 +--------+---------+
                          |
                       REST API
                          |
                          v
                 +------------------+
                 |  FastAPI Backend |
                 +--------+---------+
                          |
        +-----------------+------------------+
        |                 |                  |
        v                 v                  v
+---------------+ +---------------+ +---------------+
| Patient DB    | | ML Prediction | | Rule Engines  |
| Clinical DB   | | Engine        | |               |
+---------------+ +-------+-------+ +-------+-------+
                          |                 |
                          v                 |
                   +-------------+          |
                   | SHAP / XAI  |          |
                   +-------------+          |
                                            |
              +-----------------------------+
              |
              v
      +--------------------+
      | Medicine Database  |
      | Facility Database  |
      +--------------------+

Optional:

      +--------------------+
      | ABDM / ABHA        |
      | Sandbox            |
      +---------+----------+
                |
             Consent
                |
                v
         FastAPI Backend


==================================================
32. EXPECTED PROJECT OUTPUT
==================================================

The completed project should provide:

1. Working web application
2. Doctor dashboard
3. Patient management
4. Clinical data management
5. ML-based prediction
6. Model evaluation metrics
7. Explainable AI
8. Medicine affordability comparison
9. PHC/CHC/District referral support
10. Optional ABDM/ABHA integration
11. Generated decision-support report
12. Complete documentation
13. System architecture diagram
14. Database/ER diagram
15. API documentation
16. ML methodology
17. Limitations and future scope


==================================================
33. FUTURE SCOPE
==================================================

Future versions can add:

- More diseases
- More treatment/outcome datasets
- Real-time hospital service availability
- More comprehensive medicine database
- Regional language support
- Voice-based doctor interaction
- Mobile application
- Advanced RAG system
- More sophisticated treatment-response models
- Federated learning
- Real-world ABDM integration
- Clinical validation
- Integration with hospital information systems


==================================================
34. KEY DIFFERENTIATOR
==================================================

The project should NOT be presented as simply:

"An AI model that recommends medicines."

The stronger positioning is:

"An India-focused AI-assisted clinical decision-support platform that combines personalized clinical analysis with treatment-response prediction, explainable AI, medicine affordability, and healthcare-facility-aware referral guidance, with optional consent-based ABDM/ABHA integration."

This makes the project more practical and differentiated.


==================================================
35. FINAL PROJECT DESCRIPTION
==================================================

AI-driven Personalized Treatment Planning is a software-based clinical decision-support platform that uses machine learning to analyze patient-specific clinical information and historical outcomes to provide personalized treatment-support insights.

The platform provides explainable predictions, allowing healthcare professionals to understand the patient factors that influenced the model output. Unlike a generic treatment recommendation system, the platform incorporates India-specific practical considerations such as branded versus generic medicine affordability and the availability of diagnostic services across different healthcare levels such as PHCs, CHCs, and district hospitals.

An optional ABDM/ABHA sandbox integration can allow authorized test health records to be accessed through a consent-based workflow, reducing manual data entry and demonstrating interoperability with India's digital health ecosystem.

The platform is designed as a decision-support tool rather than an autonomous medical system. The final treatment decision remains with the qualified healthcare professional.


make sure u use less than 10 credits (credit limit for a free tier)

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/61ed3af5-4d84-4f5b-9b3c-12d98dc58fc6).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
