import Swell from '@swell/js'

const swell = new Swell({
  storeId: process.env.NEXT_PUBLIC_SWELL_STORE_ID,
  publicKey: process.env.NEXT_PUBLIC_SWELL_PUBLIC_KEY,
})
