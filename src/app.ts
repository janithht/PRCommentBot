import express from 'express';
import { Octokit } from '@octokit/rest';
import { createAppAuth } from '@octokit/auth-app';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(express.json());

app.post('/webhook', async (req, res) => {
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

      const buildStatus = req.body.pull_request.head.statuses?.find((status: { context: string; }) => status.context === 'continuous-integration/default');
 // Get build status

      const commentBody = buildStatus
        ? `Build status: ${buildStatus.state}\n${buildStatus.target_url}`
        : 'Build status not yet available.';

      await octokit.rest.issues.createComment({
        owner: req.body.repository.owner.login,
        repo: req.body.repository.name,
        issue_number: req.body.number,
        body: commentBody,
      });
    }

    res.status(200).send('OK');
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal server error');
  }
});

app.listen(3000, () => {
  console.log('Server started on PORT 3000');
});