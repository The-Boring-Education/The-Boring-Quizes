import {
    BrowserRouter as Router,
    Routes,
    Route,
    Navigate
} from "react-router-dom"
import { useAuth } from "./contexts/AuthContext"
import Landing from "./components/Landing"
import Login from "./components/Login"
import Dashboard from "./components/Dashboard"
import Quiz from "./components/Quiz"
import Results from "./components/Results"
import ProtectedRoute from "./components/ProtectedRoute"

function App() {
    const { loading } = useAuth()

    if (loading) {
        return (
            <div className='min-h-screen flex items-center justify-center'>
                <div className='text-2xl font-semibold'>Loading...</div>
            </div>
        )
    }

    return (
        <Router>
            <Routes>
                {/* Public routes */}
                <Route path='/' element={<Landing />} />
                <Route path='/login' element={<Login />} />

                {/* Protected routes */}
                <Route
                    path='/dashboard'
                    element={
                        <ProtectedRoute>
                            <Dashboard />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path='/quiz/:categoryId'
                    element={
                        <ProtectedRoute>
                            <Quiz />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path='/results/:categoryId'
                    element={
                        <ProtectedRoute>
                            <Results />
                        </ProtectedRoute>
                    }
                />

                {/* Redirect to landing if no route matches */}
                <Route path='*' element={<Navigate to='/' replace />} />
            </Routes>
        </Router>
    )
}

export default App
