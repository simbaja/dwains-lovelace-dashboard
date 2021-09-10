import { hass } from "card-tools/src/hass";
import { createCard } from "card-tools/src/lovelace-element";

const bases = [customElements.whenDefined('hui-masonry-view'), customElements.whenDefined('hc-lovelace')];
Promise.race(bases).then(() => {

  const LitElement = customElements.get('hui-masonry-view')
    ? Object.getPrototypeOf(customElements.get('hui-masonry-view'))
    : Object.getPrototypeOf(customElements.get('hc-lovelace'));

  const html = LitElement.prototype.html;

  const css = LitElement.prototype.css;

  class DwainsHeaderCard extends LitElement {
    constructor() {
      super();
    }

    setConfig(config) {
      this._config = JSON.parse(JSON.stringify(config));

      if(this._config.card){
        this.card = createCard(this._config.card);
        this.card.hass = hass();
      }
    }

    renderNav(){
      if(this._config.subtitle){
        return html`
        <div
              style="cursor: pointer"
              @click="${this._handleClick}"
            >
              <ha-icon
                style="height: 24px; width: 24px; margin-left: -6px;"
                .icon="${this._config.icon}"
                id="icon"
              ></ha-icon>
              <div class="sub-header">${this._config.subtitle}</div>
            </div>
        `;
      } else {
        return html``;
      }
    }

    render() {
      return html`
        <ha-card>
          <div class="container">
            <div class="one">
              ${this.renderNav()}
              <div class="header">${this._config.title}</div>
            </div>
            <div class="two">
              ${this.card}
            </div>
        </ha-card>
      `;
    }

    set hass(hass) {
      if(!this.card) return;
      this.card.hass = hass;
    }

    _handleClick() {
      let e;
      let path = window.location.pathname;
      let nav_path = path.substring(0, path.lastIndexOf('/')) + "/"+this._config.navigation_path;
      window.history.pushState(null, '', nav_path);
      e = new Event('location-changed', { composed: true });
      e.detail = { replace: false };
      window.dispatchEvent(e);
    }

    static get styles() {
      return [
        css`
          ha-card {
            background-color: var(--app-header-background-color);
            color: var(--app-header-text-color, white);
            margin-top: -2px;
            padding-top: 20px;
            padding-left: 16px;
            box-shadow: none;
            border-radius: 0px;
          }
          ha-icon {
            display: inline-block;
            margin: auto;
            padding-top: 5px;
            --mdc-icon-size: 100%;
            --iron-icon-width: 100%;
            --iron-icon-height: 100%;
            float: left;
          }
          @media only screen and (min-width: 1466px) {
            ha-card {
              margin-top: 22px;
              border-radius: 4px;
            }
          }
          .header {
            color: var(--app-header-text-color, white) !important;
            font-size: 1.5em !important;
            font-weight: bold;
            padding-top: 5px;
            padding-bottom: 20px !important;
            margin-top: 0px;
            margin-bottom: 0px;
            float: left;
            clear: both;
          }
          .sub-header {
            color: var(--app-header-text-color, white) !important;
            font-size: 1.2em !important;
            font-weight: normal;
            padding-top: 5px;
            margin-top: 0px;
            margin-bottom: 0px;
            float: left;
          } 
          h2 {
            font-size: 13px;
            font-weight: bold;
            padding-top: 8px;
            margin: 0px;
          }
          .container {
            width: 100%;
            height: auto;
            margin: auto;
            overflow: auto;
          }
          .one {
            width: 80%;
            float: left;
          }
          .two {
            width: 20%;
            float: left;
          }
        `,
      ];
    }

    getCardSize() {
      return 1;
    }
  }

  if (!customElements.get("dwains-header-card")) {
    customElements.define("dwains-header-card", DwainsHeaderCard);
    const pjson = require('../package.json');
    console.info(
      `%c DWAINS-HEADER-CARD \n%c    Version ${pjson.version}    `,
      "color: #2fbae5; font-weight: bold; background: black",
      "color: white; font-weight: bold; background: dimgray"
    );
  }
});