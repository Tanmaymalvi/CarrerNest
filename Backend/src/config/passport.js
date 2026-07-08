import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import User from "../models/User.js";

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID || "dummy-client-id-to-prevent-server-crash",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "dummy-client-secret-to-prevent-server-crash",
      callbackURL: process.env.GOOGLE_CALLBACK_URL || "http://localhost:5000/api/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails[0]?.value;
        if (!email) {
          return done(new Error("No email found in Google profile"), null);
        }

        // Find existing user
        let user = await User.findOne({ email: email.toLowerCase() });

        if (user) {
          // If the user registered locally first, we can optionally link it or just log them in.
          // Let's ensure the details match and update provider if not already set.
          if (user.authProvider !== "google") {
            user.authProvider = "google";
            user.isVerified = true;
            if (profile.photos?.[0]?.value && !user.avatar) {
              user.avatar = profile.photos[0].value;
              user.profilePhoto = profile.photos[0].value;
            }
            await user.save();
          }
          return done(null, user);
        }

        // Create new user (Student by default)
        user = await User.create({
          name: profile.displayName || profile.name?.givenName || "Google User",
          email: email.toLowerCase(),
          avatar: profile.photos?.[0]?.value || "",
          profilePhoto: profile.photos?.[0]?.value || "",
          role: "student",
          authProvider: "google",
          isVerified: true,
        });

        return done(null, user);
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

export default passport;
