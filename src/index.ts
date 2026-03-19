import { HttpClient } from "./core/client"
import { WebsiteModule } from "./modules/website"
import { RequestsModule } from "./modules/requests"
import { MenuModule } from "./modules/menu"
import { MostPopularProductsModule } from "./modules/most-popular-products"
import { SeoModule } from "./modules/seo"
import { CompaniesModule } from "./modules/companies"
import { GalleryModule } from "./modules/gallery"
import { GoogleReviewsModule } from "./modules/google-reviews"
import type { FoodamigosSdkConfig } from "./core/types"

export type { FoodamigosSdkConfig } from "./core/types"
export type { ApiError, RequestOptions } from "./core/types"
export type { Website, PageConfig, PageMetadataResult } from "./modules/website"
export type {
  CateringRequestData,
  CateringRequestResponse,
  EventRequestData,
  EventRequestResponse,
} from "./modules/requests"
export type { Menu, MenuCategory, MenuItem, MenuListItem } from "./modules/menu"
export type { PopularProduct } from "./modules/most-popular-products"
export type { Seo } from "./modules/seo"
export type { Company } from "./modules/companies"
export type { GalleryMedia } from "./modules/gallery"
export type { GoogleReview } from "./modules/google-reviews"
export type { SectionConfig } from "./types/sections"

export type FoodamigosSdk = {
  website: WebsiteModule
  requests: RequestsModule
  menu: MenuModule
  mostPopularProducts: MostPopularProductsModule
  seo: SeoModule
  companies: CompaniesModule
  gallery: GalleryModule
  googleReviews: GoogleReviewsModule
}

export function createFoodamigosSdk(config: FoodamigosSdkConfig): FoodamigosSdk {
  const client = new HttpClient(config)
  const { websiteUuid } = config

  return {
    website: new WebsiteModule(client, websiteUuid),
    requests: new RequestsModule(client, websiteUuid),
    menu: new MenuModule(client, websiteUuid),
    mostPopularProducts: new MostPopularProductsModule(client, websiteUuid),
    seo: new SeoModule(client, websiteUuid),
    companies: new CompaniesModule(client, websiteUuid),
    gallery: new GalleryModule(client, websiteUuid),
    googleReviews: new GoogleReviewsModule(client, websiteUuid),
  }
}
