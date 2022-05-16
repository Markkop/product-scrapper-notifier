import axios from 'axios'
import { Product } from './types';

const getAxiosInstance = () => axios.create({
  baseURL: `https://api.telegram.org/bot${process.env.TELEGRAM_BOTID}/`,
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  }
});

export async function sendPhotoWithCaptionToTelegram(photoUrl: string, caption: string, replyMarkup: any = undefined) {
  try {
    const chatId = process.env.TELEGRAM_USERID
    const options = {
      photo: photoUrl, 
      chat_id: chatId,
      disable_notification: true,
      caption,
      parse_mode: 'html',
      reply_markup: replyMarkup
    }
    await getAxiosInstance().post('/sendPhoto', options)
  } catch (error) {
    console.log(error)
  }
}

const eventMessage: Record<string, string> = {
  'now-available': 'Now Available',
  'new': 'New Product'
}

export async function sendProductToTelegram(product: Product, event: string) {
  const messageTitle = `<b>${eventMessage[event]}</b>: ${product.title}`
  const priceText = Number(product.price).toLocaleString(
    'pt-BR', 
    { minimumFractionDigits: 2 , style: 'currency', currency: 'BRL' }
  )
  await sendPhotoWithCaptionToTelegram(
    product.image,
    `${messageTitle}\n<b>Price</b>: ${priceText}`, 
    { inline_keyboard: [[{ text: "Go to product", url: product.url }]] }
  )
}