import swell from 'swell-js'
// Initialize client with your store ID and a public key
swell.init('process.env.NEXT_PUBLIC_SWELL_STORE_ID', 'process.env.NEXT_PUBLIC_SWELL_PUBLIC_KEY')

export default swell;