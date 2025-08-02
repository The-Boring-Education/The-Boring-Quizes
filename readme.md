# The Boring Quizes

A quiz application built with React, TypeScript, and Vite that integrates with The Boring Education webapp APIs.

## Features

-   **Standalone Google OAuth**: Independent authentication system
-   **User Onboarding**: Custom onboarding flow to collect user preferences
-   **Quiz Categories**: Dynamic loading of quiz categories from TBE webapp
-   **Interactive Quizzes**: Timed questions with instant feedback
-   **MDX Support**: Rich text rendering with code syntax highlighting for questions and answers
-   **User Profile**: View and manage user information
-   **Proper Routing**: Clean URL structure with React Router
-   **TBE Webapp Integration**: Full integration with TBE webapp APIs

## Architecture

This app follows the same pattern as other TBE apps (like Prep Yatra):

-   Handles its own Google OAuth authentication
-   Communicates with TBE webapp APIs for user management
-   Has its own onboarding flow
-   Stores user data locally while syncing with TBE backend
-   Uses React Router for proper page navigation

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

1. User lands on the app and sees the landing page (`/`)
2. Clicking "Get Started" prompts for Google sign-in (`/login`)
3. After authentication, new users go through onboarding (`/onboarding`):
    - Choose username
    - Select occupation
    - Select purposes for using the app
4. Once onboarded, users can access the dashboard (`/dashboard`):
    - Select quiz categories
    - View user profile and stats
5. Taking quizzes (`/quiz/:categoryId`):
    - Timed questions with progress tracking
    - Real-time feedback
6. Viewing results (`/results/:categoryId`):
    - Detailed score breakdown
    - Question-by-question review
    - Submit results to TBE webapp

## API Integration

The app integrates with TBE webapp through these endpoints:

-   `POST /api/v1/user` - Create/find user after Google auth
-   `GET /api/v1/user/onbording?userName={username}` - Check username availability
-   `POST /api/v1/user/onbording?userId={userId}` - Complete user onboarding
-   `GET /api/v1/quiz` - Get available quiz categories
-   `GET /api/v1/quiz/{categoryId}` - Get questions for a category
-   `POST /api/v1/quiz/{categoryId}/attempt` - Submit quiz attempt

## Routing Structure

-   `/` - Landing page
-   `/login` - Google OAuth login
-   `/onboarding` - User onboarding flow (protected)
-   `/dashboard` - Main dashboard with quiz categories (protected)
-   `/quiz/:categoryId` - Take a quiz (protected)
-   `/results/:categoryId` - View quiz results (protected)

## Development

-   Built with Vite for fast development
-   Uses React 18 with TypeScript
-   Styled with Tailwind CSS
-   Icons from Lucide React
-   React Router for navigation
-   TanStack Query for data fetching
-   Google OAuth for authentication
-   React Markdown with syntax highlighting for rich content

## MDX Support

The app now supports rich content rendering for quiz questions and answers:

### Features

-   **Code Syntax Highlighting**: Questions can include code snippets with proper syntax highlighting
-   **Markdown Formatting**: Support for **bold**, _italic_, `inline code`, lists, and more
-   **Code Blocks**: Multi-line code examples with language-specific highlighting
-   **Responsive Design**: Code blocks and content adapt to different screen sizes

### Example Question Format

````markdown
Given the following React component:

```jsx
const Component = () => {
    const [count, setCount] = useState(0)
    return <div>{count}</div>
}
```
````

What will happen when this component renders?

### Supported Languages

-   JavaScript/JSX
-   TypeScript/TSX
-   HTML/CSS
-   JSON
-   And many more via Prism.js

## Key Improvements

1. **Proper Routing**: Each page has its own route instead of all being on `/`
2. **TBE Webapp Integration**: Full integration with TBE webapp APIs
3. **Protected Routes**: Authentication and onboarding checks
4. **Better UX**: Clean navigation and user flow
5. **API Integration**: Real-time data from TBE webapp
6. **Type Safety**: Proper TypeScript interfaces for all API calls
7. **MDX Support**: Rich content rendering with syntax highlighting
