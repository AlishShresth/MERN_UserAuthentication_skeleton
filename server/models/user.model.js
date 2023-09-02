import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: "Name is required",
  },
  email: {
    type: String,
    trim: true,
    unique: "Email already exists",
    match: [/.+\@.+\..+/, "Please fill a valid email address"],
    required: "Email is required",
  },
  created: {
    type: Date,
    deafult: Date.now,
  },
  updated: Date,
  hashed_password: {
    type: String,
    required: "Password is required",
  },
  salt: String,
});

// Hashing algorithms generate the same hash for the same input value. But to ensure two users don't end up with the same hashed password if they happen to use the same password text, we pair each password with a unique salt value before generating the hashed password for each user. This will also make it difficult to guess the hashing algorithm being used because the same user input is seemingly generating different hashes.
UserSchema.methods = {
  // to verify sign-in attempts by matching the user-provided password text with the hashed_Password stored in the database for a specific user
  authenticate: function (plainText) {
    return this.encryptPassword(plainText) === this.hashed_password;
  },
  // generate an encrypted hash from the plain-text password and a unique salt value using the crypto module from Node
  encryptPassword: function (password) {
    if (!password) return "";
    try {
      return crypto
        .createHmac("sha1", this.salt)
        .update(password)
        .digest("hex");
    } catch (err) {
      return "";
    }
  },
  // generates a unique and random salt value using the current timestamp at execution and Math.random()
  makeSalt: function () {
    return Math.round(new Date().valueOf() * Math.random()) + "";
  },
};

UserSchema.virtual("password")
  .set(function (password) {
    this._password = password;
    this.salt = this.makeSalt();
    this.hashed_password = this.encryptPassword(password);
  })
  .get(function () {
    return this._password;
  });

// add validation constraints to the actual password string
UserSchema.path("hashed_password").validate(function (v) {
  if (this.password && this._password.length < 6) {
    this.invalidate("password", "Password must be at least 6 characters.");
  }
  if (this.isNew && !this._password) {
    this.invalidate("password", "Password is required");
  }
}, null);
export default mongoose.model("User", UserSchema);
