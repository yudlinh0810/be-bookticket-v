import { Request, Response } from "express";
import { globalBookTicketsDB } from "../config/db";
import { UserService } from "../services/user.service";
import { errorResponse, successResponse } from "../utils/response.util";
import { verifyRefreshToken } from "../utils/jwt.util";
import testEmail from "../utils/testEmail";

export class UserController {
  private userService = new UserService(globalBookTicketsDB);

  login = async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;
      const isCheckEmail = testEmail(email);

      if (!email || !password) {
        return res.status(200).json({
          status: "ERR",
          message: "The input is required",
        });
      }

      if (!isCheckEmail) {
        return res.status(200).json({
          status: "ERR",
          message: "Email is not in correct format",
        });
      }

      const response = await this.userService.login(req.body);

      if (
        "access_token" in response &&
        "refresh_token" in response &&
        "expirationTime" in response
      ) {
        const { access_token, refresh_token, status, expirationTime } = response;
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
        return successResponse(res, { status, expirationTime: expirationTime }, "Login success");
      } else {
        return errorResponse(res, response.message, 400);
      }
    } catch (err) {
      console.log(err);
      return res.status(404).json({
        message: "Controller.login err",
        error: err,
      });
    }
  };

  refreshToken = async (req: Request, res: Response) => {
    try {
      const refreshToken = req.cookies.refresh_token;

      if (!refreshToken) return res.status(401).json({ message: "No refresh token provided" });

      const response = await verifyRefreshToken(refreshToken);

      if ("access_token" in response && "expirationTime" in response) {
        const { access_token, expirationTime } = response;

        res.cookie("access_token", access_token, {
          httpOnly: true,
          secure: true,
          sameSite: "none",
          maxAge: 60 * 60 * 1000,
          path: "/",
        });

        res.cookie("access_token_expiration", expirationTime.toString(), {
          httpOnly: false,
          secure: true,
          sameSite: "none",
          maxAge: 60 * 60 * 1000,
          path: "/",
        });

        return res.status(200).json({ message: "Access token refreshed" });
      } else {
        return errorResponse(res, response.message, 400);
      }
    } catch (error) {
      console.log("err refresh token", error);
      return errorResponse(res, "ERR Controller.refreshToken", 404);
    }
  };

  delete = async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    try {
      const data = await this.userService.delete(id);
      return successResponse(res, data, "Delete user success");
    } catch (error) {
      console.log("Controller", error);
      return errorResponse(res, "ERR Controller.deleteUser", 404);
    }
  };

  logout = async (req: Request, res: Response) => {
    try {
      res.clearCookie("access_token", {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        path: "/",
      });
      res.clearCookie("refresh_token", {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        path: "/",
      });
      return successResponse(res, {}, "Logout success");
    } catch (error) {
      console.log("Controller", error);
      return errorResponse(res, "ERR Controller.logout", 404);
    }
  };
}
