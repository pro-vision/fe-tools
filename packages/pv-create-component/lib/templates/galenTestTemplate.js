module.exports = function({name, componentName, constructorName}) {

  return (
`// http://galenframework.com/docs/reference-galen-javascript-api/
// http://galenframework.com/docs/reference-galenpages-javascript-api/
load("../../../../js/galen/init.js");

this.${constructorName} = $page("${name}", {
  component: ".${componentName}"
}, {
});

testOnAllDevices("${name}", "/components/${componentName}/${componentName}.html", function (driver, device) {
  var el = new ${constructorName}(driver).waitForIt();
  checkComponent(driver, "${componentName}", "initial", device);
  // el.component.hover();
  // checkComponent(driver, "${componentName}", "hovered", device);
});

`);
};
