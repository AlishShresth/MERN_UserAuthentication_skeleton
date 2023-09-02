import express from "express";
import userCtrl from "../controllers/user.controller";

// declaring API endpoints that correspond to user CRUD operations and configuring the Express router so that it handles the userId parameter in a requested route by executing the userByID controller function
const router = express.Router();

router.route("/api/users").get(userCtrl.list).post(userCtrl.create);

router
  .route("/api/users/:userId")
  .get(userCtrl.read)
  .put(userCtrl.update)
  .delete(userCtrl.remove);

router.param("userId", userCtrl.userByID);

export default router;
