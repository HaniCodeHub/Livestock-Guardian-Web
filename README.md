<div align="center">

<!-- ANIMATED BANNER -->
<img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=6,11,20&height=200&section=header&text=Livestock%20Guardian&fontSize=60&fontColor=fff&animation=twinkling&fontAlignY=35&desc=AI-Powered%20Livestock%20Identity%20%26%20Management%20SaaS&descAlignY=55&descFontSize=18" width="100%"/>

<!-- BADGES ROW 1 -->
<p align="center">
  <img src="https://img.shields.io/badge/Status-Live%20%26%20Deployed-brightgreen?style=for-the-badge&logo=checkmarx&logoColor=white" />
  <img src="https://img.shields.io/badge/AI%20Powered-Gemini%20%2B%20PyTorch-blue?style=for-the-badge&logo=google&logoColor=white" />
  <img src="https://img.shields.io/badge/University-AI%20SaaS%20Project-orange?style=for-the-badge&logo=graduation-cap&logoColor=white" />
</p>

<!-- BADGES ROW 2 -->
<p align="center">
  <img src="https://img.shields.io/badge/React-18+-61DAFB?style=for-the-badge&logo=react&logoColor=black" />
  <img src="https://img.shields.io/badge/FastAPI-Backend-009688?style=for-the-badge&logo=fastapi&logoColor=white" />
  <img src="https://img.shields.io/badge/Supabase-Database-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white" />
  <img src="https://img.shields.io/badge/TypeScript-Frontend-3178C6?style=for-the-badge&logo=typescript&logoColor=white" />
  <img src="https://img.shields.io/badge/Python-Backend-3776AB?style=for-the-badge&logo=python&logoColor=white" />
</p>

<!-- LIVE DEMO BUTTON -->
<p align="center">
  <a href="https://livestock-guardian-biometric.onrender.com/health" target="_blank">
    <img src="https://img.shields.io/badge/🚀%20Live%20API-Render%20Deployed-success?style=for-the-badge" />
  </a>
  <a href="https://livestock-guardian-biometric.onrender.com/docs" target="_blank">
    <img src="https://img.shields.io/badge/📚%20API%20Docs-Swagger%20UI-blue?style=for-the-badge" />
  </a>
</p>

<br/>

> **Livestock Guardian** is an AI-powered Livestock Identity & Management SaaS Platform that uses  
> **biometric muzzle recognition**, **Gemini AI**, and **real-time ownership tracking** to prevent  
> livestock theft, digitize animal records, and modernize agricultural management.

<br/>

</div>

---

## 📋 Table of Contents

<details>
<summary>Click to expand</summary>

- [🌟 Project Overview](#-project-overview)
- [✨ Key Features](#-key-features)
- [🏗️ System Architecture](#️-system-architecture)
- [🛠️ Technology Stack](#️-technology-stack)
- [🚀 Live Deployment](#-live-deployment)
- [📁 Project Structure](#-project-structure)
- [⚙️ Installation & Setup](#️-installation--setup)
- [🔌 API Documentation](#-api-documentation)
- [🗄️ Database Schema](#️-database-schema)
- [🤖 AI & ML Pipeline](#-ai--ml-pipeline)
- [🔐 Security](#-security)
- [📊 Performance Metrics](#-performance-metrics)
- [🗺️ Roadmap](#️-roadmap)
- [👥 Team](#-team)
- [📄 License](#-license)

</details>

---

## 🌟 Project Overview

<table>
<tr>
<td width="50%">

### 🎯 Problem Statement

Pakistan has **over 80 million livestock** animals with:

-  No digital identity system
-  Rampant livestock theft
-  Fake ownership disputes
-  No health tracking records
-  Manual and corrupt valuation
-  Zero traceability

</td>
<td width="50%">

### 💡 Our Solution

**Livestock Guardian** solves this with:

-  Biometric muzzle recognition
-  AI-powered livestock analysis
-  Digital ownership ledger
-  Real-time theft alerts
-  Gemini AI health insights
-  SaaS-grade infrastructure

</td>
</tr>
</table>

---

## ✨ Key Features

<div align="center">

| Feature | Description | Status |
|---------|-------------|--------|
| 🔐 **Authentication** | Email/Phone login with JWT & OTP |  Live |
| 🐄 **Livestock Registration** | Complete animal profiles with images |  Live |
| 🧬 **Biometric Identity** | Siamese Neural Network muzzle recognition |  Live |
| 🤖 **AI Assistant** | Gemini-powered livestock Q&A |  Live |
| 🔬 **Breed Prediction** | AI vision-based breed identification |  Live |
| 💊 **Health Insights** | AI-generated health recommendations |  Live |
| 💰 **Price Estimation** | Market-based AI pricing suggestions |  Live |
| 🚨 **Theft Reporting** | Instant global theft alerts |  Live |
| 📋 **Ownership Transfer** | Immutable ownership ledger |  Live |
| 📊 **Analytics Dashboard** | Real-time livestock metrics |  Live |

</div>

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    LIVESTOCK GUARDIAN                        │
│                   System Architecture                        │
└─────────────────────────────────────────────────────────────┘

┌──────────────────────┐
│   React + Vite       │  ← Frontend (Vercel)
│   TypeScript         │
│   Tailwind + ShadCN  │
└──────────┬───────────┘
           │ HTTPS / REST API
           ▼
┌──────────────────────┐
│   FastAPI Backend    │  ← API Server (Render)
│   Python 3.11+       │
│   JWT Auth           │
│   Pydantic Models    │
└──────┬───────┬───────┘
       │       │
       ▼       ▼
┌──────────┐  ┌─────────────────┐
│ Supabase │  │   AI Services   │
│ PostgreSQL│  │                 │
│ Auth     │  │ ┌─────────────┐ │
│ Storage  │  │ │ Gemini API  │ │
│ pgvector │  │ │ (Assistant) │ │
└──────────┘  │ └─────────────┘ │
              │ ┌─────────────┐ │
              │ │ PyTorch +   │ │
              │ │ ONNX Runtime│ │
              │ │ (Biometric) │ │
              │ └─────────────┘ │
              └─────────────────┘
```

### 🔄 Data Flow

```
User Uploads Muzzle Image
         │
         ▼
Frontend Validates (size, blur, format)
         │
         ▼
Image → Supabase Storage
         │
         ▼
FastAPI → ONNX Model → Generate Embedding Vector
         │
         ▼
pgvector → Similarity Search → Match Found?
         │                           │
         ▼                           ▼
   New Animal                  Existing Animal
   Register Profile            Return Profile
```

---

## 🛠️ Technology Stack

<div align="center">

### Frontend
![React](https://img.shields.io/badge/React_18-61DAFB?style=flat-square&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat-square&logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white)
![ShadCN](https://img.shields.io/badge/ShadCN_UI-000000?style=flat-square&logo=shadcnui&logoColor=white)
![Zustand](https://img.shields.io/badge/Zustand-orange?style=flat-square)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-0055FF?style=flat-square&logo=framer&logoColor=white)

### Backend
![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=flat-square&logo=fastapi&logoColor=white)
![Python](https://img.shields.io/badge/Python_3.11-3776AB?style=flat-square&logo=python&logoColor=white)
![SQLAlchemy](https://img.shields.io/badge/SQLAlchemy-D71F00?style=flat-square&logo=sqlalchemy&logoColor=white)
![Pydantic](https://img.shields.io/badge/Pydantic-E92063?style=flat-square&logo=pydantic&logoColor=white)

### Database & Cloud
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=flat-square&logo=supabase&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=flat-square&logo=postgresql&logoColor=white)

### AI & ML
![Google Gemini](https://img.shields.io/badge/Google_Gemini-4285F4?style=flat-square&logo=google&logoColor=white)
![PyTorch](https://img.shields.io/badge/PyTorch-EE4C2C?style=flat-square&logo=pytorch&logoColor=white)
![ONNX](https://img.shields.io/badge/ONNX_Runtime-005CED?style=flat-square&logo=onnx&logoColor=white)

### Deployment
![Render](https://img.shields.io/badge/Render-46E3B7?style=flat-square&logo=render&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=flat-square&logo=vercel&logoColor=white)
![Google Colab](https://img.shields.io/badge/Google_Colab-F9AB00?style=flat-square&logo=googlecolab&logoColor=white)
![Hugging Face](https://img.shields.io/badge/Hugging_Face-FFD21E?style=flat-square&logo=huggingface&logoColor=black)

</div>

---

##  Live Deployment

<div align="center">

| Service | URL | Status |
|---------|-----|--------|
| 🖥️ **API Server** | [livestock-guardian-biometric.onrender.com](https://livestock-guardian-biometric.onrender.com) | ![Live](https://img.shields.io/badge/Live-brightgreen) |
| 📚 **API Documentation** | [/docs](https://livestock-guardian-biometric.onrender.com/docs) | ![Live](https://img.shields.io/badge/Live-brightgreen) |
| ❤️ **Health Check** | [/health](https://livestock-guardian-biometric.onrender.com/health) | ![Live](https://img.shields.io/badge/Live-brightgreen) |
| 🗄️ **Database** | Supabase Cloud | ![Live](https://img.shields.io/badge/Live-brightgreen) |
| 🤖 **AI Model** | Hugging Face Hub | ![Live](https://img.shields.io/badge/Live-brightgreen) |

</div>

> ⚠️ **Note:** Server uses Render free tier — may take **60 seconds** to wake from sleep.  
> Simply refresh the page after waiting.

### Quick Health Check

```bash
curl https://livestock-guardian-biometric.onrender.com/health

# Expected Response:
# {"status":"ok","model_ready":true}
```

---

## 📁 Project Structure

```
Artificial-Intelligence/
│
├── 📁 frontend/                    # React + Vite Frontend
│   ├── 📁 src/
│   │   ├── 📁 components/          # Reusable UI Components
│   │   │   ├── Dashboard/
│   │   │   ├── Livestock/
│   │   │   ├── AI/
│   │   │   └── Common/
│   │   ├── 📁 pages/               # Application Pages
│   │   │   ├── Home.tsx
│   │   │   ├── Dashboard.tsx
│   │   │   ├── Register.tsx
│   │   │   └── ...
│   │   ├── 📁 hooks/               # Custom React Hooks
│   │   ├── 📁 store/               # Zustand State Management
│   │   ├── 📁 services/            # API Service Layer
│   │   ├── 📁 layouts/             # Page Layouts
│   │   └── 📁 types/               # TypeScript Types
│   ├── 📄 package.json
│   ├── 📄 vite.config.ts
│   └── 📄 tsconfig.json
│
├── 📁 backend/                     # FastAPI Backend
│   ├── 📁 app/
│   │   ├── 📁 api/                 # API Route Handlers
│   │   │   ├── auth.py
│   │   │   ├── livestock.py
│   │   │   ├── ai.py
│   │   │   ├── biometric.py
│   │   │   └── ownership.py
│   │   ├── 📁 models/              # Database Models
│   │   ├── 📁 services/            # Business Logic
│   │   ├── 📁 ai/                  # AI Integration
│   │   ├── 📁 auth/                # Authentication
│   │   └── 📁 db/                  # Database Config
│   ├── 📄 main.py
│   └── 📄 requirements.txt
│
├── 📁 biometric-model/             # AI/ML Pipeline
│   ├── 📁 training/                # Model Training (Colab)
│   ├── 📁 inference/               # ONNX Inference
│   └── 📄 README.md
│
├── 📁 docs/                        # Documentation
│   ├── 📄 Project_Report.pdf
│   ├── 📄 Presentation.pptx
│   └── 📁 screenshots/
│
├── 📄 README.md                    # You are here
├── 📄 .gitignore
└── 📄 LICENSE
```

---

## ⚙️ Installation & Setup

### Prerequisites

```bash
# Required Software
Node.js >= 18.0
Python >= 3.11
Git
```

### 1️⃣ Clone Repository

```bash
git clone https://github.com/YOUR_USERNAME/Artificial-Intelligence.git
cd Artificial-Intelligence
```

### 2️⃣ Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Create environment file
cp .env.example .env.local
```

Edit `.env.local`:

```env
VITE_API_URL=https://livestock-guardian-biometric.onrender.com
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

```bash
# Start development server
npm run dev

# Build for production
npm run build
```

### 3️⃣ Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate (Windows)
venv\Scripts\activate

# Activate (Mac/Linux)
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create environment file
cp .env.example .env
```

Edit `.env`:

```env
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_service_key
GEMINI_API_KEY=your_gemini_api_key
API_SECRET_KEY=LG_3ca24a88955994ccbcc8b4285626fcb22f3f01bcad3f07cc51d077b19b9f75c8
```

```bash
# Start FastAPI server
uvicorn main:app --reload --port 8000

# API Docs available at:
# http://localhost:8000/docs
```

### 4️⃣ Verify Everything Works

```bash
# Check API health
curl http://localhost:8000/health

# Expected:
# {"status":"ok","model_ready":true}
```

---

## 🔌 API Documentation

### Base URL

```
Production: https://livestock-guardian-biometric.onrender.com
Local:      http://localhost:8000
```

### Authentication

All protected routes require:

```http
Authorization: Bearer YOUR_JWT_TOKEN
X-API-Key: LG_3ca24a88955994ccbcc8b4285626fcb22f3f01bcad3f07cc51d077b19b9f75c8
```

### Core Endpoints

<details>
<summary>🔐 Authentication APIs</summary>

```http
POST /auth/register
Content-Type: application/json

{
  "name": "Muhammad Ahmad",
  "email": "ahmad@example.com",
  "password": "securepassword",
  "phone": "+923001234567"
}
```

```http
POST /auth/login
Content-Type: application/json

{
  "email": "ahmad@example.com",
  "password": "securepassword"
}
```

</details>

<details>
<summary>🐄 Livestock APIs</summary>

```http
POST /livestock/register
Authorization: Bearer {token}
Content-Type: multipart/form-data

{
  "animal_name": "Gulabi",
  "breed": "Sahiwal",
  "species": "cow",
  "age": 4,
  "weight": 450.5,
  "gender": "female",
  "images": [file1, file2, file3]
}
```

```http
GET /livestock/all
Authorization: Bearer {token}
```

```http
GET /livestock/{livestock_id}
Authorization: Bearer {token}
```

</details>

<details>
<summary>🤖 AI APIs</summary>

```http
POST /ai/chat
Authorization: Bearer {token}
Content-Type: application/json

{
  "message": "Why is my buffalo losing weight?",
  "livestock_id": "uuid-here"
}
```

```http
POST /ai/breed
Authorization: Bearer {token}
Content-Type: multipart/form-data

{
  "image": file
}
```

```http
POST /ai/health
Authorization: Bearer {token}
Content-Type: multipart/form-data

{
  "image": file,
  "notes": "Animal seems lethargic"
}
```

</details>

<details>
<summary>🧬 Biometric APIs</summary>

```http
POST /biometric/register
Authorization: Bearer {token}
Content-Type: multipart/form-data

{
  "livestock_id": "uuid-here",
  "muzzle_image": file
}
```

```http
POST /biometric/match
Authorization: Bearer {token}
Content-Type: multipart/form-data

{
  "muzzle_image": file
}

# Response:
{
  "matched": true,
  "confidence": 94.7,
  "livestock_id": "uuid-here",
  "animal_name": "Gulabi"
}
```

</details>

<details>
<summary>🚨 Theft APIs</summary>

```http
POST /theft/report
Authorization: Bearer {token}
Content-Type: application/json

{
  "livestock_id": "uuid-here",
  "description": "Stolen from farm last night",
  "location": "Lahore, Punjab"
}
```

</details>

---

## 🗄️ Database Schema

```sql
-- 7 Tables in Supabase PostgreSQL

-- 1. Users
CREATE TABLE users (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT NOT NULL,
  email       TEXT UNIQUE NOT NULL,
  phone       TEXT,
  role        TEXT DEFAULT 'farmer',
  created_at  TIMESTAMP DEFAULT NOW()
);

-- 2. Livestock
CREATE TABLE livestock (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id    UUID REFERENCES users(id),
  animal_name TEXT NOT NULL,
  breed       TEXT,
  species     TEXT,
  age         INTEGER,
  weight      DECIMAL,
  gender      TEXT,
  status      TEXT DEFAULT 'healthy',
  created_at  TIMESTAMP DEFAULT NOW()
);

-- 3. Livestock Images
CREATE TABLE livestock_images (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  livestock_id UUID REFERENCES livestock(id),
  image_url    TEXT NOT NULL,
  image_type   TEXT -- 'front', 'side', 'muzzle'
);

-- 4. Embeddings (Biometric)
CREATE TABLE embeddings (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  livestock_id UUID REFERENCES livestock(id),
  embedding    VECTOR(512),
  confidence   FLOAT,
  created_at   TIMESTAMP DEFAULT NOW()
);

-- 5. Theft Reports
CREATE TABLE theft_reports (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  livestock_id UUID REFERENCES livestock(id),
  reported_by  UUID REFERENCES users(id),
  description  TEXT,
  created_at   TIMESTAMP DEFAULT NOW()
);

-- 6. Ownership History
CREATE TABLE ownership_history (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  livestock_id   UUID REFERENCES livestock(id),
  from_owner     UUID REFERENCES users(id),
  to_owner       UUID REFERENCES users(id),
  transferred_at TIMESTAMP DEFAULT NOW()
);

-- 7. AI Logs
CREATE TABLE ai_logs (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      UUID REFERENCES users(id),
  livestock_id UUID REFERENCES livestock(id),
  prompt       TEXT,
  response     TEXT,
  created_at   TIMESTAMP DEFAULT NOW()
);
```

---

## 🤖 AI & ML Pipeline

### Biometric Model Architecture

```
Muzzle Image Input (224x224)
         │
         ▼
┌─────────────────────┐
│  Siamese Neural     │
│  Network            │
│                     │
│  Backbone: ResNet50 │
│  + Custom Head      │
└────────┬────────────┘
         │
         ▼
  512-dim Embedding Vector
         │
         ▼
pgvector Similarity Search
         │
         ▼
Cosine Similarity Score
         │
    ┌────┴────┐
    │         │
   >90%      <85%
    │         │
  Match    Re-scan
```

### Model Training Summary

```
Dataset:     Custom muzzle image dataset
Framework:   PyTorch
Platform:    Google Colab (GPU)
Exported:    ONNX Runtime
Hosted:      Hugging Face Hub
Inference:   FastAPI + ONNX Runtime
```

### Confidence Thresholds

| Score | Action | Color |
|-------|--------|-------|
| > 90% | ✅ Confirmed Match | 🟢 Green |
| 85-90% | ⚠️ Warning — Verify | 🟡 Amber |
| < 85% | ❌ Re-scan Required | 🔴 Red |

---

## 🔐 Security

```
🔒 JWT Authentication        — Secure token-based sessions
🔑 API Key Protection        — All routes require API key
🛡️ Role-Based Access         — Farmer / Vet / Admin roles
📁 Signed URLs               — Secure file access
🔐 Encrypted Storage         — Supabase encryption at rest
🚫 Duplicate Blocking        — Biometric prevents re-registration
📜 Immutable Audit Trail     — Ownership history locked
🔒 HTTPS Only                — All communication encrypted
```

---

## 📊 Performance Metrics

<div align="center">

| Metric | Target | Status |
|--------|--------|--------|
| Dashboard Load | < 2 seconds | ✅ |
| AI Response Time | < 5 seconds | ✅ |
| Biometric Retrieval | < 3 seconds | ✅ |
| Upload Success Rate | > 98% | ✅ |
| Duplicate Detection | > 95% | ✅ |
| API Uptime | 24/7 | ✅ |

</div>

---

## 🗺️ Roadmap

```
✅ Phase 1 — Foundation
   React Frontend + FastAPI Backend + Supabase Setup

✅ Phase 2 — Core Platform
   Livestock CRUD + Dashboard + File Uploads

✅ Phase 3 — AI Integration
   Gemini Assistant + Breed Prediction + Health Analysis

✅ Phase 4 — Biometric Prototype
   Muzzle Upload + Embedding Generation + Matching

✅ Phase 5 — Real ML Integration
   PyTorch Training + ONNX Export + FastAPI Inference

✅ Phase 6 — SaaS Polish
   Premium UI + Animations + Production Deployment

🔜 Phase 7 — Future (Post-MVP)
   Android App + Urdu Language + GPS Tracking
   QR Livestock Tags + Insurance Integration
   Government Registry APIs + Marketplace
```

---

## 📄 Project Documents

| Document | Link |
|----------|------|
| 📊 Project Report | [View Report](./docs/Project_Report.pdf) |
| 📽️ Presentation (PPT) | [View Slides](./docs/Presentation.pptx) |
| 📚 API Documentation | [Swagger UI](https://livestock-guardian-biometric.onrender.com/docs) |

---

## 👥 Team

<div align="center">

| Name | Roll Number | Role |
|------|-------------|------|
| Muhammad Hanan | BSCSM-A-23-13 | Full Stack + AI Engineer |
| Muhammad Asad Riaz | BSCSM-A-23-23 | Backend Developer |

**Course:** Artificial Intelligence  
**University:** University of Layyah  
**Semester:** 6th  
**Submitted:** 08/06/2026

</div>

---

## 📜 License

```
MIT License

Copyright (c) 2026 Livestock Guardian Team

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software to use, copy, modify, and distribute, subject to the following:

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND.
```

---

<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=6,11,20&height=100&section=footer" width="100%"/>

**Built with ❤️ for Agricultural Innovation**

*Livestock Guardian — Protecting Every Animal, Empowering Every Farmer*

⭐ **Star this repo if you found it helpful!** ⭐

</div>
