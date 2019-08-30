# React / TypeScript sample (react-tsx)

This project is an example how to use the [pv-scripts](https://github.com/pro-vision/fe-tools/tree/master/packages/pv-scripts) CLI to simplify the configuration of a React / TypeScript project.

## Installation

```sh 
npm install
``` 

## Run

### dev
During development, you can use the `dev` task to transpile and bundle your code. Furthermore a `webpack-dev-server` on port `8616` is started. You can then access `http://localhost:8616` and see the app.

```sh 
npm run dev
```

### prod
To create a production bundle, the `prod` task is used. It will transpile and output all your code via `webpack` and write them to the `target` folder.

```sh 
npm run prod
```

