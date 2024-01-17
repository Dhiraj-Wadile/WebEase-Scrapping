"use server";
import { revalidateTag } from "next/cache";
import { revalidatePath } from "next/cache";
import { connect } from "http2";
import { scrapeAmazonProduct } from "../scraper";
import { connectToDB } from "../scraper/mongoose";
import Product from "../models/product.model";
import { getAveragePrice, getHighestPrice, getLowestPrice } from "../utils";
import { generateEmailBody, sendEmail } from "../nodemailer";

export async function scrapeAndStoreProduct(productUrl: string) {
  if (!productUrl) return;
  console.log("scraping product", productUrl);

  try {
    connectToDB();

    const scrapedProduct = await scrapeAmazonProduct(productUrl);

    if (!scrapedProduct) return;

    let product = scrapedProduct;

    const existingProduct = await Product.findOne({ url: scrapedProduct.url });

    if (existingProduct) {
      const updatedPriceHistory: any = [
        ...existingProduct.priceHistory,
        { price: scrapedProduct.currentPrice },
      ];
      product = {
        ...scrapedProduct,
        priceHistory: updatedPriceHistory,
        lowestPrice: getLowestPrice(updatedPriceHistory),
        highestPrice: getHighestPrice(updatedPriceHistory),
        averagePrice: getAveragePrice(updatedPriceHistory),
      };
    }
    const newProduct = await Product.findOneAndUpdate(
      { url: scrapedProduct.url },
      product,
      { upsert: true, new: true }
    );
    revalidatePath(`/product/${newProduct._id}`);
  } catch (error: any) {
    throw new Error(`failed to scrape product ${productUrl}: ${error.message}`);
  } finally {
  }
}

export async function getProductById(productId: string) {
  try {
    connectToDB();
    const product = await Product.findOne({ _id: productId });
    revalidatePath(`/product/${product._id}`);
    if (!product) return null;

    return product;
  } catch (error: any) {
    throw new Error(`failed to get product ${productId}: ${error.message}`);
  } finally {
  }
}

export async function getAllProducts() {
  try {
    connectToDB();
    const product = await Product.find();
    return product;
  } catch (error: any) {
    console.log("error", error);
  }
}

export async function getSimilarProducts(productId: string) {
  try {
    connectToDB();
    const currentProduct = await Product.findById(productId);
    if (!currentProduct) return null;
    const similarProduct = await Product.find({
      id: { $ne: productId },
    }).limit(6);
    return similarProduct;
  } catch (error: any) {
    console.log("error", error);
  }
}

export async function addUserEmailToProduct(
  productId: string,
  userEmail: string
) {
  try {
    //send our 1st email
    const product = await Product.findById(productId);
    if (!product) return;
    const userExists = product.users.some(
      (user: User) => user.email === userEmail
    );
    if (!userExists) {
      product.users.push({ email: userEmail });
      await product.save();
      const emailContent = await generateEmailBody(product, "WELCOME");

      await sendEmail(emailContent, [userEmail]);
    }
  } catch (error) {}
}
