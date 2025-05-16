// controllers/social-auth.controller.ts
import { Request, Response } from "express";
import { generalAccessToken, generalRefreshToken } from "../services/auth.service";

export class SocialAuthController {
  async handleCallback(req: any, res: Response) {
    try {
      const user = req.user;

      if (!user) {
        return res.status(401).json({ status: "ERR", message: "Authentication failed" });
      }

      const access_token = generalAccessToken({ id: user.email, role: user.role });
      const refresh_token = generalRefreshToken({ id: user.email, role: user.role });
      const expirationTime = Date.now() + 60 * 60 * 1000;

      res.cookie("access_token", access_token, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: 60 * 60 * 1000,
        path: "/",
      });

      res.cookie("refresh_token", refresh_token, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: 7 * 24 * 60 * 60 * 1000,
        path: "/",
      });

      res.status(200).json({
        status: "OK",
        data: user,
        access_token,
        refresh_token,
        expirationTime,
      });
    } catch (error) {
      res.status(500).json({
        status: "ERR",
        message: "OAuth callback error",
        error,
      });
    }
  }

  async googleCallback(req: Request, res: Response) {
    return this.handleCallback(req, res);
  }

  async facebookCallback(req: Request, res: Response) {
    return this.handleCallback(req, res);
  }
}

export const socialAuthController = new SocialAuthController();
