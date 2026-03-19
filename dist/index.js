'use strict';

var react = require('react');
var jsxRuntime = require('react/jsx-runtime');

// src/core/client.ts
var HttpClient = class {
  constructor(config) {
    this.baseUrl = config.baseUrl.replace(/\/$/, "");
    this.websiteUuid = config.websiteUuid;
    this.debug = config.debug ?? false;
  }
  async fetch(path, options = {}) {
    const { method = "GET", body, headers = {} } = options;
    const url = `${this.baseUrl}${path}`;
    const requestHeaders = {
      "Content-Type": "application/json",
      "x-website-uuid": this.websiteUuid,
      ...headers
    };
    const requestInit = {
      method,
      headers: requestHeaders,
      ...body !== void 0 && { body: JSON.stringify(body) }
    };
    if (this.debug) {
      console.log(`[FoodamigosSdk] --> ${method} ${url}`, {
        headers: requestHeaders,
        ...body !== void 0 && { body }
      });
    }
    const response = await fetch(url, requestInit);
    let data;
    const contentType = response.headers.get("content-type");
    if (contentType?.includes("application/json")) {
      data = await response.json();
    } else {
      data = await response.text();
    }
    if (this.debug) {
      console.log(`[FoodamigosSdk] <-- ${response.status} ${url}`, data);
    }
    if (!response.ok) {
      const error = {
        status: response.status,
        message: typeof data === "object" && data !== null && "message" in data && typeof data.message === "string" ? data.message : `Request failed with status ${response.status}`,
        data
      };
      throw error;
    }
    return data;
  }
};

// src/modules/website/website.ts
var WebsiteModule = class {
  constructor(client, websiteUuid) {
    this.client = client;
    this.websiteUuid = websiteUuid;
  }
  get() {
    return this.client.fetch(`/api/websites/${this.websiteUuid}`);
  }
};

// src/modules/requests/requests.ts
var RequestsModule = class {
  constructor(client, websiteUuid) {
    this.client = client;
    this.websiteUuid = websiteUuid;
  }
  createCateringRequest(companyId, data) {
    return this.client.fetch(
      `/api/websites/${this.websiteUuid}/catering-request/${companyId}`,
      { method: "POST", body: data }
    );
  }
  createEventRequest(companyId, data) {
    return this.client.fetch(
      `/api/websites/${this.websiteUuid}/event-request/${companyId}`,
      { method: "POST", body: data }
    );
  }
};

// src/modules/menu/menu.ts
var MenuModule = class {
  constructor(client, websiteUuid) {
    this.client = client;
    this.websiteUuid = websiteUuid;
  }
  list(companyId) {
    return this.client.fetch(
      `/api/websites/${this.websiteUuid}/menus/${companyId}`
    );
  }
  get(companyId, menuId) {
    return this.client.fetch(
      `/api/websites/${this.websiteUuid}/menus/${companyId}/${menuId}`
    );
  }
  listCategories(companyId, menuId) {
    return this.client.fetch(
      `/api/websites/${this.websiteUuid}/menus/${companyId}/${menuId}/categories`
    );
  }
};

// src/modules/most-popular-products/most-popular-products.ts
var MostPopularProductsModule = class {
  constructor(client, websiteUuid) {
    this.client = client;
    this.websiteUuid = websiteUuid;
  }
  list(companyId) {
    return this.client.fetch(
      `/api/websites/${this.websiteUuid}/most-popular-products/${companyId}`
    );
  }
};

// src/modules/seo/seo.ts
var SeoModule = class {
  constructor(client, websiteUuid) {
    this.client = client;
    this.websiteUuid = websiteUuid;
  }
  get() {
    return this.client.fetch(
      `/api/websites/${this.websiteUuid}/seo`
    );
  }
  getPageSeo(slug) {
    return this.client.fetch(
      `/api/websites/${this.websiteUuid}/pages/${slug}/seo`
    );
  }
};

// src/modules/companies/companies.ts
var CompaniesModule = class {
  constructor(client, websiteUuid) {
    this.client = client;
    this.websiteUuid = websiteUuid;
  }
  list() {
    return this.client.fetch(
      `/api/websites/${this.websiteUuid}/companies`
    );
  }
};
var WebsiteContext = react.createContext(null);
function WebsiteProvider({ sdkConfig, initialWebsite, children }) {
  const sdk = createFoodamigosSdk(sdkConfig);
  const [website, setWebsite] = react.useState(initialWebsite ?? null);
  const [isLoading, setIsLoading] = react.useState(initialWebsite == null);
  const [error, setError] = react.useState(null);
  react.useEffect(() => {
    if (initialWebsite != null) return;
    sdk.website.get().then((data) => {
      setWebsite(data);
      setIsLoading(false);
    }).catch((err) => {
      setError(err instanceof Error ? err : new Error(String(err)));
      setIsLoading(false);
    });
  }, []);
  return /* @__PURE__ */ jsxRuntime.jsx(WebsiteContext.Provider, { value: { website, sdk, isLoading, error }, children });
}
function useWebsite() {
  const ctx = react.useContext(WebsiteContext);
  if (!ctx) throw new Error("useWebsite must be used inside WebsiteProvider");
  return ctx;
}
function SectionList({ sections, components }) {
  const visible = [...sections].filter((s) => s.is_visible).sort((a, b) => a.order - b.order);
  return /* @__PURE__ */ jsxRuntime.jsx(jsxRuntime.Fragment, { children: visible.map((section) => {
    const Component = components[section.component];
    if (!Component) return null;
    return /* @__PURE__ */ jsxRuntime.jsx("div", { "data-component-id": section.component, children: /* @__PURE__ */ jsxRuntime.jsx(Component, {}) }, section.component);
  }) });
}
function camelToKebab(str) {
  return str.replace(/([A-Z])/g, (match) => `-${match.toLowerCase()}`);
}
function applyColors(colors) {
  const root = document.documentElement;
  Object.entries(colors).forEach(([key, value]) => {
    root.style.setProperty(`--${camelToKebab(key)}`, value);
  });
}
function applyTypography(typography) {
  const root = document.documentElement;
  if (typography.fontSans) root.style.setProperty("--font-sans", typography.fontSans);
  if (typography.fontSerif) root.style.setProperty("--font-serif", typography.fontSerif);
  if (typography.fontMono) root.style.setProperty("--font-mono", typography.fontMono);
}
function applyOther(other) {
  const root = document.documentElement;
  if (other.radius != null) root.style.setProperty("--radius", `${other.radius}rem`);
  if (other.shadow) root.style.setProperty("--shadow", other.shadow);
}
var SELECT_MODE_STYLE_ID = "editor-bridge-select-mode";
function enableSelectMode() {
  if (document.getElementById(SELECT_MODE_STYLE_ID)) return;
  const style = document.createElement("style");
  style.id = SELECT_MODE_STYLE_ID;
  style.textContent = "[data-component-id]:hover { outline: 2px solid #3b82f6; outline-offset: 2px; cursor: pointer; }";
  document.head.appendChild(style);
}
function disableSelectMode() {
  document.getElementById(SELECT_MODE_STYLE_ID)?.remove();
}
function EditorBridge() {
  react.useEffect(() => {
    function handleClick(e) {
      if (!document.getElementById(SELECT_MODE_STYLE_ID)) return;
      const target = e.target.closest("[data-component-id]");
      if (!target) return;
      e.preventDefault();
      e.stopPropagation();
      const componentId = target.getAttribute("data-component-id") ?? "";
      const filePath = target.getAttribute("data-file-path") ?? "";
      window.parent.postMessage({ type: "ELEMENT_SELECTED", componentId, filePath }, "*");
    }
    function handleMessage(e) {
      const { type, payload } = e.data ?? {};
      if (type === "ENABLE_SELECT_MODE") {
        enableSelectMode();
      } else if (type === "DISABLE_SELECT_MODE") {
        disableSelectMode();
      } else if (type === "theme-update") {
        const theme = payload;
        if (theme?.colors) applyColors(theme.colors);
        if (theme?.typography) applyTypography(theme.typography);
        if (theme?.other) applyOther(theme.other);
      }
    }
    window.addEventListener("message", handleMessage);
    document.addEventListener("click", handleClick, true);
    return () => {
      window.removeEventListener("message", handleMessage);
      document.removeEventListener("click", handleClick, true);
      disableSelectMode();
    };
  }, []);
  return null;
}

// src/index.ts
function createFoodamigosSdk(config) {
  const client = new HttpClient(config);
  const { websiteUuid } = config;
  return {
    website: new WebsiteModule(client, websiteUuid),
    requests: new RequestsModule(client, websiteUuid),
    menu: new MenuModule(client, websiteUuid),
    mostPopularProducts: new MostPopularProductsModule(client, websiteUuid),
    seo: new SeoModule(client, websiteUuid),
    companies: new CompaniesModule(client, websiteUuid)
  };
}

exports.EditorBridge = EditorBridge;
exports.SectionList = SectionList;
exports.WebsiteProvider = WebsiteProvider;
exports.createFoodamigosSdk = createFoodamigosSdk;
exports.useWebsite = useWebsite;
//# sourceMappingURL=index.js.map
//# sourceMappingURL=index.js.map