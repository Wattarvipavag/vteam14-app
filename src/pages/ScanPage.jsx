import MobileNav from '../components/MobileNav';
import QrBarcodeScanner from '../components/QrBarcodeScanner';

function QrScanner() {
    return (
        <div className='scan-page'>
            <QrBarcodeScanner />
            <MobileNav />
        </div>
    );
}

export default QrScanner;
