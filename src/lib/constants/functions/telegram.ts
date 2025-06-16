import { Telegraf } from 'telegraf'
import { message } from 'telegraf/filters'
import type { Update } from '@telegraf/types'
import { createClient } from '@supabase/supabase-js'
import { TELEGRAM_BOT_API_KEY } from '$env/static/private'
import { PUBLIC_SUPABASE_ANON_KEY, PUBLIC_SUPABASE_URL } from '$env/static/public'

const bot = new Telegraf(TELEGRAM_BOT_API_KEY)
const supabase = createClient(
  PUBLIC_SUPABASE_URL,
  PUBLIC_SUPABASE_ANON_KEY
)

// Reply with help text
const helpText = `
Available commands:
/getScore - View all team scores
/createTeam <teamName> - Create a new team (admin only)
/addPoints <teamName> <points> - Add points to a team (admin only)
/deductPoints <teamName> <points> - Deduct points from a team (admin only)
`

// Utility: Check if user is an admin
const isAdmin = async (userId: string): Promise<boolean> => {
  const { data } = await supabase
    .from('admins')
    .select()
    .eq('user_id', userId)
    .maybeSingle()

  return !!data
}

// Command: /help  — Public
bot.command('help', (ctx) => ctx.reply(helpText))

// Catch unknown /commands (but not regular text messages)
bot.on(message('text'), async (ctx, next) => {
  const text = ctx.message.text.trim()
  if (text.startsWith('/') && !text.startsWith('/getScore') && !text.startsWith('/createTeam') && !text.startsWith('/addPoints') && !text.startsWith('/deductPoints') && !text.startsWith('/help')) {
    return ctx.reply(`❓ Unknown command.\n${helpText}`)
  }

  // Allow next middleware if not a command
  return next()
})

// Command: /getScore — Public
bot.command('getScore', async (ctx) => {
  const { data, error } = await supabase.from('teams').select()
  if (error) return ctx.reply(`Error: ${error.message}`)
  if (!data || data.length === 0) return ctx.reply('No teams yet.')

  const response = data.map((t) => `${t.name}: ${t.points} pts`).join('\n')
  ctx.reply(response)
})

// Command: /createTeam <name> — Admin only
bot.command('createTeam', async (ctx) => {
  const userId = ctx.from.id.toString()
  if (!(await isAdmin(userId))) return ctx.reply('You are not an admin.')

  const name = ctx.message.text.split(' ')[1]
  if (!name) return ctx.reply('Usage: /createTeam <teamName>')

  const { error } = await supabase.from('teams').insert({ name, points: 0 })
  if (error) return ctx.reply(`Error: ${error.message}`)
  ctx.reply(`Team "${name}" created.`)
})

// Command: /addPoints <team> <points> — Admin only
bot.command(['addPoints', 'deductPoints'], async (ctx) => {
  const userId = ctx.from.id.toString()
  if (!(await isAdmin(userId))) {
    return ctx.reply('You are not an admin.')
  }

  const parts = ctx.message.text.trim().split(' ')
  const command = parts[0]
  const teamName = parts[1]
  const pointStr = parts[2]

  const delta = parseInt(pointStr)
  if (!teamName || isNaN(delta)) {
    return ctx.reply(`Usage: ${command} <teamName> <points>`)
  }

  const actualDelta = command === '/addPoints' ? delta : -delta

  // Fetch current points
  const { data: teamData, error: fetchError } = await supabase
    .from('teams')
    .select('points')
    .eq('name', teamName)
    .single()

  if (fetchError || !teamData) {
    return ctx.reply(`Team "${teamName}" not found.`)
  }

  const newPoints = teamData.points + actualDelta

  // Update points
  const { error: updateError } = await supabase
    .from('teams')
    .update({ points: newPoints })
    .eq('name', teamName)

  if (updateError) {
    return ctx.reply(`Failed to update score: ${updateError.message}`)
  }

  ctx.reply(
    `✅ Team "${teamName}" now has ${newPoints} points (${actualDelta > 0 ? '+' : ''}${actualDelta}).`
  )
})

// Handle webhook (Cloudflare Pages Functions)
export const onRequestPost: PagesFunction = async (context) => {
  try {
    const update = (await context.request.json()) as Update
    await bot.handleUpdate(update)
    return new Response('ok', { status: 200 })
  } catch (err) {
    console.error('Bot error:', err)
    return new Response('Bot error', { status: 500 })
  }
}