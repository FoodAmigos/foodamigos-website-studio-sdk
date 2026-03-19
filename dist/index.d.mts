type FoodamigosSdkConfig = {
    websiteUuid: string;
    baseUrl: string;
    debug?: boolean;
};
type RequestOptions = {
    method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
    body?: unknown;
    headers?: Record<string, string>;
};
type ApiError = {
    status: number;
    message: string;
    data?: unknown;
};

declare class HttpClient {
    private baseUrl;
    private websiteUuid;
    private debug;
    constructor(config: FoodamigosSdkConfig);
    fetch<T>(path: string, options?: RequestOptions): Promise<T>;
    fetchData<T>(path: string, options?: RequestOptions): Promise<T>;
}

type Website = {
    uuid: string;
    name: string;
    domain: string;
    createdAt: string;
    updatedAt: string;
    [key: string]: unknown;
};
type PageConfig = {
    slug: string;
    path: string;
    label: string;
    navLabel: string;
    isNavItem: boolean;
    isLegalPage: boolean;
    seo: {
        title: string;
        description: string;
        robots: string;
        keywords?: string[];
    };
};
type PageMetadataResult = {
    title: string;
    description: string;
    robots: string;
    keywords: string[];
    metadataBase: URL;
    alternates: {
        canonical: string;
    };
    openGraph: {
        type: 'website';
        title: string;
        description: string;
        siteName: string;
    };
    twitter: {
        title: string;
        description: string;
    };
};

declare class WebsiteModule {
    private client;
    private websiteUuid;
    constructor(client: HttpClient, websiteUuid: string);
    get(): Promise<Website>;
    generatePageMetadata(input: PageConfig | undefined): Promise<PageMetadataResult>;
}

type CateringRequestData = {
    name: string;
    email: string;
    phone?: string;
    date?: string;
    guestCount?: number;
    message?: string;
    [key: string]: unknown;
};
type EventRequestData = {
    name: string;
    email: string;
    phone?: string;
    eventType?: string;
    date?: string;
    guestCount?: number;
    message?: string;
    [key: string]: unknown;
};
type CateringRequestResponse = {
    id: number;
    [key: string]: unknown;
};
type EventRequestResponse = {
    id: number;
    [key: string]: unknown;
};

declare class RequestsModule {
    private client;
    private websiteUuid;
    constructor(client: HttpClient, websiteUuid: string);
    createCateringRequest(companyId: string, data: CateringRequestData): Promise<CateringRequestResponse>;
    createEventRequest(companyId: string, data: EventRequestData): Promise<EventRequestResponse>;
}

type MenuItem = {
    id: string;
    name: string;
    description?: string;
    price: number;
    currency: string;
    available: boolean;
    imageUrl?: string;
    [key: string]: unknown;
};
type MenuCategory = {
    id: string;
    name: string;
    description?: string;
    items: MenuItem[];
    [key: string]: unknown;
};
type Menu = {
    id: string;
    name: string;
    description?: string;
    companyId: string;
    categories: MenuCategory[];
    createdAt: string;
    updatedAt: string;
    [key: string]: unknown;
};
type MenuListItem = {
    id: string;
    name: string;
    description?: string;
    companyId: string;
    createdAt: string;
    updatedAt: string;
    [key: string]: unknown;
};

declare class MenuModule {
    private client;
    private websiteUuid;
    constructor(client: HttpClient, websiteUuid: string);
    list(companyId: string): Promise<MenuListItem[]>;
    get(companyId: string, menuId: string): Promise<Menu>;
    listCategories(companyId: string, menuId: string): Promise<MenuCategory[]>;
}

type PopularProduct = {
    id: string;
    name: string;
    description?: string;
    price: number;
    currency: string;
    image?: {
        id: number;
        url: string;
        name: string;
        type: string;
        extension: string;
    } | null;
    rank: number;
    [key: string]: unknown;
};

declare class MostPopularProductsModule {
    private client;
    private websiteUuid;
    constructor(client: HttpClient, websiteUuid: string);
    list(): Promise<PopularProduct[]>;
}

type Seo = {
    title?: string;
    description?: string;
    keywords?: string[];
    ogTitle?: string;
    ogDescription?: string;
    ogImage?: string;
    canonicalUrl?: string;
    [key: string]: unknown;
};

declare class SeoModule {
    private client;
    private websiteUuid;
    constructor(client: HttpClient, websiteUuid: string);
    get(): Promise<Seo>;
}

type Company = {
    uuid: string;
    name: string;
    address?: string;
    phone_number?: string;
    city?: string;
    zip_code?: string;
    email?: string;
    lat?: number;
    lon?: number;
    is_live?: boolean;
    google_place?: string;
    opening_hours?: unknown;
    locations?: unknown;
    [key: string]: unknown;
};

declare class CompaniesModule {
    private client;
    private websiteUuid;
    constructor(client: HttpClient, websiteUuid: string);
    list(): Promise<Company[]>;
}

type GalleryMedia = {
    id: number;
    url: string;
    name: string;
    type: string;
    extension: string;
};

declare class GalleryModule {
    private client;
    private websiteUuid;
    constructor(client: HttpClient, websiteUuid: string);
    list(): Promise<GalleryMedia[]>;
}

type GoogleReview = {
    id: number;
    author_name: string;
    profile_photo_url: string;
    rating: number;
    text: string;
    time: string;
};

declare class GoogleReviewsModule {
    private client;
    private websiteUuid;
    constructor(client: HttpClient, websiteUuid: string);
    list(): Promise<GoogleReview[]>;
}

type SectionConfig = {
    name: string;
    component: string;
    is_visible: boolean;
    order: number;
};

type FoodamigosSdk = {
    website: WebsiteModule;
    requests: RequestsModule;
    menu: MenuModule;
    mostPopularProducts: MostPopularProductsModule;
    seo: SeoModule;
    companies: CompaniesModule;
    gallery: GalleryModule;
    googleReviews: GoogleReviewsModule;
};
declare function createFoodamigosSdk(config: FoodamigosSdkConfig): FoodamigosSdk;

export { type ApiError, type CateringRequestData, type CateringRequestResponse, type Company, type EventRequestData, type EventRequestResponse, type FoodamigosSdk, type FoodamigosSdkConfig, type GalleryMedia, type GoogleReview, type Menu, type MenuCategory, type MenuItem, type MenuListItem, type PageConfig, type PageMetadataResult, type PopularProduct, type RequestOptions, type SectionConfig, type Seo, type Website, createFoodamigosSdk };
