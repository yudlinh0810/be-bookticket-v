// routes/auth.social.router.ts
import { Router } from "express";
import passport from "../config/passport";
import { socialAuthController } from "../controllers/socialAuth.controller";
import { asyncHandler } from "../utils/asyncHandler";

const router = Router();

router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  asyncHandler(socialAuthController.googleCallback.bind(socialAuthController))
);

router.get(
  "/facebook/callback",
  passport.authenticate("facebook", { session: false }),
  asyncHandler(socialAuthController.facebookCallback.bind(socialAuthController))
);

export default router;
