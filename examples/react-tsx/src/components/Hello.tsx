import React from "react";

interface HelloProps {
  compiler: string;
  framework: string;
}

export function Hello(props: HelloProps): JSX.Element {
  const stringConst = "Foobar";
  const mapFoo: Map<number, number> = new Map<number, number>();
  mapFoo.set(stringConst, "blub");
  return <h1>Hello from {props.compiler} and {props.framework}!</h1>;
}
