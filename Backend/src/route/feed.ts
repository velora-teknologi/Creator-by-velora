import express from 'express'
import { prisma } from '../db'
import { authenticate } from '../middleware/auth'

const router = express.Router()

// GET /api/feed
router.get('/', authenticate, async (req, res) => {
  const userId = req.user.userId

  // Ambil ID akun yang di-follow
  const follows = await prisma.follow.findMany({
    where: { followerId: userId },
    select: { followingId: true }
  })
  const followingIds = follows.map(f => f.followingId)

  // Ambil posting dari akun-akun tersebut
  const posts = await prisma.post.findMany({
    where: { creator_id: { in: followingIds } },
    orderBy: { created_at: 'desc' },
    take: 20,
  })

  res.json(posts)
})

export default router
