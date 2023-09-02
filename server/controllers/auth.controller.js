// handle requests to signin and signout routes and also provide JWT and express-jwt functionality to enable authentication and authorization for protected user API endpoints.

import User from "../models/user.model";
import jwt from "jsonwebtoken";
import expressJwt from "express-jwt";
import config from "./../../config/config";

// The POST request receives the email and password in req.body. This email is used to retrieve a matching user from the database. Then, the password authenticatino method defined in UserSchema is used to verify the password that's received in req.body from the client.
// If the password is successfully verified, the JWT module is used to generate a signed JWT using a scret key and the user's _id value.
const signin = async (req, res) => {
  try {
    let user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status("401").json({ error: "User not found" });
    }
    if (!user.authenticate(req.body.password)) {
      return res.status("401").send({ error: "Email and password don't mat'" });
    }

    const token = jwt.sign({ _id: user._id }, config.jwtSecret);

    res.cookie("t", token, { expire: new Date() + 9999 });

    return res.json({
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (err) {
    return res.status("401").json({ error: "Could not sign in" });
  }
};

const signout = (req, res) => {};
const requireSignin = null;
const hasAuthorization = (req, res) => {};
export default { signin, signout, requireSignin, hasAuthorization };
