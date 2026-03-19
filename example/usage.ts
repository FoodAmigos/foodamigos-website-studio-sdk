import { createFoodamigosSdk } from "../src"

// Initialize the SDK
export const sdk = createFoodamigosSdk({
  websiteUuid: "your-website-uuid",
  baseUrl: "https://api.example.com",
  debug: true,
})

async function main() {
  // --- Website ---
  const website = await sdk.website.get()
  console.log("Website:", website)

  // --- Catering request ---
  const cateringResponse = await sdk.requests.createCateringRequest("company-123", {
    name: "Jane Doe",
    email: "jane@example.com",
    phone: "+1-555-000-0000",
    date: "2026-06-15",
    guestCount: 80,
    message: "We need gluten-free options.",
  })
  console.log("Catering request:", cateringResponse)

  // --- Event request ---
  const eventResponse = await sdk.requests.createEventRequest("company-456", {
    name: "John Smith",
    email: "john@example.com",
    eventType: "corporate",
    date: "2026-07-20",
    guestCount: 200,
    message: "Looking for full catering for a product launch event.",
  })
  console.log("Event request:", eventResponse)
}

main().catch(console.error)
