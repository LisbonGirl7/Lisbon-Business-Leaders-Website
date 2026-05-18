export default async function handler(req, res) {
  const apiKey = process.env.BREVO_API_KEY;

  try {
    const response = await fetch('https://api.brevo.com/v3/account', {
      headers: { 'api-key': apiKey }
    });

    if (response.ok) {
      return res.status(200).json({ status: 'ok', brevo: 'connected' });
    } else {
      return res.status(500).json({ status: 'error', brevo: 'api key invalid or revoked' });
    }
  } catch (err) {
    return res.status(500).json({ status: 'error', message: err.message });
  }
}
