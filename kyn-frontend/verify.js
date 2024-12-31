import bodyParser from 'body-parser';
import cors from 'cors';
import express from 'express';
import speakeasy from 'speakeasy';

const app = express();

app.use(bodyParser.json());
app.use(cors());

app.post('/verify', (req, res) => {
    const { token } = req.body;

    const verified = speakeasy.totp.verify({
        secret: 'P{}&%B6<9h>fm4z8iGA{)vKnp?ebJ0W<',
        encoding: 'ascii',
        token: token
    });

    res.json({ verified });
});

app.listen(3000, () => {
    console.log('Server running on port 3000');
});
