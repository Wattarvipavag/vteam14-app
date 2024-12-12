import { useAuthState } from 'react-firebase-hooks/auth';
import MobileNav from '../components/MobileNav';
import { useNavigate } from 'react-router-dom';
import { auth } from '../config/firebaseConfig';
import { useEffect } from 'react';
import Map from '../components/Map';

export default function HomePage() {
    const [user] = useAuthState(auth);
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) {
            navigate('/login');
        }
    }, []);

    return (
        <div className='home-page'>
            <div className='container'>
                <Map />
            </div>
            <MobileNav />
        </div>
    );
}
