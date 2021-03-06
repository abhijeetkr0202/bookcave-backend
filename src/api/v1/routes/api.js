const express = require('express');

const router = express.Router();

const userRouter = require("./user").router;
const bookRouter = require("./book").router;

router.use("/user/",userRouter);
router.use("/book/",bookRouter);

module.exports = router;