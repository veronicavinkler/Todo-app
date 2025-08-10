
Implementing Vercel + Railway step by step

Step 1: Prepare Your Code for Deployment
    1. Update Frontend Configuration
        Create frontend/src/config.js
        const config = {
        apiUrl: process.env.NODE_ENV === 'production' 
            ? process.env.REACT_APP_API_URL || '/api'
            : 'http://localhost:5000/api'
        };
        export default config;

    2. Update Frontend API Calls
        1. Update frontend/src/App.js
        2. Update backend/server.js

Step 2: Push Your Code to GitHub
    In your project root directory:
        # Initialize git (if not already done)
        git init

        # Add all files
        git add .

        # Create .gitignore file
        echo "node_modules/
        .env
        .DS_Store
        npm-debug.log*
        yarn-debug.log*
        yarn-error.log*" > .gitignore

        # Commit your changes
        git add .
        git commit -m "Initial commit - Todo app ready for deployment"

        # Create GitHub repository (go to github.com and create new repo called "todo-app")
        # Then connect it:
        git branch -M main
        git remote add origin https://github.com/YOUR_USERNAME/todo-app.git
        git push -u origin main    

Step 3: Deploy Backend to Railway
    3.1: Sign Up for Railway
        1. Go to https://railway.app
        2. Click "Login"
        3. Sign in with GitHub
        4. Authorize Railway to access your repositories

    3.2 Deploy Backend
        1. Click "New Project"
        2. Select "Deploy from GitHub repo"
        3. Choose your todo-app repository
        4. Railway will ask which service to deploy - choose to create a new service
        5. Configure the service:
            - Service Name: todo-backend
            - Root Directory: Leave blank (Railway will detect the backend folder)

    3.3: Configure Railway Environment
        1. In your Railway project dashboard:
            - Click on your backend service
            - Go to "Variables" tab
            - Add these environment variables:
                NODE_ENV=production
                PORT=5000
        2. Railway will automatically:
            - Detect it's a Node.js project
            - Run npm install in the backend folder
            - Start with npm start

    3.4: Get Your Backend URL
        1. In Railway dashboard:
            - Click on your backend service
            - Go to "Settings" tab
            - Click "Generate Domain"
            - Copy the generated URL (like: https://todo-backend-production-abc123.railway.app)

Step 4: Deploy Frontend to Vercel
    4.1: Sign Up for Vercel
        - Go to https://vercel.com
        - Click "Sign Up"
        - Continue with GitHub
        - Authorize Vercel

    4.2: Deploy Frontend
        1. Click "New Project"
        2. Import your GitHub repository
        3. Configure the project:
            - Framework Preset: Create React App (should - auto-detect)
            - Root Directory: frontend
            - Build Command: npm run build
            - Output Directory: build
            - Install Command: npm install

    4.3: Add Environment Variables
        1. Before deploying, add environment variable:
            - Go to "Environment Variables" section
            - Add:
                - Name: REACT_APP_API_URL
                - Value: https://your-railway-backend-url.railway.app/api
                - Environment: All (Production, Preview, Development) 
        2. Click "Deploy"

Step 5: Update CORS Settings
After you get your Vercel URL, update your backend:
    5.1: Update Backend Environment Variables
    In Railway dashboard:
        1. Go to your backend service
        2. Click "Variables"
        3. Add:
            FRONTEND_URL=https://your-vercel-url.vercel.app

    5.2: Test Your Deployment
        1. Open your Vercel URL
        2. You should see:
            - "Todo App" heading
            - "Status: Backend connected successfully!"
            - The 3 sample todos
            - Working add/delete functionality

Step 6: Automatic Deployments
Now whenever you:
    1. Push to GitHub → Both Railway and Vercel automatically redeploy
    2. No manual steps needed for updates
    3. Live in ~2-3 minutes after pushing code
