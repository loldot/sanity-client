import templateHtml from 'bundle-text:./index.html'

function shouldNotIntercept(navigationEvent) {
    return (
        !navigationEvent.canIntercept ||
        // If this is just a hashChange,
        // just let the browser handle scrolling to the content.
        navigationEvent.hashChange ||
        // If this is a download,
        // let the browser perform the download.
        navigationEvent.downloadRequest ||
        // If this is a form submission,
        // let that go to the server.
        navigationEvent.formData
    );
}

class Route {
    constructor(path, component, isDefault = false) {
        this.path = path;
        this.component = component;
        this.isDefault = isDefault;
    }

    matchFn(url) {
        const match = url.match(this.path);
        if (match) {
            window.route = {
                url: url,
                params: match.groups
            };

            return true;
        }
        return false;
    }
}

console.log('registering router-outlet')
customElements.define(
    "router-outlet",
    class extends HTMLElement {
        constructor() {
            super();
            const shadowRoot = this.attachShadow({ mode: "open" });
            shadowRoot.innerHTML = templateHtml;

            this.routes = [
                new Route(/\/stocks\/(?<ticker>\w+\/?)/, 'stock-analysis'),
                new Route(/.+/, 'stock-list', true)
            ];
        }

        setContent(elementName) {
            let child = document.createElement(elementName);
            let container = this.shadowRoot.firstChild;

            if (container.hasChildNodes()) {
                container.replaceChild(child, container.firstChild);
            } else {
                container.appendChild(child);
            }
        }

        connectedCallback() {
            console.log('router connected');
            navigation.addEventListener('navigate', navigateEvent => {
                // Exit early if this navigation shouldn't be intercepted.
                // The properties to look at are discussed later in the article.
                if (shouldNotIntercept(navigateEvent)) return;

                const url = new URL(navigateEvent.destination.url);

                let handlerFn = this.setContent.bind(this);
                let matchingRoute = this.routes.find(route => route.matchFn(url.href));
                navigateEvent.intercept({ handler: async () => handlerFn(matchingRoute.component) });
            });

            navigation.addEventListener('navigateerror', event => {
                console.error(`Failed to load page: ${event.message}`);
            });

            let defaultRoute = this.routes.find(x => x.isDefault);
            console.log(defaultRoute);
            this.setContent(defaultRoute.component);
        }
    }
);