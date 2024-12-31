import speakeasy from 'speakeasy';
import qrcode from 'qrcode';


const secret = speakeasy.generateSecret({ name: 'Kynnovate' });

console.log(secret);

qrcode.toDataURL(secret.otpauth_url, (err, data) => {
    if (err) {
        console.error('Error generating QR code:', err);
    } else {
        console.log('Scan this QR code to setup Google Authenticator:', data);
    }
});
