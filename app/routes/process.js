const router = require("express").Router();
const _controller = require("../controllers/process");

router.post("/register", _controller.register);
router.post("/recognise", _controller.recognise);

module.exports = router;
