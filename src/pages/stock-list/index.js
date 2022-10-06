import templateHtml from "bundle-text:./template.html";

const databind = (element, datacontext) => {
    let created = document.createElement(element);
    for (const key in datacontext) {
        if (Object.hasOwnProperty.call(datacontext, key)) {
            created.setAttribute(`data-${key}`,  datacontext[key]);
        }
    }
    return created;
}

customElements.define(
    "stock-list",
    class extends HTMLElement {
        constructor() {
            super();
            const shadowRoot = this.attachShadow({ mode: "open" });
            shadowRoot.innerHTML = templateHtml;
        }

        connectedCallback() {
            let PROJECT_ID = "f2bfmltz";
            let DATASET = "production";
            
            let QUERY = encodeURIComponent('*[_type == "stock"]{ticker, name, "imageUrl": logo.asset->url}');
            
            // Compose the URL for your project's endpoint and add the query
            let URL = `https://${PROJECT_ID}.api.sanity.io/v2021-10-21/data/query/${DATASET}?query=${QUERY}`;
            
            fetch(URL)
                .then((res) => res.json())
                .then(({ result }) => {
                    // get the list element, and the first item
                    let list = this.shadowRoot.querySelector("#listing-container");
                    let firstListItem = this.shadowRoot.querySelector("#listing-container p");
            
                    if (result.length > 0) {
                        // remove the placeholder content
                        list.removeChild(firstListItem);
            
                        result.forEach((stock) => {
                            list.appendChild(databind("stock-card", stock));
                        });
                        let pre = this.shadowRoot.querySelector("pre");
                        // add the raw data to the preformatted element
                        pre.textContent = JSON.stringify(result, null, 2);
                    }
                })
                .catch((err) => console.error(err));

            this.shadowRoot.querySelector('#logo img').setAttribute('src', this.dataset.imageurl);
            this.shadowRoot.getElementById('name').innerText = this.dataset.name;
            this.shadowRoot.firstChild.href = `/stocks/${this.dataset.ticker}`;
        }
    }
);


