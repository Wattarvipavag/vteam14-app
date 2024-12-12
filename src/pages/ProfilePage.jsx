import { useAuthState } from 'react-firebase-hooks/auth';
import MobileNav from '../components/MobileNav';
import { Outlet, useNavigate } from 'react-router-dom';
import { auth } from '../config/firebaseConfig';
import { useEffect } from 'react';
import ProfileHeader from '../components/ProfileHeader';

export default function ProfilePage() {
    const [user] = useAuthState(auth);
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) {
            navigate('/login');
        }
    }, []);

    return (
        <div className='profile-page'>
            <div className='container'>
                <ProfileHeader />
                <Outlet />
            </div>
            <MobileNav />
        </div>
    );
}
