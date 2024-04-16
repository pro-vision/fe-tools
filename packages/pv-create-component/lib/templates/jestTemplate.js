module.exports = function({componentName, constructorName, camelCase}) {
  return (
`import { ${constructorName} } from "Components/${componentName}/${componentName}";

describe("${componentName} tests:", () => {
  let ${camelCase}: ${constructorName};

  beforeEach(() => {
    ${camelCase} = new ${constructorName}();
  });

  describe("onComponentInitialized method:", () => {
    test("should dispatch created event", () => {
      spyOn(${camelCase}, "dispatchEvent");
      ${camelCase}.onComponentInitialized();

      expect(${camelCase}.dispatchEvent).toBeCalledWith(expect.any(CustomEvent));
    });
  });
});
`);
};
