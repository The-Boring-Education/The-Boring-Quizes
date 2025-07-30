# The Boring Quizes

A quiz application built with React, TypeScript, and Vite that integrates with The Boring Education webapp APIs.

## Features

-   **Standalone Google OAuth**: Independent authentication system
-   **User Onboarding**: Custom onboarding flow to collect user preferences
-   **Quiz Categories**: Dynamic loading of quiz categories from TBE webapp
-   **Interactive Quizzes**: Timed questions with instant feedback
-   **User Profile**: View and manage user information

## Architecture

This app follows the same pattern as other TBE apps (like Prep Yatra):

-   Handles its own Google OAuth authentication
-   Communicates with TBE webapp APIs for user management
-   Has its own onboarding flow
-   Stores user data locally while syncing with TBE backend

## Setup

1. **Install dependencies**:

    ```bash
    npm install
    ```

2. **Environment Configuration**:
   Create a `.env` file in the root directory:

    ```env
    VITE_TBE_WEBAPP_API_URL=http://localhost:3000
    VITE_GOOGLE_CLIENT_ID=your-google-client-id
    ```

3. **Run the application**:
    ```bash
    npm run dev
    ```

## TBE Webapp Setup

Make sure the TBE webapp is running and has the following:

1. CORS configured to allow requests from `http://localhost:5173`
2. The quiz API endpoints available at `/api/v1/quiz/*`
3. User management endpoints at `/api/v1/user/*`

## User Flow

1. User lands on the app and sees the landing page
2. Clicking "Get Started" prompts for Google sign-in
3. After authentication, new users go through onboarding:
    - Choose username
    - Select occupation
    - Select purposes for using the app
4. Once onboarded, users can:
    - Select quiz categories
    - Take timed quizzes
    - View results with explanations
    - Access their profile

## API Integration

The app integrates with TBE webapp through these endpoints:

-   `POST /api/v1/user` - Create/find user after Google auth
-   `GET /api/v1/user/onbording?userName={username}` - Check username availability
-   `POST /api/v1/user/onbording?userId={userId}` - Complete user onboarding
-   `GET /api/v1/quiz/categories` - Get available quiz categories
-   `GET /api/v1/quiz/{categoryId}/questions` - Get questions for a category

## Development

-   Built with Vite for fast development
-   Uses React 18 with TypeScript
-   Styled with Tailwind CSS
-   Icons from Lucide React
