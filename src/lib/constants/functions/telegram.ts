import { Telegraf } from 'telegraf'
import type { Update } from '@telegraf/types'
import { createClient } from '@supabase/supabase-js'
import { TELEGRAM_BOT_API_KEY } from '$env/static/private'
import { PUBLIC_SUPABASE_ANON_KEY, PUBLIC_SUPABASE_URL } from '$env/static/public'

const bot = new Telegraf(TELEGRAM_BOT_API_KEY) // set via env

const supabase = createClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY)

bot.on('text', async (ctx) => {
  const msg = ctx.message.text
  const userId = ctx.from.id.toString()

  await supabase.from('messages').insert({ user_id: userId, message: msg })
  ctx.reply(`Got it! You said: ${msg}`)
})

// Export Cloudflare function
export const onRequestPost: PagesFunction = async (context) => {
  const request = context.request
  const update = await context.request.json() as Update
  await bot.handleUpdate(update)
  return new Response('ok')
}