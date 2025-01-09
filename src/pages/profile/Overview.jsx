import { FaSignOutAlt, FaHistory, FaCreditCard } from 'react-icons/fa';
import { NavLink } from 'react-router-dom';
import { useSignOut } from 'react-firebase-hooks/auth';
import { auth } from '../../config/firebaseConfig';
import { useNavigate } from 'react-router-dom';

export default function Overview() {
    const [signOut] = useSignOut(auth);
    const navigate = useNavigate();

    const handleLogout = async () => {
        const success = await signOut();

        if (success) {
            navigate('/login');
        }
    };

    return (
        <div className='overview'>
            <div>
                <NavLink to='/profile/wallet'>
                    <div>
                        <FaCreditCard />
                        <p>Plånbok</p>
                    </div>
                </NavLink>
                <NavLink to='/profile/history'>
                    <div>
                        <FaHistory />
                        <p>Historik</p>
                    </div>
                </NavLink>
            </div>
            <div>
                <div className='logout-btn' onClick={handleLogout}>
                    <FaSignOutAlt />
                    <p>Logga ut</p>
                </div>
            </div>
        </div>
    );
}
