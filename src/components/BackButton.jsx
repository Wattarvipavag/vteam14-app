import { useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa6';

export default function BackButton({ name }) {
    const navigate = useNavigate();

    const handleBackButton = () => {
        navigate(-1);
    };

    return (
        <div className='back-btn' onClick={handleBackButton}>
            <FaArrowLeft />
            {name}
        </div>
    );
}
