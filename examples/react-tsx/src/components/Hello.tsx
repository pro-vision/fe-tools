import React from "react";

interface HelloProps { compiler: string; framework: string }

export const Hello: React.FunctionComponent<HelloProps> = (props: HelloProps) =>
  <h1>Hello from {props.compiler} and {props.framework}!</h1>;