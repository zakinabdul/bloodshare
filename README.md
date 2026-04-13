# LifeLink — Blood Donation Management System

> A centralized, real-time platform connecting donors, hospitals, and administrators to ensure blood is always available for those in need.

---

## Overview

Blood donation is one of the most critical yet underorganized aspects of healthcare. Hospitals frequently face blood shortages while willing donors remain unconnected to those in need. **LifeLink** bridges this gap by managing the complete lifecycle of blood donation — from donor registration and eligibility tracking to hospital blood requests and inventory management.

### Key Highlights

- **Donor Management** — Register donors with blood type, location, and contact info; track donation history.
- **Hospital Network** — Manage partner hospitals and their blood inventory levels.
- **Blood Requests** — Hospitals submit requests with urgency levels (Low / Medium / Critical); admins fulfill them.
- **Donation Logs** — Full audit trail of every donation linked to donor and hospital.
- **Live Stats Dashboard** — Real-time counts of donors, hospitals, available blood units, pending requests, and total donations.
- **Urgency Flagging** — Critical requests are visually highlighted (animated pulse) to prioritize fulfillment.

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | Next.js 16 (App Router), React 19, TypeScript 5 |
| **Styling** | Tailwind CSS v4, Lucide React icons, Geist font |
| **Backend** | FastAPI, Uvicorn, Python 3.x |
| **ORM** | SQLAlchemy 2.x (async) with asyncpg |
| **Validation** | Pydantic v2 |
| **Database** | PostgreSQL (NeonDB or any PostgreSQL instance) |

---

## Project Structure

```
bloodshare/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── page.tsx            # Home — stats dashboard & quick links
│   │   ├── donors/page.tsx     # Donor list & registration form
│   │   ├── hospitals/page.tsx  # Hospital list & add form
│   │   ├── inventory/page.tsx  # Blood inventory per hospital
│   │   ├── requests/page.tsx   # Blood requests (create & fulfill)
│   │   └── donations/page.tsx  # Donation logs
│   ├── components/
│   │   └── Navbar.tsx          # Responsive sticky navigation bar
│   └── lib/
│       └── api.ts              # Shared fetch helper (NEXT_PUBLIC_API_URL)
│
├── backend/
│   ├── main.py                 # FastAPI app, CORS middleware, all routes
│   ├── models.py               # SQLAlchemy ORM models
│   ├── schemas.py              # Pydantic request/response schemas
│   ├── crud.py                 # Database query functions
│   ├── database.py             # Async engine, session, Base, init_db
│   ├── .env.example            # Environment variable template
│   └── requirements.txt        # Python dependencies
│
├── next.config.ts
├── package.json
└── tsconfig.json
```

---

## Database Schema

The backend is built around five relational tables:

| Table | Key Fields |
|---|---|
| `hospitals` | `id`, `name`, `location`, `contact` |
| `donors` | `id`, `name`, `blood_type`, `location`, `contact`, `last_donation_date` |
| `blood_inventory` | `id`, `hospital_id` (FK), `blood_type`, `quantity`, `last_updated` |
| `blood_requests` | `id`, `hospital_id` (FK), `blood_type`, `quantity`, `urgency`, `status`, `created_at` |
| `donation_logs` | `id`, `donor_id` (FK), `hospital_id` (FK), `quantity`, `date`, `status` |

**Supported blood types:** `A+`, `A-`, `B+`, `B-`, `AB+`, `AB-`, `O+`, `O-`

**Request urgency levels:** `LOW`, `MEDIUM`, `CRITICAL`

**Request / donation statuses:** `PENDING`, `FULFILLED` / `SUCCESS`

---

## API Endpoints

The FastAPI backend runs on `http://localhost:8000` by default.

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/stats` | Dashboard counts (donors, hospitals, units, requests, donations) |
| `GET` | `/api/donors` | List all donors |
| `POST` | `/api/donors` | Register a new donor |
| `GET` | `/api/hospitals` | List all hospitals |
| `POST` | `/api/hospitals` | Add a new hospital |
| `GET` | `/api/inventory` | List blood inventory (with hospital name) |
| `POST` | `/api/inventory` | Add an inventory entry |
| `PUT` | `/api/inventory/{inv_id}` | Update inventory quantity |
| `GET` | `/api/requests` | List all blood requests (with hospital name) |
| `POST` | `/api/requests` | Create a blood request |
| `PUT` | `/api/requests/{req_id}` | Update request status (e.g., fulfill) |
| `GET` | `/api/donations` | List all donation logs (with donor & hospital names) |
| `POST` | `/api/donations` | Log a new donation |

Interactive API docs are available at `http://localhost:8000/docs` (Swagger UI).

---

## Getting Started

### Prerequisites

- **Node.js** 18+ and **npm**
- **Python** 3.11+
- A **PostgreSQL** database (local or [NeonDB](https://neon.tech))

---

### 1. Clone the Repository

```bash
git clone https://github.com/zakinabdul/bloodshare.git
cd bloodshare
```

---

### 2. Set Up the Backend

```bash
cd backend

# Create and activate a virtual environment
python -m venv venv
source venv/bin/activate      # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Configure environment
cp .env.example .env
# Edit .env and set your DATABASE_URL:
# DATABASE_URL=postgresql+asyncpg://user:password@host/dbname
```

Start the backend server:

```bash
uvicorn main:app --reload --port 8000
```

The API will be live at `http://localhost:8000`. Tables are created automatically on startup via `init_db()`.

---

### 3. Set Up the Frontend

```bash
# From the project root
npm install
```

Create a `.env.local` file in the project root:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

### 4. Available Frontend Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Build the production bundle |
| `npm start` | Start the production server |
| `npm run lint` | Run ESLint |

---

## Pages & Features

| Page | Route | Description |
|---|---|---|
| **Dashboard** | `/` | Live stats, hero section, quick-access links to all modules |
| **Donors** | `/donors` | View all registered donors; register new donors with blood type, location, contact, and last donation date |
| **Hospitals** | `/hospitals` | View partner hospitals as cards; add new hospitals |
| **Inventory** | `/inventory` | Track blood units per hospital and blood type; update quantities |
| **Requests** | `/requests` | Create blood requests (with urgency); mark requests as fulfilled |
| **Donations** | `/donations` | Log donations linking donors to hospitals; view full donation history |

---

## Environment Variables

### Backend (`backend/.env`)

| Variable | Description |
|---|---|
| `DATABASE_URL` | Full async PostgreSQL connection string, e.g. `postgresql+asyncpg://user:pass@host/db` |

### Frontend (`.env.local`)

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_API_URL` | Base URL of the FastAPI backend (default: `http://localhost:8000`) |

---

## Deployment

### Backend

Deploy the FastAPI app to any Python-compatible host (Railway, Render, Fly.io, etc.):

```bash
uvicorn main:app --host 0.0.0.0 --port 8000
```

Set the `DATABASE_URL` environment variable in your hosting platform to point to your production PostgreSQL database.

### Frontend

The easiest way to deploy the Next.js frontend is [Vercel](https://vercel.com):

1. Push your repository to GitHub.
2. Import the project on Vercel.
3. Set the `NEXT_PUBLIC_API_URL` environment variable to your deployed backend URL.
4. Deploy.

---

## License

This project is open source and available for educational and personal use.
