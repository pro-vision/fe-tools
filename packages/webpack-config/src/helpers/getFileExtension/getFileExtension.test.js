import getFileExtension from "./getFileExtension";

test("get correct file extensions from filename", () => {
  const jsFilenames = ["index.js", "index.test.js"];
  const tsFilenames = ["index.ts", "index.test.ts"];
  const tsxFilenames = ["index.tsx", "index.test.tsx"];

  jsFilenames.forEach(filename => {
    expect(getFileExtension(filename)).toBe("js");
  });
  tsFilenames.forEach(filename => {
    expect(getFileExtension(filename)).toBe("ts");
  });
  tsxFilenames.forEach(filename => {
    expect(getFileExtension(filename)).toBe("tsx");
  });
});

test("get correct file extensions from filepath", () => {
  const jsFilenames = [
    "src/components/index.js",
    "src/components/index.test.js"
  ];
  const tsFilenames = [
    "src/components/index.ts",
    "src/components/index.test.ts"
  ];
  const tsxFilenames = [
    "src/components/index.tsx",
    "src/components/index.test.tsx"
  ];

  jsFilenames.forEach(filename => {
    expect(getFileExtension(filename)).toBe("js");
  });
  tsFilenames.forEach(filename => {
    expect(getFileExtension(filename)).toBe("ts");
  });
  tsxFilenames.forEach(filename => {
    expect(getFileExtension(filename)).toBe("tsx");
  });
});
