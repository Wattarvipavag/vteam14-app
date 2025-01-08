import BackButton from '../../components/BackButton';
import axios from 'axios';
import { auth } from '../../config/firebaseConfig';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useEffect, useState } from 'react';
import { API_URL } from '../../config/envConfig.js';

export default function Wallet() {
    const [githubUser] = useAuthState(auth);
    const [user, setUser] = useState();
    const [money, setMoney] = useState('');

    useEffect(() => {
        const getUser = async () => {
            const user = await axios.get(`${API_URL}/users/oauth/${githubUser.uid}`);
            setUser(user.data.user);
        };
        getUser();
    }, []);

    const handleAddMoney = async () => {
        if (!money) return;
        const balance = parseInt(user.balance) + parseInt(money);

        await axios.post(`${API_URL}/users/${user._id}`, {
            balance,
        });

        setUser((prevUser) => ({ ...prevUser, balance }));

        setMoney('');
    };

    return (
        <div className='wallet'>
            <BackButton name='Profil' />
            <h1>Plånbok</h1>
            {user && (
                <>
                    <div className='balance'>
                        <h3>
                            {user.balance}
                            <span>kr</span>
                        </h3>
                    </div>
                    <div className='add-money'>
                        <h3>Fyll på saldo</h3>
                        <input type='number' min={0} placeholder='Ange summa' value={money} onChange={(e) => setMoney(e.target.value)} />
                        <button onClick={handleAddMoney}>Lägg till pengar</button>
                    </div>
                </>
            )}
        </div>
    );
}
