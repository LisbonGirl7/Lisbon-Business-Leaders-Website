export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { firstname, lastname, email } = req.body;

  if (!email || !firstname || !lastname) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const apiKey = process.env.BREVO_API_KEY;

  try {
    const contactRes = await fetch('https://api.brevo.com/v3/contacts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': apiKey
      },
      body: JSON.stringify({
        email,
        listIds: [2],
        attributes: { FIRSTNAME: firstname, LASTNAME: lastname }
      })
    });

    if (!contactRes.ok && contactRes.status !== 204) {
      const data = await contactRes.json();
      if (data.code === 'duplicate_parameter') {
        return res.status(409).json({ code: 'duplicate_parameter' });
      }
      return res.status(500).json({ error: 'Failed to subscribe' });
    }

    // Notify Kasia
    await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': apiKey
      },
      body: JSON.stringify({
        sender: { name: 'Lisbon Business Leaders', email: 'kasia@lisbonbusinessleaders.com' },
        to: [{ email: 'kasia@lisbonbusinessleaders.com', name: 'Kasia' }],
        subject: 'New Leadership Insider subscriber - ' + firstname + ' ' + lastname,
        htmlContent: '<p>A new subscriber just signed up.</p><ul><li><strong>Name:</strong> ' + firstname + ' ' + lastname + '</li><li><strong>Email:</strong> ' + email + '</li></ul>'
      })
    });

    return res.status(200).json({ success: true });

  } catch (err) {
    return res.status(500).json({ error: 'Server error' });
  }
}
