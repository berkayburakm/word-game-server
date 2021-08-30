var express = require("express");
var router = express.Router();
var Word = require("../models/Word");
var wordsController = require("../controllers/wordsController");

/* GET words listing. */
router.get("/", async (req, res, next) => {
  const words = await Word.find({});
  words
    ? res.status(200).json({
        words,
      })
    : res.status(404);
});

router.get("/scrape", wordsController.scrapeWords);
router.get("/new", wordsController.newWord);
router.post("/check", wordsController.checkWord);

module.exports = router;
