import { createProducts, deleteProducts, getProducts } from "./database"
import { scrapWebsiteProducts } from "./scrap"
require('dotenv').config()

async function main() {
  const existingProducts = await getProducts()
  const scrappedProducts = await scrapWebsiteProducts()
  for (let index = 0; index < scrappedProducts.length; index++) {
    const scrappedProduct = scrappedProducts[index]
    const existingProduct = existingProducts?.find(product => product.id === scrappedProduct.id)
    if (!existingProduct) {
      console.log("New product!")
      continue
    }

    if (!existingProduct.isAvailable && scrappedProduct.isAvailable) {
      console.log("Is now available!")
    }
  }
  await deleteProducts()
  await createProducts(scrappedProducts)
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error)
    process.exit(1)
  })