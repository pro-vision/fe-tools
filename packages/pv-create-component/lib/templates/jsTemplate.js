module.exports = function({constructorName, componentName}) {

  return (
`import { Component } from "@kluntje/core";
import { addClass, removeClass} from "@kluntje/js-utils/lib/dom-helpers";

/**
 * Custom Element to .. @TODO
 */
export class ${constructorName} extends Component {

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
  handleInputChange(e) {
    e.preventDefault();

    addClass(this.ui.buttons, "state-active");
  }
}

customElements.define("${componentName}", ${constructorName});
`);
};
