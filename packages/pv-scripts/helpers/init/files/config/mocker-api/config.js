const fs = require("fs");
const path = require("path");
const delay = require("mocker-api/lib/delay");

const DELAY_TIME = 1000;

const proxy = {
  "GET /api/:component*": (req, res) => {
    let {component} = req.params;
    // maps mock urls like "/api/component/a/b" to filenames "component/component__api-mock.a.b.json"
    let suffix = "";
    if (component && component.indexOf("/") > -1) {
      const segments = component.split("/");
      component = segments.shift();
      suffix = segments.map(segment => `.${segment}`).join("");
    }

    const filePath = path.resolve(`./src/components/${component}/${component}__api-mock${suffix}.json`);
    const mockExists = fs.existsSync(path.resolve(filePath));
    if (!mockExists) return res.status(404).send(`Mock file not found for: ${filePath}`);
    delete require.cache[require.resolve(filePath)];
    return res.json(require(filePath));
  },
};
module.exports = delay(proxy, DELAY_TIME);
