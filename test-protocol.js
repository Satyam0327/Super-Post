const express = require('express');
const app = express();
app.set('trust proxy', 1);
app.get('/test', (req, res) => res.json({ protocol: req.protocol, host: req.get('host'), hostname: req.hostname }));
const srv = app.listen(3001, () => {
  fetch('http://localhost:3001/test', { headers: { 'X-Forwarded-Proto': 'https', 'X-Forwarded-Host': 'ais-dev.run.app' } })
    .then(r => r.json())
    .then(j => { console.log(j); srv.close(); });
});
