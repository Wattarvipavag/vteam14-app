import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import ProfilePage from './pages/ProfilePage';
import Wallet from './pages/profile/Wallet';
import History from './pages/profile/History';
import Account from './pages/profile/Account';
import Overview from './pages/profile/Overview';
import Spinner from './components/Spinner';
import { useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from './config/firebaseConfig';
import ScanPage from './pages/ScanPage';

function App() {
    const [user, loading] = useAuthState(auth);
    const navigate = useNavigate();

    useEffect(() => {
        if (loading) return;
        if (user) {
            navigate('/');
        } else {
            navigate('/login');
        }
    }, [loading]);

    if (loading) {
        return <Spinner />;
    }

    return (
        <Routes>
            <Route path='/' element={<HomePage />} />
            <Route path='/login' element={<LoginPage />} />
            <Route path='/scan' element={<ScanPage />} />
            <Route path='/profile' element={<ProfilePage />}>
                <Route index element={<Overview />} />
                <Route path='wallet' element={<Wallet />} />
                <Route path='history' element={<History />} />
                <Route path='account' element={<Account />} />
                <Route path='*' element={<Navigate to={user ? '/' : '/login'} replace />} />
                <Route path='scan' element={<ScanPage />} />
            </Route>
        </Routes>
    );
}

export default App;
