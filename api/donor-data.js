/* eslint-disable no-undef */
// Vercel Serverless Function for fetching donor data from Google Sheets
export default async function handler(req, res) {
  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { email } = req.query

  if (!email) {
    return res.status(400).json({ error: 'Email parameter is required' })
  }

  try {
    // Google Sheets API configuration
    const SPREADSHEET_ID = process.env.GOOGLE_SHEETS_SPREADSHEET_ID
    const PRIVATE_KEY = process.env.GOOGLE_SHEETS_PRIVATE_KEY?.replace(/\\n/g, '\n')
    const CLIENT_EMAIL = process.env.GOOGLE_SHEETS_CLIENT_EMAIL

    if (!SPREADSHEET_ID || !PRIVATE_KEY || !CLIENT_EMAIL) {
      console.error('Missing Google Sheets configuration')
      return res.status(500).json({ error: 'Server configuration error' })
    }

    // Create JWT for Google Sheets API authentication
    const jwt = await createJWT(CLIENT_EMAIL, PRIVATE_KEY)
    const accessToken = await getAccessToken(jwt)

    // Fetch data from Google Sheets
    const range = 'Sheet1!A:H' // Columns A through H
    const sheetsUrl = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${range}`

    const response = await fetch(sheetsUrl, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Google Sheets API error:', errorText)
      return res.status(500).json({ error: 'Failed to fetch data from spreadsheet' })
    }

    const data = await response.json()
    const rows = data.values || []

    if (rows.length < 2) {
      return res.status(404).json({ error: 'No data found in spreadsheet' })
    }

    // Find donor by email (case-insensitive)
    const donorRow = rows.slice(1).find(row => {
      const rowEmail = row[0]?.toLowerCase().trim()
      return rowEmail === email.toLowerCase().trim()
    })

    if (!donorRow) {
      return res.status(404).json({ error: 'Donor not found' })
    }

    // Map row data to object
    // Expected columns: Email, Nome, Valor Total, Valor Assinatura, Categoria, Tipo, Data Primeira Doacao, Estado Assinatura
    const donorData = {
      email: donorRow[0] || '',
      nome: donorRow[1] || '',
      valorTotal: parseFloat(donorRow[2]) || 0,
      valorAssinatura: parseFloat(donorRow[3]) || 0,
      categoria: donorRow[4] || 'Amigo',
      tipoContribuicao: donorRow[5] || 'Pontual',
      dataPrimeiraDoacao: donorRow[6] || '',
      estadoAssinatura: donorRow[7] || 'N/A',
    }

    // Add cache headers
    res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=300')

    return res.status(200).json(donorData)
  } catch (error) {
    console.error('Error in donor-data API:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}

// Helper function to create a JWT for Google API authentication
async function createJWT(clientEmail, privateKey) {
  const header = {
    alg: 'RS256',
    typ: 'JWT',
  }

  const now = Math.floor(Date.now() / 1000)
  const payload = {
    iss: clientEmail,
    scope: 'https://www.googleapis.com/auth/spreadsheets.readonly',
    aud: 'https://oauth2.googleapis.com/token',
    iat: now,
    exp: now + 3600, // 1 hour
  }

  const encodedHeader = base64UrlEncode(JSON.stringify(header))
  const encodedPayload = base64UrlEncode(JSON.stringify(payload))
  const signatureInput = `${encodedHeader}.${encodedPayload}`

  const signature = await signRS256(signatureInput, privateKey)
  const encodedSignature = base64UrlEncode(signature)

  return `${signatureInput}.${encodedSignature}`
}

// Helper function to get access token from Google
async function getAccessToken(jwt) {
  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: jwt,
    }),
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`Failed to get access token: ${errorText}`)
  }

  const data = await response.json()
  return data.access_token
}

// Base64 URL encode helper
function base64UrlEncode(data) {
  let base64
  if (typeof data === 'string') {
    base64 = Buffer.from(data).toString('base64')
  } else {
    base64 = Buffer.from(data).toString('base64')
  }
  return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

// Sign data with RS256 using Node.js crypto
async function signRS256(data, privateKey) {
  const crypto = await import('crypto')
  const sign = crypto.createSign('RSA-SHA256')
  sign.update(data)
  sign.end()
  return sign.sign(privateKey)
}
