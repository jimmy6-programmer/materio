const http = require('http')

async function run() {
  const urls = [
    'http://localhost:3002/api/admin/orders',
  ]

  for (const url of urls) {
    try {
      const res = await fetch(url)
      const text = await res.text()
      console.log('URL:', url)
      console.log('STATUS:', res.status)
      console.log(text.slice(0, 1000))
      console.log('\n---\n')
    } catch (err) {
      console.error('fetch error for', url, err)
    }
  }
}

run().catch(err => { console.error(err); process.exit(1) })
