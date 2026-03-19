import type { HttpClient } from "../../core/client"
import type { Menu, MenuCategory, MenuListItem } from "./types"

export class MenuModule {
  private client: HttpClient
  private websiteUuid: string

  constructor(client: HttpClient, websiteUuid: string) {
    this.client = client
    this.websiteUuid = websiteUuid
  }

  list(companyId: string): Promise<MenuListItem[]> {
    return this.client.fetch<MenuListItem[]>(
      `/api/websites/${this.websiteUuid}/menus/${companyId}`
    )
  }

  get(companyId: string, menuId: string): Promise<Menu> {
    return this.client.fetch<Menu>(
      `/api/websites/${this.websiteUuid}/menus/${companyId}/${menuId}`
    )
  }

  listCategories(companyId: string, menuId: string): Promise<MenuCategory[]> {
    return this.client.fetch<MenuCategory[]>(
      `/api/websites/${this.websiteUuid}/menus/${companyId}/${menuId}/categories`
    )
  }
}
