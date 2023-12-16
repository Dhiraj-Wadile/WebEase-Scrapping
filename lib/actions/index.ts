"use server"

import { scrapeAmazonProduct } from "../scraper";

export async function scrapeAndStoreProduct (productUrl: string) {
    if (!productUrl) return;
    console.log("scraping product", productUrl);

    try {
        const scrapeProduct = await scrapeAmazonProduct(productUrl);

        if (!scrapeProduct) return;

        
        
        
    } catch (error : any)
    {
        throw new Error(`failed to scrape product ${productUrl}: ${error.message}`);
    } finally {
        
    }
}