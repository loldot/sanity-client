import templateHtml from "bundle-text:./template.html";

customElements.define(
    "stock-analysis",
    class extends HTMLElement {
        constructor() {
            super();

            this.ticker = 'AAPL';
            const shadowRoot = this.attachShadow({ mode: "open" });
            shadowRoot.innerHTML = templateHtml;
        }

        connectedCallback() {
            let PROJECT_ID = "f2bfmltz";
            let DATASET = "production";
            
            let QUERY = encodeURIComponent(`*[_type == "stock" && ticker == "${this.ticker}"]{ticker, name, analysis, "imageUrl": logo.asset->url}`);
            
            // Compose the URL for your project's endpoint and add the query
            let URL = `https://${PROJECT_ID}.api.sanity.io/v2021-10-21/data/query/${DATASET}?query=${QUERY}`;
            
            fetch(URL)
                .then((res) => res.json())
                .then(({ result }) => {
                    let stock = result[0];

                    this.shadowRoot.querySelector('#analysis').setAttribute('src', stock.analysis);
                    this.shadowRoot.getElementById('name').innerText = stock.name;
                    this.shadowRoot.getElementById('analysis').innerText = stock.analysis;
                })
                .catch((err) => console.error(err));

            
        }
    }
);