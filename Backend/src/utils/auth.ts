import { ethers } from 'ethers'

export function generateNonce() {
  return Math.floor(Math.random() * 1e16).toString()
}

export function verifySignature(address: string, nonce: string, signature: string) {
  try {
    const recovered = ethers.utils.verifyMessage(nonce, signature)
    return recovered.toLowerCase() === address.toLowerCase()
  } catch {
    return false
  }
}
