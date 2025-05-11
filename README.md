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

![Screenshot 2025-05-11 183002](https://github.com/user-attachments/assets/e84f9435-4381-4704-8756-c69aa1755900)
![Screenshot 2025-05-11 182553](https://github.com/user-attachments/assets/7bfe6017-727e-4a1c-a623-4779fb20a2a2)
![Screenshot 2025-05-11 182545](https://github.com/user-attachments/assets/cb5e17e7-5d0c-472d-85c1-c7a1f068e22e)
![Screenshot 2025-05-11 182533](https://github.com/user-attachments/assets/672084e9-5752-4bcd-9b90-53db9234b3bc)
![Screenshot 2025-05-11 182856](https://github.com/user-attachments/assets/b3e852ac-8ac7-429b-b16c-5cd903f32f79)
![Screenshot 2025-05-11 182844](https://github.com/user-attachments/assets/e390335a-ad68-4248-8f05-8dd579d0291e)
![Screenshot 2025-05-11 182739](https://github.com/user-attachments/assets/553e1444-99f7-4c42-825a-83655ab43c07)
![Screenshot 2025-05-11 182600](https://github.com/user-attachments/assets/7bb58d78-bdfe-4336-a42f-44fc9884b433)

