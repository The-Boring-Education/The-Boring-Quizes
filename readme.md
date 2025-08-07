# The Boring Quizes - Next.js App

A quiz application built with Next.js 13 (App Router), TypeScript, and Tailwind CSS that integrates with The Boring Education webapp APIs.

## 🚀 Features

- **Next.js 13 App Router**: Modern routing with app directory structure
- **Server-Side Rendering (SSR)**: Improved performance and SEO
- **Standalone Google OAuth**: Independent authentication system
- **User Onboarding**: Custom onboarding flow to collect user preferences
- **Quiz Categories**: Dynamic loading of quiz categories from TBE webapp
- **Interactive Quizzes**: Timed questions with instant feedback
- **MDX Support**: Rich text rendering with code syntax highlighting for questions and answers
- **User Profile**: View and manage user information
- **Responsive Design**: Mobile-first design with Tailwind CSS
- **TBE Webapp Integration**: Full integration with TBE webapp APIs

## 🏗️ Architecture

This app follows modern Next.js patterns:

- **App Router**: Uses Next.js 13+ app directory structure
- **Client Components**: Uses 'use client' directive for interactive components
- **Protected Routes**: HOC-based route protection with authentication checks
- **SSR-Safe**: Handles localStorage and window access properly for SSR
- **TypeScript**: Fully typed with comprehensive interfaces
- **API Integration**: Communicates with TBE webapp APIs for user management

## 🛠️ Setup

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Environment Configuration**:
   Create a `.env.local` file in the root directory:

3. **Run the development server**:
   ```bash
   npm run dev
   ```

4. **Build for production**:
   ```bash
   npm run build
   npm start
   ```

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── layout.tsx         # Root layout with providers
│   ├── page.tsx           # Landing page (/)
│   ├── login/page.tsx     # Login page
│   ├── dashboard/page.tsx # Dashboard page
│   ├── quiz/[categoryId]/page.tsx    # Dynamic quiz page
│   └── results/[categoryId]/page.tsx # Results page
├── components/            # Reusable components
│   ├── common/           # Common components
│   └── ProtectedRoute.tsx # Route protection HOC
├── contexts/             # React contexts
│   └── AuthContext.tsx   # Authentication context
├── providers/            # Provider components
│   └── QueryProvider.tsx # TanStack Query provider
├── services/             # API services
│   └── api.ts           # API client and endpoints
├── types/                # TypeScript type definitions
│   ├── auth.ts          # Authentication types
│   ├── api.ts           # API response types
│   └── quiz.ts          # Quiz-related types
└── config/               # Configuration
    └── index.ts         # Environment and API configuration
```

## 🔧 TBE Webapp Setup

Make sure the TBE webapp is running and has the following:

1. CORS configured to allow requests from your Next.js app domain
2. The quiz API endpoints available at `/quiz/*`
3. User management endpoints at `/user/*`

## 🚦 User Flow

1. **Landing Page** (`/`) - Marketing page with app overview
2. **Authentication** (`/login`) - Google OAuth sign-in
3. **Onboarding** (External) - Redirects to TBE onboarding app if user not onboarded
4. **Dashboard** (`/dashboard`) - Quiz categories and user stats
5. **Quiz Taking** (`/quiz/[categoryId]`) - Timed questions with progress tracking
6. **Results** (`/results/[categoryId]`) - Score breakdown and question review

## 🔌 API Integration

The app integrates with TBE webapp through these endpoints:

- `POST /user` - Create/find user after Google auth
- `GET /user/onboarding?userName={username}` - Check username availability
- `POST /user/onboarding?userId={userId}` - Complete user onboarding
- `GET /quiz` - Get available quiz categories
- `GET /quiz/{categoryId}` - Get questions for a category
- `POST /quiz/{categoryId}/attempt` - Submit quiz attempt

## 🎨 Styling & UI

- **Tailwind CSS**: Utility-first CSS framework
- **Responsive Design**: Mobile-first approach
- **Dark/Light Theme**: Consistent with TBE brand
- **Animations**: Smooth transitions and micro-interactions
- **Typography**: Clean, readable fonts optimized for quizzes

## 📱 MDX Support

Rich content rendering for quiz questions and answers:

### Features
- **Code Syntax Highlighting**: Multi-language support via Prism.js
- **Markdown Formatting**: Bold, italic, lists, blockquotes
- **Responsive Code Blocks**: Adapts to different screen sizes

### Example
````markdown
Given the following React component:

```jsx
const Component = () => {
    const [count, setCount] = useState(0)
    return <div>{count}</div>
}
```

What will happen when this component renders?
````

## 🔒 Security Features

- **Protected Routes**: Authentication required for quiz pages
- **Token Management**: Secure token storage and refresh
- **CORS Configuration**: Proper cross-origin request handling
- **Environment Variables**: Sensitive data in environment variables

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on git push

### Other Platforms
1. Build the app: `npm run build`
2. Deploy the `.next` folder and `package.json`
3. Set environment variables on your platform
4. Run: `npm start`

## 🧪 Development

- **TypeScript**: Full type safety throughout the app
- **ESLint**: Code linting with Next.js config
- **Hot Reload**: Instant updates during development
- **Error Boundaries**: Graceful error handling

## 📈 Performance

- **Server-Side Rendering**: Faster initial page loads
- **Static Generation**: Where possible for better performance
- **Code Splitting**: Automatic code splitting by Next.js
- **Image Optimization**: Next.js Image component for optimized images
- **Bundle Analysis**: Can be enabled for size optimization

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

Built with ❤️ by The Boring Education Team