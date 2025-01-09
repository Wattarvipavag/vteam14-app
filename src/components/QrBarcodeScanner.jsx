import { Scanner } from '@yudiel/react-qr-scanner';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../config/firebaseConfig.js';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../config/envConfig.js';

function QrBarcodeScanner() {
    const [scooter, setScooter] = useState(null);
    const [githubUser] = useAuthState(auth);
    const [user, setUser] = useState(null);
    const [showScan, setShowScan] = useState(false);
    const navigate = useNavigate();
    const token = githubUser.accessToken;

    useEffect(() => {
        if (!githubUser) return;

        const getUser = async () => {
            const res = await axios.get(`${API_URL}/users/oauth/${githubUser.uid}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setUser(res.data.user);
        };

        getUser();
    }, []);

    const handleScan = async (result) => {
        if (!result) return;

        const scooterId = result[0].rawValue;

        const res = await axios.get(`${API_URL}/bikes/${scooterId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (!res.data.bike.available) return;

        setScooter(res.data.bike);
        setShowScan(true);
    };

    const handleRent = async () => {
        await axios.post(
            `${API_URL}/rentals`,
            {
                bikeId: scooter._id,
                userId: user._id,
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        setShowScan(false);
        navigate('/profile/history');
    };

    const handleAbort = () => {
        setScooter(null);
        setShowScan(false);
    };

    return (
        <div className='qr-scanner-container'>
            <Scanner
                styles={{
                    container: {
                        width: '100%',
                        height: '300px',
                    },
                }}
                allowMultiple
                paused={showScan}
                onScan={(result) => handleScan(result)}
                classNames='custom-qr-scanner'
            />
            <h1>Skanna QR-kod</h1>
            {scooter && (
                <div className='scooter-info'>
                    <h3>Starta hyra</h3>
                    <div className='scooter-info-body'>
                        <p>ID: {scooter._id}</p>
                        <p>Batterinivå: {scooter.charge}%</p>
                        <div>
                            <button onClick={handleRent}>Ja</button>
                            <button onClick={handleAbort}>Avbryt</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default QrBarcodeScanner;
