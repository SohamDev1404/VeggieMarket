Veggie Market is a modern web application for managing and selling fresh fruits and vegetables online.
It features user authentication, product management, role-based access control, and a clean, responsive UI.

✨ Features
🛒 Product Browsing — View fresh products with categories, prices, and descriptions.

🔒 Authentication — Secure login system using NextAuth.js and JWT.

👨‍💼 Admin Access — Only Admins can create, edit, or delete products.

🖥️ Responsive Design — Fully optimized for desktop and mobile.

💬 Error Handling — Friendly error messages and loading states.

⚡ Fast Performance — Built with Next.js and optimized queries.

📚 Tech Stack
Frontend: Next.js, React, TypeScript

Backend: Next.js API Routes, Prisma ORM

Database: PostgreSQL

Authentication: NextAuth.js (JWT Strategy)

Password Security: bcryptjs

ORM: Prisma

Deployment: (e.g., Vercel, Railway, Render) (add where you plan to deploy)

git clone https://github.com/SohamDev1404/FreshHarvest.git
cd FreshHarvest

npm install
# or
yarn install

DATABASE_URL="postgresql://neondb_owner:npg_WRmaNE03AyQZ@ep-weathered-pine-a4kz4lmj-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require"
NEXTAUTH_SECRET="your-random-secret"
NEXTAUTH_URL="http://localhost:3000"

npx prisma migrate dev --name init
psql -U postgres
# enter password
CREATE DATABASE freshharvest;
\q
npx prisma db push
npx prisma db seed
npm run dev



npm run dev
# or
yarn dev


Open http://localhost:3000 in your browser to see the app.

