import { useAuthState } from 'react-firebase-hooks/auth';
import MobileNav from '../components/MobileNav';
import { useNavigate } from 'react-router-dom';
import { auth } from '../config/firebaseConfig';
import { useEffect } from 'react';
import Map from '../components/Map';
import { useState } from 'react';
import Spinner from '../components/Spinner';

export default function HomePage() {
    const [user] = useAuthState(auth);
    const navigate = useNavigate();
    const [location, setLocation] = useState(null);

    useEffect(() => {
        if (!user) {
            navigate('/login');
        }
    }, []);

    useEffect(() => {
        if (navigator.geolocation) {
            const watchId = navigator.geolocation.watchPosition(
                (position) => {
                    setLocation({
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                    });
                },
                (error) => {
                    console.error('Error getting location: ', error);
                },
                {
                    enableHighAccuracy: true,
                    maximumAge: 0,
                }
            );

            return () => {
                navigator.geolocation.clearWatch(watchId);
            };
        } else {
            console.error('Geolocation is not supported by this browser.');
        }
    }, []);

    return (
        <div className='home-page'>
            {location ? <Map location={location} zoom={13} /> : <Spinner />}
            <MobileNav />
        </div>
    );
}
