const inquirer = require("inquirer");
const fs = require("fs");
const axios = require("axios");
const chalk = require("chalk");
const generateHTML = require("./generateHTML");
const filename = "index.html";
const questions = [
  {
    type: "input",
    name: "username",
    message: "What is your GitHub username?"
  },
  {
    type: "list",
    message: "Out of these options, what is your favorite color?",
    name: "color",
    choices: ["green", "blue", "pink", "red"]
  }
];

const askQuestions = () => {
  return inquirer.prompt(questions);
};

function writeToFile(filename, data) {
  fs.writeFile(filename, data, function(err) {
    if (err) {
      return console.log(err);
    }
    console.log(chalk.green("The file has been written successfully!"));
  });
}

const getGitResponse = data => {
  const queryUrl = `https://api.github.com/users/${data.username}`;
  const starredUrl = `https://api.github.com/users/${data.username}/starred`;
  return axios.all([axios.get(queryUrl), axios.get(starredUrl)]);
};

function appendToFile(filename, data) {
  fs.appendFile(filename, data, function(err) {
    if (err) {
      return console.log(err);
    }
    console.log(chalk.green("The file has been written successfully!"));
  });
}

function readFile() {
  fs.readFile("./index.html", (err, data) => {
    if (err) throw err;
  });
}

function convertToPDF() {
  console.log(chalk.yellow("convert to PDF"));
}

async function init() {
  try {
    const data = await askQuestions();
    const page = await generateHTML.generateHTML(data);
    await writeToFile(filename, page);
    const responseArr = await getGitResponse(data);
    const htmlBody = await generateHTML.generateBody(responseArr);
    await appendToFile(filename, htmlBody);
  } catch {
    console.log(chalk.inverse.red("Uh oh! Look's like there has been an error... error... error..."));
  }
}

init();