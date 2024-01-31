import { Router } from 'express';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const clientId = process.env.GITHUB_CLIENT_ID;
const clientSecret = process.env.GITHUB_CLIENT_SECRET;

const router = Router();

    router.get('/login/github', async (req, res) => {
        const redirectUri = `https://github.com/login/oauth/authorize?client_id=${clientId}&scope=repo`;
        res.redirect(redirectUri);
    });
    
    router.get('/github/callback', async (req, res) => {
        const code = req.query.code as string;
        try {
        const response = await axios.post('https://github.com/login/oauth/access_token', {
            client_id: clientId,
            client_secret: clientSecret,
            code,
        }, {
            headers: {
            Accept: 'application/json',
            },
        });
    
        const accessToken = response.data.access_token;
        // Assuming successful authentication, redirect to the GitHub App installation page
        const appInstallationUrl = `https://github.com/apps/codecommentor/installations/new`;
        res.redirect(appInstallationUrl);
        } catch (error) {
        console.error('Error exchanging code for token', error);
        res.send('Authentication failed');
        }
    });

export default router;