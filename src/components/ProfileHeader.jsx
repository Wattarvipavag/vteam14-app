import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../config/firebaseConfig';

export default function ProfileHeader() {
    const [user] = useAuthState(auth);

    return (
        <header className='profile-header'>
            <img src={user.photoURL} alt='profile picture' />
            <p>{user.displayName}</p>
        </header>
    );
}
