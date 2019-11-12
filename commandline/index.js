const inquirer = require("inquirer");
const fs = require("fs");
const axios = require("axios");
const chalk = require("chalk");
const pdf = require("html-pdf");
const generateHTML = require("./generateHTML");
const filename = "index.html";
const questions = [
  {
    type: "input",
    name: "username",
    message: "So... what's your GitHub username?"
  },
  {
    type: "list",
    message: "Out of the following options, what's your favorite color?",
    name: "color",
    choices: ["green", "yellow", "blue", "red"]
  }
];

const askQuestions = () => {
  return inquirer.prompt(questions);
};

const writeToFile = (filename, data) => {
  fs.writeFile(filename, data, function(err) {
    if (err) console.log(err);
    console.log(chalk.green("The file has been written successfully!"));
  });
};

const getGitResponse = data => {
  const queryUrl = `https://api.github.com/users/${data.username}`;
  const starredUrl = `https://api.github.com/users/${data.username}/starred`;
  return axios.all([axios.get(queryUrl), axios.get(starredUrl)]);
};

const readFromFile = page => {
  fs.readFile(`${page}`, (err, data) => {
    if (err) console.log(chalk.inverse.red("Uh oh! Looks like there was an error...error...error..."));
    return data;
  });
};

const convertToPDF = page => {
  const options = {
    format: "Legal"
  };
  pdf.create(page, options).toFile("./profile.pdf", function(err, res) {
    if (err) return console.log(chalk.red("Uh oh! Looks like there was an error...error...error..."));
    console.log(chalk.green("Congratulations! We've successfully created a PDF!"));
  });
};

async function init() {
  try {
    const data = await askQuestions();
    const responseArr = await getGitResponse(data);
    const page = generateHTML(data, responseArr);
    writeToFile(filename, page);
    convertToPDF(page);
  } catch (error) {
    console.log(chalk.inverse.red("Uh oh! Looks like there was an error...error...error..."));
  }
}

init();