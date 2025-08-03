const router = require("express").Router();

router.use('/', require('./swagger'));
router.use('/student', require('./student'));
router.use('/instructor', require('./instructor'));
router.use('/course', require('./course'));
// router.use('/enrollment', require('./enrollment'));

router.get("/", (req, res) => {
  //#swagger.tags = ['Home']
  res.send("Learning Academy API");
});

module.exports = router;
