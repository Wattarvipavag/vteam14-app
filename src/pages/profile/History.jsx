import { useAuthState } from 'react-firebase-hooks/auth';
import BackButton from '../../components/BackButton';
import { auth } from '../../config/firebaseConfig';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../../config/envConfig.js';

export default function History() {
    const [githubUser] = useAuthState(auth);
    const [userHistory, setUserHistory] = useState([]);
    const navigate = useNavigate();
    const token = githubUser.accessToken;

    useEffect(() => {
        const getUserHistory = async () => {
            const user = await axios.get(`${API_URL}/users/history/${githubUser.uid}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setUserHistory(user.data.user.rentalHistory);
        };
        getUserHistory();
    }, []);

    const handleCancelRental = async (id, bikeId) => {
        console.log('Cancel');
        const bikeRes = await axios.get(`${API_URL}/bikes/${bikeId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        let charge = bikeRes.data.bike.charge > 10 ? bikeRes.data.bike.charge - 5 : bikeRes.data.bike.charge;
        await axios.put(
            `${API_URL}/rentals/${id}`,
            {
                longitude: bikeRes.data.bike.location.longitude,
                latitude: bikeRes.data.bike.location.latitude,
                charge: charge,
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        navigate('/');
    };

    return (
        <div className='history'>
            <BackButton name='Profil' />
            <h1>Historik</h1>
            <div className='history-list'>
                {userHistory
                    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                    .map((history) => (
                        <div key={history._id} className='history-item'>
                            <h2>{history._id}</h2>
                            <div>
                                <p>Starttid: {new Date(history.createdAt).toLocaleString()}</p>
                                {!history.active && <p>Sluttid: {new Date(history.updatedAt).toLocaleString()}</p>}
                                {!history.active && <p>Pris: {history.totalCost}kr</p>}
                            </div>
                            {history.active && (
                                <button onClick={() => handleCancelRental(history._id, history.bikeId)}>Avsluta resa</button>
                            )}
                        </div>
                    ))}
            </div>
        </div>
    );
}
