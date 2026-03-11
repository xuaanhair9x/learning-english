import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Sidebar from './components/Sidebar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import CourseDetail from './pages/CourseDetail';
import ReadAloud from './pages/ReadAloud';
import ReadAloudSession from './pages/ReadAloudSession';
import './App.css';

function AppLayout({ children }) {
    return (
        <div className="app-layout">
            <Sidebar />
            <main className="app-main">
                {children}
            </main>
        </div>
    );
}

export default function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route
                        path="/"
                        element={
                            <AppLayout>
                                <Home />
                            </AppLayout>
                        }
                    />
                    <Route
                        path="/course/:id"
                        element={
                            <AppLayout>
                                <CourseDetail />
                            </AppLayout>
                        }
                    />
                    <Route
                        path="/read-aloud"
                        element={
                            <AppLayout>
                                <ReadAloud />
                            </AppLayout>
                        }
                    />
                    <Route
                        path="/read-aloud/:id"
                        element={
                            <AppLayout>
                                <ReadAloudSession />
                            </AppLayout>
                        }
                    />
                    {/* Fallback */}
                    <Route
                        path="*"
                        element={
                            <AppLayout>
                                <Home />
                            </AppLayout>
                        }
                    />
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    );
}
