"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const rest_1 = require("@octokit/rest");
const auth_app_1 = require("@octokit/auth-app");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const router = (0, express_1.Router)();
router.post('/webhook', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (req.body.action === 'opened' && req.body.pull_request) {
            const installationId = req.body.installation.id;
            const octokit = new rest_1.Octokit({
                authStrategy: auth_app_1.createAppAuth,
                auth: {
                    appId: process.env.GITHUB_APP_ID,
                    privateKey: process.env.GITHUB_PRIVATE_KEY,
                    installationId: installationId
                },
            }); // Use getInstallationOctokit for authentication
            yield octokit.rest.issues.createComment({
                owner: req.body.repository.owner.login,
                repo: req.body.repository.name,
                issue_number: req.body.number,
                body: 'Thanks for opening this pull request!',
            });
        }
        res.status(200).send('OK');
    }
    catch (error) {
        console.error(error);
        res.status(500).send('Internal server error');
    }
}));
exports.default = router;
