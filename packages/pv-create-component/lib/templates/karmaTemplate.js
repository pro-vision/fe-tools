module.exports = function({componentName}) {
  return (
`import unitHelper from "Karma/helper";

/*
  Cheat Sheet: can be removed after implementation

  // Equal
  expect(result).toBeTruthy();
  expect(result).toEqual(expected);
  expect(result).not.toEqual(-1);
  expect(result).toBe("12");
  expect($container.find(".class").length).toBeGreaterThan(0);

  // SpyOn
  spyOn(this.el, "fooBar");
  spyOn(MQHelper, "getMediaQuery").and.returnValue("MQ1");
  spyOn(this.el, "fooBar").and.callThrough();

  expect(this.el.fooBar).toHaveBeenCalled();
  expect(this.el.fooBar).toHaveBeenCalledWith("foo");
  expect(this.el.fooBar).toHaveBeenCalledTimes(1);
  expect(this.el.setState).toHaveBeenCalledWith({toBeLoaded: []}, jasmine.any(Object));
  expect(this.el.ui.image.addEventListener.calls.first().args).toEqual(["click", ""]);

  // SpyOnProperty
  spyOnProperty(this.el, "isLoading").and.returnValue(true);

  // Throwing Exceptions
  const errorThrowingFunction = this.el.fooBar.bind(this.el, "arg1");
  expect(errorThrowingFunction).toThrow();
  expect(errorThrowingFunction).not.toThrow();

  // Timeout
  beforeEach(function() {
    jasmine.clock().install();
  });
  afterEach(function() {
    jasmine.clock().uninstall();
  });
  jasmine.clock().tick(101);
*/

describe("${componentName} tests:", function() {
  beforeEach(function() {
    this.el = unitHelper.initTest(fixture, "${componentName}");
  });

  afterEach(function() {
    fixture.cleanup();
  });

  describe("renderingTemplate method:", function() {
    it("should return valid alt on image", function() {
      // @TODO
    });
  });
});
`);
};
