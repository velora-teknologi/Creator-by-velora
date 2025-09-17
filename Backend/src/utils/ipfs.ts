import axios from 'axios'

export async function uploadToIPFS(data: string | Buffer): Promise<string> {
  // Implementasi: upload ke IPFS (misal pakai web3.storage, nft.storage, atau HTTP API IPFS)
  // Contoh pseudo-code:
  const resp = await axios.post('https://ipfs.yourprovider.com/upload', { data })
  return resp.data.hash // IPFS hash
}
