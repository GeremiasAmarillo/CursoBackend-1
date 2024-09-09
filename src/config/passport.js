import passport from "passport";
import local from "passport-local";
import GitHubStrategy from "passport-github2";
import { UserRepository } from "../repositories/index.js";
import { createHash, isValidPassword } from "../utils/bcrypt.js";

const LocalStrategy = local.Strategy;

export const initializarPassport = () => {
  passport.use(
    "register",
    new LocalStrategy(
      { passReqToCallback: true, usernameField: "email" },
      async (req, username, password, done) => {
        try {
          const { confirmPassword } = req.body;

          if (password !== confirmPassword) {
            console.log("No coinciden las contraseñas");
            return done(null, false);
          }
          const user = await UserRepository.getUserEmail(username);

          if (user) {
            console.log("El usuario ya existe");
            return done(null, false);
          }

          req.body.password = createHash(password);

          const newUser = await UserRepository.registerUser({ ...req.body });

          if (newUser) {
            return done(null, newUser);
          }
          return done(null, false);
        } catch (error) {
          done(error);
        }
      }
    )
  );

  passport.use(
    "login",
    new LocalStrategy(
      { usernameField: "email" },
      async (username, password, done) => {
        try {
          const user = await UserRepository.getUserEmail(username);

          if (!user) {
            console.log("El usuario no existe");
            done(null, false);
          }

          if (!isValidPassword(password, user.password)) {
            console.log("las Contraseñas no coinciden");
            return done(null, false);
          }

          return done(null, user);
        } catch (error) {
          done(error);
        }
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  passport.deserializeUser(async (id, done) => {
    const user = await UserRepository.getUserById(id);
    done(null, user);
  });

  passport.use(
    "github",
    new GitHubStrategy(
      {
        clientID: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        callbackURL: process.env.CALLBACK_URL,
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const email = profile._json.email;
          let user = await UserRepository.getUserEmail(email);

          if (user) {
            return done(null, user);
          }

          const newUser = {
            name: profile._json.name,
            email,
            password: ".$",
            avatar: profile._json.avatar_url,
            github: true,
          };

          const result = await UserRepository.registerUser({ ...newUser });

          return done(null, result);
        } catch (error) {
          done(error);
        }
      }
    )
  );
};
