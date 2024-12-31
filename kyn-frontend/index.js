import bodyParser from 'body-parser';
import cors from 'cors';
import express from 'express';
import qrcode from 'qrcode';
import speakeasy from 'speakeasy';

const app = express();
app.use(bodyParser.json());
app.use(cors());

let secret; // Move the secret outside so it can be shared between QR generation and verification

// Endpoint to generate the QR code
app.get('/generate-qrcode', (req, res) => {
    secret = speakeasy.generateSecret({
        name: "Kynnovate" // Name that will show up in Google Authenticator
    });

    qrcode.toDataURL(secret.otpauth_url, (err, data) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to generate QR code' });
        }
        res.json({ qrCode: data });
    });
});

// Endpoint to verify the TOTP token
app.post('/verify', (req, res) => {
    const { token } = req.body;

    const verified = speakeasy.totp.verify({
        secret: secret.ascii, // Using the secret generated from /generate-qrcode
        encoding: 'ascii',
        token: token
    });

    res.json({ verified });
});

app.listen(3000, () => {
    console.log('Server running on port 3000');
});
