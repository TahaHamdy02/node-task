const {
  registerUserCtrl,
  loginUserCtrl,
} = require("../controller/authController");

const router = require("express").Router();

/**-----------------------------
 * @Route api/auth/register
-----------------------------**/
router.route("/register").post(registerUserCtrl);

/**-----------------------------
 * @Route api/auth/login
-----------------------------**/
router.route("/login").post(loginUserCtrl);

module.exports = router;
