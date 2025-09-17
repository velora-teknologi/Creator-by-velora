import express from 'express'
import { prisma } from '../db'
import { authenticate } from '../middleware/auth'
import { uploadToIPFS } from '../utils/ipfs'

const router = express.Router()

// POST /api/posts
router.post('/', authenticate, async (req, res) => {
  // Expects: title, description, media (base64 or file), nft_token_id (optional)
  const { title, description, media, nft_token_id } = req.body
  const creatorId = req.user.userId

  // Upload media to IPFS
  const mediaHash = await uploadToIPFS(media)

  // Upload metadata JSON to IPFS
  const metadata = {
    title,
    description,
    media_hash: mediaHash,
    creator_wallet: req.user.wallet_address,
  }
  const ipfs_hash = await uploadToIPFS(JSON.stringify(metadata))

  const post = await prisma.post.create({
    data: {
      creator_id: creatorId,
      ipfs_hash,
      nft_token_id,
    },
  })
  res.json(post)
})
