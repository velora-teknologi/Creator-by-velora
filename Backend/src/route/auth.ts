import express from 'express'
import { verifySignature, generateNonce } from '../utils/auth'
import { prisma } from '../db'
import jwt from 'jsonwebtoken'

const router = express.Router()
const nonces = new Map<string, string>()

router.get('/challenge', async (req, res) => {
  const { wallet_address } = req.query
  if (!wallet_address) return res.status(400).json({ error: 'Missing wallet_address' })
  const nonce = generateNonce()
  nonces.set(`${wallet_address}`.toLowerCase(), nonce)
  res.json({ nonce })
})

router.post('/verify', async (req, res) => {
  const { wallet_address, signature } = req.body
  const nonce = nonces.get(`${wallet_address}`.toLowerCase())
  if (!nonce) return res.status(400).json({ error: 'No challenge found' })
  const valid = verifySignature(wallet_address, nonce, signature)
  if (!valid) return res.status(401).json({ error: 'Invalid signature' })
  nonces.delete(`${wallet_address}`.toLowerCase())
  let user = await prisma.user.findUnique({ where: { wallet_address } })
  if (!user) {
    user = await prisma.user.create({ data: { wallet_address, username: `user_${wallet_address.slice(2,8)}` } })
  }
  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!)
  res.json({ token, user })
})

export default router
