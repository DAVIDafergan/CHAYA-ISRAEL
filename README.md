# Chaya Israel Foundation

A charity website for the Chaya Israel Foundation, providing support for widows, orphans, IDF soldiers, and families in need across Israel. Established by Shilo Kramer in 2004.

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Database**: MySQL via Prisma ORM
- **Authentication**: NextAuth.js v5 (Auth.js) with credentials provider + bcrypt
- **Image Storage**: Cloudinary
- **Payments**: PayPal (PayPal Buttons SDK)
- **Styling**: Tailwind CSS + Radix UI components
- **Deployment**: cPanel Node.js (standalone mode)

## Features

- 🏠 Full charity website with multiple pages (Home, Causes, Mission, Contact, Impact, Involved)
- 💳 PayPal donation integration with webhook processing
- 👤 User authentication (login/signup/account management)
- 📊 Admin dashboard with donation tracking and management
- 🧾 Donation receipts with print functionality
- ☁️ Cloudinary image upload support
- 📱 Fully responsive design
- ♿ Accessibility widget

## Setup Instructions

### Prerequisites

- Node.js 18+
- MySQL 5.7+ or MariaDB 10+
- Cloudinary account
- PayPal developer account

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/DAVIDafergan/CHAYA-ISRAEL.git
   cd CHAYA-ISRAEL
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your actual values
   ```

4. **Set up the database**
   ```bash
   # Generate Prisma client
   npx prisma generate
   
   # Push schema to MySQL database
   npx prisma db push
   ```

5. **Create admin account**
   
   After setting up the database, register the admin account through the `/signup` page or via the API:
   ```bash
   curl -X POST http://localhost:9002/api/signup \
     -H "Content-Type: application/json" \
     -d '{"name":"Admin","email":"chaya123@chayaisrael.com","password":"yourpassword"}'
   ```

6. **Start development server**
   ```bash
   npm run dev
   ```

### Production Build (cPanel)

```bash
# Build the application
npm run build

# The standalone output will be in .next/standalone
# Copy the following to your cPanel Node.js application directory:
# - .next/standalone/
# - .next/static/ (copy to .next/standalone/.next/static/)
# - public/ (copy to .next/standalone/public/)
```

## Environment Variables

Create a `.env` file based on `.env.example`:

```env
# Database (MySQL on cPanel)
DATABASE_URL="mysql://user:password@localhost:3306/chaya_israel"

# NextAuth
NEXTAUTH_URL="https://chayaisrael.com"
NEXTAUTH_SECRET="your-secret-key-here"
AUTH_SECRET="your-secret-key-here"

# Cloudinary
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="your-cloud-name"

# PayPal
PAYPAL_CLIENT_ID="your-paypal-client-id"
PAYPAL_CLIENT_SECRET="your-paypal-client-secret"
PAYPAL_WEBHOOK_ID="your-webhook-id"
NEXT_PUBLIC_PAYPAL_CLIENT_ID="your-paypal-client-id"
```

## Database Setup

The Prisma schema includes the following models:

- **User** - User accounts with authentication support
- **Account** - OAuth accounts (NextAuth adapter)
- **Session** - User sessions (NextAuth adapter)
- **VerificationToken** - Email verification tokens (NextAuth adapter)
- **Donation** - Donation records (from PayPal webhooks)
- **Cause** - Charity causes
- **ContactMessage** - Contact form submissions

```bash
# Generate Prisma client
npx prisma generate

# Apply schema to database (first time or after schema changes)
npx prisma db push

# View database in Prisma Studio
npx prisma studio
```

## API Routes

| Route | Method | Description |
|-------|--------|-------------|
| `/api/auth/[...nextauth]` | GET/POST | NextAuth authentication |
| `/api/signup` | POST | User registration |
| `/api/donations` | GET | Get user's donation history (auth required) |
| `/api/admin/donations` | GET | Get all donations (admin only) |
| `/api/paypal-webhook` | POST | PayPal webhook handler |
| `/api/upload` | POST | Image upload to Cloudinary (auth required) |
| `/api/receipt/[id]` | GET | Get donation receipt data |

## Application Routes

| Route | Description |
|-------|-------------|
| `/` | Homepage |
| `/donate` | Donation form |
| `/causes` | Browse causes |
| `/mission` | About/Mission page |
| `/contact` | Contact page |
| `/impact` | Impact page |
| `/involved` | Get involved page |
| `/account` | User account (auth required) |
| `/login` | Login page |
| `/signup` | Registration page |
| `/admin` | Admin login |
| `/admin/dashboard` | Admin donations dashboard (admin only) |
| `/receipt/[id]` | Donation receipt |

## Admin Access

The admin panel is accessible at `/admin`. Use your manager credentials:
- **Manager ID**: `CHAYA123`  
- **Password**: Your admin account password

The admin account email is `chaya123@chayaisrael.com`. Make sure to create this user via the signup API before trying to access the admin dashboard.

