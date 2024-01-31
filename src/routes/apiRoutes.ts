import { Router } from 'express';
import { Octokit } from '@octokit/rest';
import { createAppAuth } from '@octokit/auth-app';
import dotenv from 'dotenv';

dotenv.config();

const router = Router();


router.post('/webhook', async (req, res) => {
    try {
      if (req.body.action === 'opened' && req.body.pull_request) {
        const installationId = req.body.installation.id;
        const octokit = new Octokit({
          authStrategy: createAppAuth,
          auth: {
            appId: process.env.GITHUB_APP_ID,
            privateKey: process.env.GITHUB_PRIVATE_KEY,
            installationId: installationId
          },
        }); // Use getInstallationOctokit for authentication
  
        await octokit.rest.issues.createComment({
          owner: req.body.repository.owner.login,
          repo: req.body.repository.name,
          issue_number: req.body.number,
          body: 'Thanks for opening this pull request!',
        });
      }
  
      res.status(200).send('OK');
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal server error');
    }
  });

  export default router;