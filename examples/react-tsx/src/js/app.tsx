import React from "react";
import { render } from "react-dom";

import { Hello } from "../components/Hello";

render(
    <Hello compiler="TypeScript" framework="React" />,
    document.getElementById("main")
);