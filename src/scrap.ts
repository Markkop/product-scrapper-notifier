import puppeteer, { Page } from 'puppeteer'
import { Product } from './types'

async function scrapProducts(page: Page) {
  try {
    const products = await page.evaluate(getProducts)
    console.log(`Scrapped ${products.length} products`)
    return products
  } catch (error) {
    console.log(error)
    return []
  }
}

async function scrapNextPage(page: Page) {
  try {
    const nextPageUrl = await page.evaluate(getNextPageButton)
    return nextPageUrl
  } catch (error) {
    console.log(error)
  }
}

function getNextPageButton() {
  return document.querySelector('.pagination-arrow-link[aria-label="Next"]')?.getAttribute("href")
}

function getProducts(): Product[] {
  const productElements = [...document.querySelectorAll('[data-product-type="list"]')]
  const products = productElements.map(productElement => {
    const id = productElement.getAttribute('data-product-id') || ''
    const title = productElement.querySelector('.item-name')?.getAttribute('title') || ''
    const imageAttribute = productElement.querySelector('.item-image')?.getAttribute('data-srcset') || ''
    const images = imageAttribute.split(',')
    const image = images ? images[images.length - 1].replace(" //", "https://").replace(" 480w", "") : ''
    const showcaseElement = productElement.querySelector(".date-showcase")
    const showcase = showcaseElement ? [...showcaseElement.classList].filter(className => className !== "date-showcase") : []
    const url = productElement.querySelector('a')?.getAttribute('href') || ''
    const price = productElement.querySelector('[itemprop="price"]')?.getAttribute("content") || ''
    const isAvailable = productElement.querySelector('.overlay-no-stock') ? false : true
    return {
      id,
      title,
      image,
      showcase,
      url,
      price,
      isAvailable
    }
  })
  return products
}

export async function scrapWebsiteProducts() {
  const browser = await puppeteer.launch({
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox'
    ]
  })
  const page = await browser.newPage()
  await page.goto(`${process.env.URL}/jogos/page/5/`, { waitUntil: 'networkidle2', timeout: 0 })
  let results: Product[] = []
  let hasNextPage = true
  // while (hasNextPage) {
    const products = await scrapProducts(page)
    results = results.concat(products)
    const nextPage = await scrapNextPage(page)
    if (nextPage) {
      await page.goto(`${process.env.URL}${nextPage}`, { waitUntil: 'networkidle2', timeout: 0 })
    } else {
      hasNextPage = false
    }
  // }
  console.log(`Scrapped a total of ${results.length} products`)
  await browser.close()
  return results
}