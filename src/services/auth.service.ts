import bcrypt from "bcryptjs";
import { AppError } from "../errors/AppError";
import { findUserByEmail, createUser, findUserByEmailWithPassword, findUserByGoogleId, linkGoogleIdToUser, createGoogleUser } from "../repositories/user.repository";
import { signAccessToken } from "../libs/jwt";
import { getGoogleAuthUrl, getGoogleUserFromAuthCode } from "../libs/google";

export async function registerUser(
    email: string,
    password: string,
): Promise<void> {
    if (!email || !password) {
        throw new AppError("Email and password are required", 400);
    }

    // homwork - create one more folder called constants and keep this 6 in a constant and use this here
    if (password.length < 6) {
        throw new AppError("Password must be at least 6 characters long", 400);
    }

    const normalizeEmail = email.toLowerCase().trim();

    // find the user if its already present in db or not
    // if yes then we will not allow to register with same email again
    // thats it -> vv imp

    const existingUser = await findUserByEmail(normalizeEmail);

    if (existingUser) {
        throw new AppError("Email already present", 409);
    }

    const passwordHash = await bcrypt.hash(password, 10);

    await createUser(normalizeEmail, passwordHash);
}

export async function loginUser(
    email: string,
    password: string,
): Promise<{ accessToken: string }> {
    if (!email || !password) {
        throw new AppError("Email and password are required", 400);
    }

    const normalizeEmail = email.toLowerCase().trim();
    const user = await findUserByEmailWithPassword(normalizeEmail);

    if (!user?.password_hash) {
        throw new AppError("Invalid email or password", 401);
    }

    const isPasswordValid = await bcrypt.compare(password, user.password_hash);

    if (!isPasswordValid) {
        throw new AppError("Invalid email or password", 401);
    }

    const accessToken = signAccessToken({
        userId: user.id,
        email: user.email,
        role: user.role,
    });

    return { accessToken };
}

export function startGoogleLogin(): string {
    return getGoogleAuthUrl();
}
export async function loginWithGoogle(code: string): Promise<{ accessToken: string }> {
    const googleProfile = await getGoogleUserFromAuthCode(code);
    let user = await findUserByGoogleId(googleProfile.googleId)
    if (!user) {
        user = await findUserByEmail(googleProfile.email);
        if (user) {
            // link to this email to the existing email
            user = await linkGoogleIdToUser(user.id, googleProfile.googleId)
        } else {
            // create a new account
            user = await createGoogleUser(googleProfile.email, googleProfile.googleId);
        }
    }

    const accessToken = signAccessToken({
        userId: user.id,
        email: user.email,
        role: user.role,
    });

    return { accessToken };
}

