import express from 'express'; // Import Express
import bodyParser from 'body-parser'; // Import body-parser to handle JSON
import speakeasy from 'speakeasy'; // Import speakeasy for OTP verification
import cors from 'cors'; // Import CORS

// Create an Express app
const app = express();

// Middleware
app.use(bodyParser.json()); // Parse incoming JSON
app.use(cors()); // Enable CORS

// Define a route for verifying OTP
app.post('/verify', (req, res) => {
    const { token } = req.body;

    // Use speakeasy to verify the OTP
    const verified = speakeasy.totp.verify({
        secret: '0Q6a0TVR]IJ5Bn9C%&55kS>&6eeUIE<E', // Replace with your secret
        encoding: 'ascii',
        token: token
    });

    res.json({ verified });
});

// Start the server
app.listen(3000, () => {
    console.log('Server running on port 3000');
});
