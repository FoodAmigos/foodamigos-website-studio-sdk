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

export { createFoodamigosSdk };
//# sourceMappingURL=index.mjs.map
//# sourceMappingURL=index.mjs.map