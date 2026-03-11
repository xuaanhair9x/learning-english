import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Sidebar from './components/Sidebar';
import Home from './pages/home/Home';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import CourseDetail from './pages/course/CourseDetail';
import ReadAloud from './pages/read-aloud/ReadAloud';
import ReadAloudSession from './pages/read-aloud/ReadAloudSession';
import Dictation from './pages/dictation/Dictation';
import DictationPassageList from './pages/dictation/DictationPassageList';
import DictationSession from './pages/dictation/DictationSession';
import Profile from './pages/profile/Profile';
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

const layoutRoute = (path, Component) => (
    <Route key={path} path={path} element={<AppLayout><Component /></AppLayout>} />
);

export default function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />

                    {layoutRoute("/", Home)}
                    {layoutRoute("/course/:id", CourseDetail)}
                    {layoutRoute("/read-aloud", ReadAloud)}
                    {layoutRoute("/read-aloud/:id", ReadAloudSession)}
                    {layoutRoute("/dictation", Dictation)}
                    {layoutRoute("/dictation/:collectionId", DictationPassageList)}
                    {layoutRoute("/dictation/passage/:passageId", DictationSession)}
                    {layoutRoute("/profile", Profile)}
                    {layoutRoute("*", Home)}
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    );
}
