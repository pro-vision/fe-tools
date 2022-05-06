module.exports = function({constructorName, componentName}) {

  return (
`import { Component } from "Core/Component";
import { ACTIVE } from "Helper/cssClasses";
import { addClass } from "Helper/domHelper";

/**
 * Custom Element to .. @TODO
 */
class ${constructorName} extends Component {

  constructor() {
    super({

      ui: {
        input: ".${componentName}__input :-one",
        buttons: ".${componentName}__label",
      },

      events: [
        {
          event: "keyup",
          target: "input",
          handler: "handleInputChange",
        },
      ],

      props: {
        score: {
          type: "number",
          required: false,
          default: 1,
        }
      }
    });
  }

  /**
   * @override
   */
  afterComponentRender() {
    // @TODO: add necessary logic to bootstrap the custom element
  }

  /**
   * update ui on input change
   *
   * @param {Event} e - change event
   */
  handleInputChange(e: Event): void {
    e.preventDefault();

    addClass(this.ui.buttons, ACTIVE);
  }
}

customElements.define("${componentName}", ${constructorName});

export default ${constructorName};

`);
};
