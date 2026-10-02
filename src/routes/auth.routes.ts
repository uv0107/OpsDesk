import { Router } from "express";
import { registerUser, loginUser } from "../services/auth.service";
import { authenticate } from "../middlewares/auth.middleware";

export const authRouter = Router();

authRouter.post("/register", async (req, res, next) => {
    try {
        const { email, password } = req.body;

        await registerUser(email, password);

        res.status(201).json({
            success: true,
            message: "User registered successfully,please login to continue"
        })
    } catch (error) {
        next(error);
    }
})

authRouter.post("/login", async (req, res, next) => {
    try {
        const { email, password } = req.body;

        const { accessToken } = await loginUser(email, password);

        res.status(200).json({
            success: true,
            data: { accessToken },
        });
    } catch (err) {
        next(err);
    }
});

authRouter.get("/profile", authenticate, (req, res) => {
    return res.status(200).json({
        success: true,
        data: req.user,
    })
})