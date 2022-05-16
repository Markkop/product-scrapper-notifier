import axios from 'axios'
import { Product } from './types';

const getAxiosInstance = () => axios.create({
  baseURL: `https://api.telegram.org/bot${process.env.TELEGRAM_BOTID}/`,
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  }
});


export async function sendTextToTelegram(text: string) {
  try {
    const chatId = process.env.TELEGRAM_USERID
    const options = {
      text, 
      chat_id: chatId,
      parse_mode: 'html',
      disable_notification: true
    }
    await getAxiosInstance().post('/sendMessage', options)
    return `Message sent to telegram's chat id ${chatId}`
  } catch (error) {
    console.log(error)
  }
}

export async function sendPhotoToTelegram(photoUrl: string) {
  try {
    const chatId = process.env.TELEGRAM_USERID
    const options = {
      photo: photoUrl, 
      chat_id: chatId,
      disable_notification: true
    }
    await getAxiosInstance().post('/sendPhoto', options)
    return `Photo sent to telegram's chat id ${chatId}`
  } catch (error) {
    console.log(error)
  }
}

const eventMessage: Record<string, string> = {
  'now-available': 'Now Available',
  'new': 'New Product'
}

export async function sendProductToTelegram(product: Product, event: string) {
  await sendPhotoToTelegram(product.image)
  let text = `${eventMessage[event]}: ${product.title}`
  await sendTextToTelegram(text)
}