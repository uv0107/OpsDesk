import { OAuth2Client } from "google-auth-library";

import { env } from "../config/env";
import { AppError } from "../errors/AppError";

export type googleUserProfile = {
    googleId: string,
    email: string
}

const googleOauthClient = new OAuth2Client(
    env.googleClientId,
    env.googleClientSecret,
    env.googleRedirectUrl
)

export function getGoogleAuthUrl(): string {
    return googleOauthClient.generateAuthUrl({
        scope: ["openid", "email", "profile"],
        access_type: "online",
        prompt: "select_account"

    })
}

export async function getGoogleUserFromAuthCode(code: string): Promise<googleUserProfile> {
    if (!code) {
        throw new AppError("Google Auth code is required", 400);
    }
    const { tokens } = await googleOauthClient.getToken(code);

    if (!tokens.id_token) {
        throw new AppError("Google login failed:id_token missing", 401);
    }
    // user info from the google.
    const ticketInfo = await googleOauthClient.verifyIdToken({
        idToken: tokens.id_token,
        audience: env.googleClientId,
    })

    const payload = ticketInfo.getPayload();
    if (!payload || !payload.email || !payload.sub) {
        throw new AppError("google login failed:invalid google profile", 400);
    }
    return {
        googleId: payload.sub,
        email: payload.email.toLocaleLowerCase()
    }
}


