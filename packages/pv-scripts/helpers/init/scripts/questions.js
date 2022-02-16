const questions = [
  {
    type: "text",
    name: "name",
    message: "What is your project-name?",
    initial: "my-app",
    // convert to kebab-case
    format: (value) => value.replace(/\s+/g, "-").toLowerCase(),
  },
  {
    type: "text",
    name: "namespace",
    message: "What is your projects namespace?",
    // convert to kebab-case
    format: (value) => value.replace(/\s+/g, "-").toLowerCase(),
  },
  {
    type: "toggle",
    name: "useTS",
    message: "Do you want to use Typescript?",
    initial: true,
    active: "yes",
    inactive: "no",
  },
  {
    type: "toggle",
    name: "useReact",
    message: "Is this a React Project?",
    initial: false,
    active: "yes",
    inactive: "no",
  },
  {
    type: "toggle",
    name: "useESLint",
    message: "Do you want me to setup eslint?",
    initial: true,
    active: "yes",
    inactive: "no",
  },
  {
    type: "toggle",
    name: "useStylelint",
    message: "Do you want me to setup stylelint?",
    initial: true,
    active: "yes",
    inactive: "no",
  },
  {
    type: "toggle",
    name: "useJest",
    message: "Do you want me to setup jest unit-testing?",
    initial: true,
    active: "yes",
    inactive: "no",
  },
  {
    type: "toggle",
    name: "useKluntje",
    message: "Do you want me to setup kluntje?",
    initial: true,
    active: "yes",
    inactive: "no",
  },
  {
    type: "toggle",
    name: "useLSG",
    message: "Do you want me to setup a Living Styleguide?",
    initial: true,
    active: "yes",
    inactive: "no",
  },
];

module.exports = {
  questions,
};
