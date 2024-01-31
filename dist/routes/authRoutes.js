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
const axios_1 = __importDefault(require("axios"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const clientId = process.env.GITHUB_CLIENT_ID;
const clientSecret = process.env.GITHUB_CLIENT_SECRET;
const router = (0, express_1.Router)();
router.get('/login/github', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const redirectUri = `https://github.com/login/oauth/authorize?client_id=${clientId}&scope=repo`;
    res.redirect(redirectUri);
}));
router.get('/github/callback', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const code = req.query.code;
    try {
        const response = yield axios_1.default.post('https://github.com/login/oauth/access_token', {
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
    }
    catch (error) {
        console.error('Error exchanging code for token', error);
        res.send('Authentication failed');
    }
}));
exports.default = router;
