# Deployment TODO for Render + MongoDB Atlas

## [✅] 1. File Edits (Done)
   - package.json scripts updated for prod (start: node index.js, dev: nodemon index.js)
   - /api/test-db endpoint added in index.js  
   - .env.example created

## [ ] 2. MongoDB Atlas Setup (Manual)
   - Sign up at mongodb.com/atlas
   - Create free M0 cluster
   - Create DB user & get SRV URI (format: mongodb+srv://<user:pass@cluster...>/expensetracker...)
   - Network: Allow 0.0.0.0/0
   - Note URI & strong JWT_SECRET (32+ chars)

## [ ] 3. Local Test
   - Update .env with Atlas URI
   - `npm run dev`
   - Test POST /api/auth/register, GET /health, GET /api/test-db

## [ ] 4. Deploy to Render
   - Push to GitHub repo
   - New Web Service on render.com (connect repo)
   - Runtime: Node
   - Build: `npm install`
   - Start: `npm start`
   - Env vars: MONGO_URI=..., JWT_SECRET=..., PORT=10000 (Render uses)
   - Deploy & test endpoints

## [ ] 5. Verify
   - Logs show ✅ MongoDB connected
   - /health & /api/test-db OK

