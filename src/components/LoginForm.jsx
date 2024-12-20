import { FaGithub } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { auth } from '../config/firebaseConfig';
import { useSignInWithGithub } from 'react-firebase-hooks/auth';
import axios from 'axios';
import { API_URL } from '../config/envConfig.js';

export default function LoginForm() {
    const [signInWithGithub, user, loading] = useSignInWithGithub(auth);
    const navigate = useNavigate();

    const handleGithubLogin = async () => {
        try {
            const res = await signInWithGithub();

            const oauthId = res.user.uid;
            const name = res.user.displayName ? res.user.displayName : 'Namnlös?';
            const email = res.user.email ? res.user.email : 'Finns ej';
            const profileImage = res.user.photoURL;

            await axios.post(`${API_URL}/api/login`, {
                oauthId,
                name,
                email,
                profileImage,
            });

            navigate('/profile');
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <form className='login-form'>
            <h2 className='login-title'>Logga in!</h2>
            <div className='form-group'>
                <label htmlFor='email'>Email</label>
                <input type='email' id='email' name='email' placeholder='test@test.com' required />
            </div>
            <div className='form-group'>
                <label htmlFor='password'>Lösenord</label>
                <input type='password' id='password' name='password' placeholder='********' required />
            </div>
            <button type='submit' className='button login-button'>
                Logga In
            </button>
            <div className='divider' />

            <button type='button' className='button github-login-button' onClick={handleGithubLogin} disabled={loading}>
                <FaGithub /> {loading ? 'Loggar in...' : 'Logga in med GitHub'}
            </button>
        </form>
    );
}
