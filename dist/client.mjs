'use client';
import { createContext, useState, useEffect, useContext } from 'react';
import { jsx, Fragment } from 'react/jsx-runtime';

// src/components/WebsiteProvider.tsx

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
  async fetchData(path, options = {}) {
    const wrapper = await this.fetch(path, options);
    return wrapper.data;
  }
};

// src/modules/website/website.ts
var WebsiteModule = class {
  constructor(client, websiteUuid) {
    this.client = client;
    this.websiteUuid = websiteUuid;
  }
  get() {
    return this.client.fetchData(`/api/websites/${this.websiteUuid}`);
  }
  async generatePageMetadata(input) {
    const website = await this.get().catch(() => null);
    const siteName = website?.name ?? "";
    const domain = website?.domain ?? "localhost";
    const title = input?.seo?.title ?? "";
    const description = input?.seo?.description ?? "";
    const robots = input?.seo?.robots ?? "index, follow";
    const keywords = input?.seo?.keywords ?? [];
    const canonical = `https://${domain}${input?.path ?? "/"}`;
    return {
      title,
      description,
      robots,
      keywords,
      metadataBase: new URL(`https://${domain}`),
      alternates: { canonical },
      openGraph: {
        type: "website",
        title,
        description,
        siteName
      },
      twitter: {
        title,
        description
      }
    };
  }
};

// src/modules/requests/requests.ts
var RequestsModule = class {
  constructor(client, websiteUuid) {
    this.client = client;
    this.websiteUuid = websiteUuid;
  }
  createCateringRequest(companyId, data) {
    return this.client.fetchData(
      `/api/websites/${this.websiteUuid}/catering-request/${companyId}`,
      { method: "POST", body: data }
    );
  }
  createEventRequest(companyId, data) {
    return this.client.fetchData(
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
  list() {
    return this.client.fetchData(
      `/api/websites/${this.websiteUuid}/most-popular-products`
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
    return this.client.fetchData(
      `/api/websites/${this.websiteUuid}/companies`
    );
  }
};

// src/modules/gallery/gallery.ts
var GalleryModule = class {
  constructor(client, websiteUuid) {
    this.client = client;
    this.websiteUuid = websiteUuid;
  }
  list() {
    return this.client.fetchData(
      `/api/websites/${this.websiteUuid}/gallery`
    );
  }
};

// src/modules/google-reviews/google-reviews.ts
var GoogleReviewsModule = class {
  constructor(client, websiteUuid) {
    this.client = client;
    this.websiteUuid = websiteUuid;
  }
  list() {
    return this.client.fetch(
      `/api/websites/${this.websiteUuid}/google-reviews`
    );
  }
};

// src/index.ts
function createFoodamigosSdk(config) {
  const client = new HttpClient(config);
  const { websiteUuid } = config;
  return {
    website: new WebsiteModule(client, websiteUuid),
    requests: new RequestsModule(client, websiteUuid),
    menu: new MenuModule(client, websiteUuid),
    mostPopularProducts: new MostPopularProductsModule(client, websiteUuid),
    companies: new CompaniesModule(client, websiteUuid),
    gallery: new GalleryModule(client, websiteUuid),
    googleReviews: new GoogleReviewsModule(client, websiteUuid)
  };
}
var WebsiteContext = createContext(null);
function WebsiteProvider({ sdkConfig, initialWebsite, children }) {
  const sdk = createFoodamigosSdk(sdkConfig);
  const [website, setWebsite] = useState(initialWebsite ?? null);
  const [isLoading, setIsLoading] = useState(initialWebsite == null);
  const [error, setError] = useState(null);
  useEffect(() => {
    if (initialWebsite != null) return;
    sdk.website.get().then((data) => {
      setWebsite(data);
      setIsLoading(false);
    }).catch((err) => {
      setError(err instanceof Error ? err : new Error(String(err)));
      setIsLoading(false);
    });
  }, []);
  return /* @__PURE__ */ jsx(WebsiteContext.Provider, { value: { website, sdk, isLoading, error }, children });
}
function useWebsite() {
  const ctx = useContext(WebsiteContext);
  if (!ctx) throw new Error("useWebsite must be used inside WebsiteProvider");
  return ctx;
}
function SectionList({ sections, components }) {
  const visible = [...sections].filter((s) => s.is_visible).sort((a, b) => a.order - b.order);
  return /* @__PURE__ */ jsx(Fragment, { children: visible.map((section) => {
    const Component = components[section.component];
    if (!Component) return null;
    return /* @__PURE__ */ jsx("div", { "data-component-id": section.component, children: /* @__PURE__ */ jsx(Component, {}) }, section.component);
  }) });
}
function camelToKebab(str) {
  return str.replace(/([A-Z])/g, (match) => `-${match.toLowerCase()}`).replace(/([a-z])(\d)/g, "$1-$2");
}
function applyColors(colors) {
  const root = document.documentElement;
  Object.entries(colors).forEach(([key, value]) => {
    root.style.setProperty(`--${camelToKebab(key)}`, value);
  });
}
function applyTypography(typography) {
  const root = document.documentElement;
  if (typography.fontSans) root.style.setProperty("--font-sans-custom", typography.fontSans);
  if (typography.fontSerif) root.style.setProperty("--font-serif-custom", typography.fontSerif);
  if (typography.fontMono) root.style.setProperty("--font-mono-custom", typography.fontMono);
}
function applyOther(other) {
  const root = document.documentElement;
  if (other.radius != null) root.style.setProperty("--radius", `${other.radius}rem`);
  if (other.shadow) {
    const shadowStr = typeof other.shadow === "string" ? other.shadow : `${other.shadow.x}px ${other.shadow.y}px ${other.shadow.blur}px ${other.shadow.spread}px ${other.shadow.color}`;
    root.style.setProperty("--shadow-custom", shadowStr);
  }
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
  useEffect(() => {
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

export { EditorBridge, SectionList, WebsiteProvider, useWebsite };
//# sourceMappingURL=client.mjs.map
//# sourceMappingURL=client.mjs.map