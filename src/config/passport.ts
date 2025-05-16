// config/passport.ts
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as FacebookStrategy } from "passport-facebook";
import dotenv from "dotenv";
import { bookBusTicketsDB } from "./db";
import { SocialAuthService } from "../services/socialAuth.service";

dotenv.config();

const socialAuthService = new SocialAuthService();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: `${process.env.CALLBACK_URL}/google/callback`,
    },
    async (_accessToken, _refreshToken, profile, done) => {
      try {
        const result = await socialAuthService.handleSocialLogin(profile, "google");
        return done(null, result.data); // Chỉ truyền data để serialize
      } catch (error) {
        return done(error);
      }
    }
  )
);

passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_APP_ID!,
      clientSecret: process.env.FACEBOOK_APP_SECRET!,
      callbackURL: `${process.env.CALLBACK_URL}/facebook/callback`,
      profileFields: ["id", "displayName", "photos", "email"],
    },
    async (_accessToken, _refreshToken, profile, done) => {
      try {
        const result = await socialAuthService.handleSocialLogin(profile, "facebook");
        return done(null, result.data);
      } catch (error) {
        return done(error);
      }
    }
  )
);

passport.serializeUser((user: any, done) => done(null, user.email)); // serialize theo email

passport.deserializeUser(async (email, done) => {
  try {
    const [rows] = await bookBusTicketsDB.execute("SELECT * FROM customer WHERE email = ?", [
      email,
    ]);
    const customer = (rows as any)[0];
    if (!customer) return done(null, false);
    done(null, customer);
  } catch (error) {
    done(error, null);
  }
});

export default passport;
