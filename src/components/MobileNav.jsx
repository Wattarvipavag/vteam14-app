import { FaUser, FaQrcode, FaMapMarkedAlt } from 'react-icons/fa';
import { NavLink } from 'react-router-dom';

export default function MobileNav() {
    return (
        <nav>
            <NavLink to='/'>
                <FaMapMarkedAlt className='icon' />
                <p>Karta</p>
            </NavLink>
            <div></div>
            <div></div>
            <div className='qr-icon'>
                <FaQrcode className='icon' />
                Skanna
            </div>
            <NavLink to='/profile'>
                <FaUser className='icon' />
                <p>Profil</p>
            </NavLink>
        </nav>
    );
}
