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

export { createFoodamigosSdk };
//# sourceMappingURL=index.mjs.map
//# sourceMappingURL=index.mjs.map