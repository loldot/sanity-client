import templateHtml from "bundle-text:./index.html";

customElements.define(
    "stock-card",
    class extends HTMLElement {
        constructor() {
            super();
            const shadowRoot = this.attachShadow({ mode: "open" });
            shadowRoot.innerHTML = templateHtml;
        }

        connectedCallback() {
            this.shadowRoot.querySelector('#logo img').setAttribute('src', this.dataset.imageurl);
            this.shadowRoot.getElementById('name').innerText = this.dataset.name;
            this.shadowRoot.firstChild.href = `/stocks/${this.dataset.ticker}`;
        }
    }
);