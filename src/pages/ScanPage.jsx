import { useAuthState } from 'react-firebase-hooks/auth';
import MobileNav from '../components/MobileNav';
import QrBarcodeScanner from '../components/QrBarcodeScanner';
import { auth } from '../config/firebaseConfig';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

function QrScanner() {
    const [user] = useAuthState(auth);
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) {
            navigate('/login');
        }
    }, []);
    return (
        <div className='scan-page'>
            <QrBarcodeScanner />
            <MobileNav />
        </div>
    );
}

export default QrScanner;
