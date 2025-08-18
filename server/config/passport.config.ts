import passport from "passport"
import { Strategy as GoogleStrategy } from "passport-google-oauth20"
import { User } from "../models"

passport.use(
	new GoogleStrategy(
		{
			clientID: process.env.GOOGLE_CLIENT_ID as string,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
			callbackURL: "http://localhost:5000/api/auth/google/callback",
		},
		async (accessToken, refreshToken, profile, done) => {
			try {
				let user = await User.findOne({ email: profile.emails?.[0]?.value })

				if (user) {
					if (user.socialProvider === "normal") {
						return done(null, false, {
							message: "Email is already registered with normal login",
						})
					}
					return done(null, user)
				}

				const newUser = new User({
					firstName: profile.name?.givenName,
					lastName: profile.name?.familyName,
					email: profile.emails?.[0]?.value,
					socialProvider: "google",
					googleId: profile.id,
				})

				await newUser.save()
				return done(null, newUser)
			} catch (error) {
				return done(error, false)
			}
		}
	)
)

passport.serializeUser((user: any, done) => {
	done(null, user.id)
})

passport.deserializeUser(async (id, done) => {
	try {
		const user = await User.findById(id)
		done(null, user)
	} catch (err) {
		done(err, null)
	}
})

export default passport
