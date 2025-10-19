# Travoru API Starter (Vercel Serverless + SendGrid)

Minimal serverless endpoint to send transactional emails safely.

## Deploy (Vercel)
1) Import this repo into Vercel (or create a new project from the folder).
2) Set Environment Variables:
   - `SENDGRID_API_KEY`
   - `FROM_EMAIL` = `no-reply@travoru.com`
   - `FROM_NAME`  = `Travoru`
   - `REPLY_TO`   = `hello@travoru.com`
3) Deploy. Endpoint:
```
https://<your-project>.vercel.app/api/send-email
```

## Test
```bash
curl -i -X POST https://<your-project>.vercel.app/api/send-email \
  -H "Content-Type: application/json" \
  --data '{ "to":"your@gmail.com", "subject":"Test from Travoru", "text":"Hello" }'
```

## Framer (Embed snippet)
```html
<button id="send">Send Itinerary</button>
<script>
document.getElementById('send').addEventListener('click', async () => {
  const res = await fetch('https://<your-project>.vercel.app/api/send-email', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ to: 'your@gmail.com', subject: 'Your itinerary', text: 'Hello from Travoru' })
  });
  alert(res.ok ? 'Sent!' : 'Error');
});
</script>
```
