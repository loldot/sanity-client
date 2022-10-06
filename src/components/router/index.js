import templateHtml from 'bundle-text:./index.html'
const createMatchFunction = (route) => {
    return (url) => {
        const match = url.match(route.path);
        if (match) {
            window.currentRoute = {
                url: url,
                params: match.groups
            };

            return true;
        }
        return false;
    }

};

console.log('registering router-outlet')
customElements.define(
    "router-outlet",
    class extends HTMLElement {
        constructor() {
            super();
            const shadowRoot = this.attachShadow({ mode: "open" });
            shadowRoot.innerHTML = templateHtml;

            this.routes = [
                {
                    path: /\/stocks\/(?<ticker>\w+\/?)/,
                    component: 'stock-analysis'
                },
                {
                    path: /.+/,
                    component: 'stock-list'
                },
            ];

            this.parseRouteTable();

            navigation.addEventListener('navigate', navigateEvent => {
                // Exit early if this navigation shouldn't be intercepted.
                // The properties to look at are discussed later in the article.
                if (shouldNotIntercept(navigateEvent)) return;

                const url = new URL(navigateEvent.destination.url);

                this.routes.forEach(route => {
                    if (route.matchFn(url)) {
                        navigateEvent.intercept({ handler: () => this.setContent(route.component) });
                    }
                });
            });
        }

        parseRouteTable() {
            this.routes.forEach(route => {
                route.matchFn = createMatchFunction(route);
            });
        }

        setContent(elementName) {
            let child = document.createElement(elementName);
            let container = this.shadowRoot.firstChild;

            if (container.hasChildNodes()) {
                container.replaceChild(container.firstChild, child);
            } else {
                container.appendChild(child);
            }
        }
    }
);