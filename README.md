# NobelSource 🌾🤝
> **Status**  Production-Ready MVP

NobelSource is a practical, contract-driven B2B marketplace engineered to eliminate devastating market miscommunication between agricultural suppliers and buyers. It directly matches real-time demand with production to keep market prices stable and protect farmers from sudden financial ruin.
## ✨ Key Features
- **Intent Marketplace:** Buyers and suppliers publicly match capabilities before planting (`"We Want..."` / `"We Offer..."`).
- **Secure Protocol Rooms:** Dynamic negotiation workspaces where both parties iron out agreements using unified, real-time channels.
- **Contractual Volume Commitments:** Allows users to shift away from unstable spot-trading to set long-term, periodic volume goals matching certified demand.
- **Logistics Alignment:** Fully integrated, real-time shipment monitoring, milestone tracking, and shared event scheduling.
- **Receipt-Based Financial Auditing:** Supports flexible, off-platform payments by allowing users to upload secure transaction receipts for immediate system tracking.

## 🛠️ Tech Stack
### Frontend
- **Framework & Core:** React 19, Vite, TypeScript, React Router DOM v7
- **State Management & UI:** TanStack React Query v5, Radix UI primitives, Framer Motion
- **Styling:** Tailwind CSS v4 (using `@tailwindcss/vite`), Lucid-React, Phosphor Icons
- **Data & Utilities:** Recharts (Analytics), Date-fns, React-Markdown

### Backend
- **Runtime & Framework:** Node.js, Express v5 (Beta), TypeScript (`tsx`)
- **Database & Architecture:** PostgreSQL (`pg`), Drizzle ORM, Drizzle-Zod validation
- **Real-Time Layer:** Socket.IO (WebSockets for live engine workflows)
- **File Processing & Storage:** Cloudinary, Formidable, Multer, Streamifier
- **Security:** Bcrypt, Cookie-Parser, Express-Session (with `connect-pg-simple`)

---

## 🔑 Environment Setup
Before initiating the application, create a `.env` file in your backend root folder with the following variables configured:

```env
# Database Credentials
DB_HOST=your_postgresql_host
DB_USER=your_postgresql_user
DB_PASSWORD=your_postgresql_password
# Note: Ensure database matches pg connection configurations
DB_NAME=your_database_name
DB_PORT=5432

# Execution Context
NODE_ENV=development

# Security Keys
SESSION_SECRET=your_long_unpredictable_session_string
ENCRYPTION_KEY=your_secure_hex_cryptographic_key

# Third-Party Asset Infrastructure
CLOUDINARY_NAME=your_cloudinary_name
CLOUDINARY_KEY=your_cloudinary_api_key
CLOUDINARY_SECRET=your_cloudinary_api_secret
```

---

## 🚀 Local Installation & Deployment

### Backend Setup
1. Enter the backend subdirectory:
   ```bash
   cd backend
   ```
2. Download all required node packages:
   ```bash
   npm install
   ```
3. Initialize, synchronize, and seed the PostgreSQL database schemas instantly:
   ```bash
   npm run seed:force
   ```
4. Fire up the backend engine with hot-reloading:
   ```bash
   npm run dev
   ```

### Frontend Setup
1. Return and enter the frontend directory:
   ```bash
   cd ../frontend
   ```
2. Download packages and sync compilation structures:
   ```bash
   npm install
   ```
3. Run strict TypeScript check and build verification:
   ```bash
   npm run typecheck
   ```
4. Run the frontend single-page application client:
   ```bash
   npm run dev
   ```

---

## 📈 Current Project State
This platform functions as a robust **Production-Ready MVP (Minimum Viable Product)**. Built during my final year of university, it utilizes strict data typing, schema-safe ORMs, and secure state storage. The system is structurally stable, highly optimized, and prepared for cloud distribution.

## 🤝 Open Source Contributors & Industry Support
NobelSource is open to developers wanting to extend the system and organizations interested in supporting digital agriculture tools.
- **Codebase Support:** Feel free to fork the repository, refine schemas, or optimize real-time streaming endpoints.
- **Sponsorship & Development:** To collaborate or test this out in live farming ecosystems, connect with me directly.

### Engineering Contact
📬 **Email:** [shemab71@gmail.com](mailto:shemab71@gmail.com)
💼 **LinkedIn:** [Shema Bruno](https://linkedin.com)
