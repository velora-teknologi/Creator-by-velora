import express from 'express'
import { prisma } from '../db'
import { authenticate } from '../middleware/auth'

const router = express.Router()

// GET /api/users/:id
router.get('/:id', async (req, res) => {
  const user = await prisma.user.findUnique({ where: { id: req.params.id } })
  if (!user) return res.status(404).json({ error: 'Not found' })
  res.json(user)
})

// POST /api/users
router.post('/', authenticate, async (req, res) => {
  const { bio, profile_pic_ipfs_hash, username } = req.body
  const userId = req.user.userId
  const user = await prisma.user.update({
    where: { id: userId },
    data: { bio, profile_pic_ipfs_hash, username },
  })
  res.json(user)
})

export default router
