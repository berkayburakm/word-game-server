var axios = require("axios");
var cheerio = require("cheerio");
var Word = require("../models/Word");
var wordsUrl =
  "https://3000mostcommonwords.com/list-of-3000-most-common-turkish-words-in-english/";

module.exports = {
  scrapeWords: async (req, res) => {
    const response = await axios.get(wordsUrl);
    const $ = cheerio.load(response.data);
    $("#tablepress-86 tbody tr").each((index, element) => {
      const result = {};
      result.word_en = $(element).find(".column-2").text();
      result.word_tr = $(element).find(".column-5").text();
      result.word_level = $(element).find(".column-4").text();
      Word.create(result);
    });
    res.send(200);
  },
  newWord: async (req, res) => {
    let newQuestion = {};
    let answers = [];
    let randomWords = await Word.aggregate([
      {
        $sample: { size: 4 },
      },
    ]).exec();
    newQuestion.question = randomWords[0].word_en;
    randomWords.map((word) => {
      answers.push(word.word_tr);
    });
    newQuestion.answers = answers
      .map((value) => ({ value, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map(({ value }) => value);
    res.json({ word: newQuestion });
  },
  checkWord: async (req, res) => {
    const { word, answer } = req.body;
    const result = await Word.find(
      { word_en: word, word_tr: answer },
      {
        collation: { locale: "tr" },
      }
    );
    if (result.length) {
      res.status(200).json({ status: true });
    } else {
      res.status(200).json({ status: false });
    }
  },
};
