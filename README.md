# InfluenceAI - Frontend

This is the frontend for the InfluenceAI project, built with Next.js and React. It provides a user interface for generating AI-powered LinkedIn content and sharing it.

## Features

* **Interactive Form:** Allows users to input their role and a topic for content generation.
* **Seamless LinkedIn Login:** Redirects users through a secure OAuth 2.0 flow.
* **Personalized Dashboard:** Displays a welcome message with the user's LinkedIn name and profile picture.
* **Content History:** Fetches and displays all previously generated posts from the backend.
* **One-Click Sharing:** Allows users to post content directly to their LinkedIn profile.

## Tech Stack

* **Framework:** Next.js, React
* **Styling:** Tailwind CSS
* **Language:** TypeScript (or JavaScript if you chose that)

---

## Setup and Installation

### 1. Clone the Repository
```bash
git clone [https://github.com/YOUR_USERNAME/influenceai-frontend.git](https://github.com/YOUR_USERNAME/influenceai-frontend.git)
cd influenceai-frontend
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Run the Development Server
```bash
npm run dev
```
The application will be available at `http://localhost:3000`.

### 4. Connect to the Backend
This frontend is designed to work with its corresponding backend service. Please ensure the [InfluenceAI Backend](https://github.com/YOUR_USERNAME/influence-os-backend) is running locally on `http://127.0.0.1:8000`.

## Live Demo

This project is deployed and live.
* **Live Application:** [https://influence-ai-frontend.vercel.app/](https://influence-ai-frontend.vercel.app/)
* **Backend API:** [https://influence-ai-backend.onrender.com/docs](https://influence-ai-backend.onrender.com/docs)
