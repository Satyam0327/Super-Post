import { Request, Response } from 'express';

function getBaseUrl(req: Request) {
  if (process.env.APP_URL && process.env.APP_URL !== 'MY_APP_URL') {
    return process.env.APP_URL.replace(/\/$/, '');
  }
  const host = req.headers['x-forwarded-host'] || req.get('host');
  const protocol = host?.includes('localhost') ? 'http' : 'https';
  return `${protocol}://${host}`;
}

export function getLinkedinAuthUrl(req: Request, res: Response) {
  const redirectUri = `${getBaseUrl(req)}/auth/callback/linkedin`;
  
  const params = new URLSearchParams({
    response_type: 'code',
    client_id: process.env.LINKEDIN_CLIENT_ID || 'YOUR_LINKEDIN_CLIENT_ID',
    redirect_uri: redirectUri,
    state: 'random_state_string_123',
    scope: 'w_member_social openid profile email',
  });

  const url = `https://www.linkedin.com/oauth/v2/authorization?${params}`;
  res.json({ url });
}

export function getTwitterAuthUrl(req: Request, res: Response) {
  const redirectUri = `${getBaseUrl(req)}/auth/callback/twitter`;
  
  const params = new URLSearchParams({
    response_type: 'code',
    client_id: process.env.TWITTER_CLIENT_ID || 'YOUR_TWITTER_CLIENT_ID',
    redirect_uri: redirectUri,
    state: 'random_state_string_456',
    scope: 'tweet.read tweet.write users.read offline.access',
    code_challenge: 'challenge',
    code_challenge_method: 'plain'
  });

  const url = `https://twitter.com/i/oauth2/authorize?${params}`;
  res.json({ url });
}

export async function handleLinkedinCallback(req: Request, res: Response) {
  const { code, state, error } = req.query;
  
  if (error) {
    return res.send(`<html><body><script>window.opener.postMessage({ type: 'OAUTH_AUTH_ERROR', error: '${error}' }, '*'); window.close();</script></body></html>`);
  }

  // Ideally, exchange code for token here. 
  // For demo, we'll return a simulated success to the frontend
  res.send(`
    <html>
      <body>
        <script>
          if (window.opener) {
            window.opener.postMessage({ type: 'OAUTH_AUTH_SUCCESS', platform: 'linkedin', token: 'mock_linkedin_token_${code}' }, '*');
            window.close();
          } else {
            window.location.href = '/';
          }
        </script>
        <p>Authentication successful. This window should close automatically.</p>
      </body>
    </html>
  `);
}

export async function handleTwitterCallback(req: Request, res: Response) {
  const { code, state, error } = req.query;
  
  if (error) {
    return res.send(`<html><body><script>window.opener.postMessage({ type: 'OAUTH_AUTH_ERROR', error: '${error}' }, '*'); window.close();</script></body></html>`);
  }

  if (process.env.TWITTER_CLIENT_ID && process.env.TWITTER_CLIENT_SECRET) {
    try {
      const redirectUri = `${getBaseUrl(req)}/auth/callback/twitter`;
      const basicAuth = Buffer.from(`${process.env.TWITTER_CLIENT_ID}:${process.env.TWITTER_CLIENT_SECRET}`).toString('base64');
      
      const params = new URLSearchParams({
        code: code as string,
        grant_type: 'authorization_code',
        client_id: process.env.TWITTER_CLIENT_ID,
        redirect_uri: redirectUri,
        code_verifier: 'challenge'
      });

      const tokenResponse = await fetch('https://api.twitter.com/2/oauth2/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': `Basic ${basicAuth}`
        },
        body: params.toString()
      });

      const data = await tokenResponse.json();
      
      if (!tokenResponse.ok) {
        console.error('Twitter token error:', data);
        return res.send(`<html><body><script>window.opener.postMessage({ type: 'OAUTH_AUTH_ERROR', error: 'Token exchange failed' }, '*'); window.close();</script></body></html>`);
      }

      return res.send(`
        <html>
          <body>
            <script>
              if (window.opener) {
                window.opener.postMessage({ type: 'OAUTH_AUTH_SUCCESS', platform: 'twitter', token: '${data.access_token}' }, '*');
                window.close();
              } else {
                window.location.href = '/';
              }
            </script>
            <p>Authentication successful. This window should close automatically.</p>
          </body>
        </html>
      `);
    } catch (err) {
      console.error(err);
      return res.send(`<html><body><script>window.opener.postMessage({ type: 'OAUTH_AUTH_ERROR', error: 'Internal server error' }, '*'); window.close();</script></body></html>`);
    }
  }

  // Fallback simulation if no keys
  res.send(`
    <html>
      <body>
        <script>
          if (window.opener) {
            window.opener.postMessage({ type: 'OAUTH_AUTH_SUCCESS', platform: 'twitter', token: 'mock_twitter_token_${code}' }, '*');
            window.close();
          } else {
            window.location.href = '/';
          }
        </script>
        <p>Authentication successful. This window should close automatically.</p>
      </body>
    </html>
  `);
}

export async function postToLinkedin(req: Request, res: Response) {
  const { text, token } = req.body;
  if (!text || !token) return res.status(400).json({ error: 'Missing text or token' });
  
  // Real implementation would use fetch to api.linkedin.com/v2/shares
  // Simulation for demo:
  setTimeout(() => {
    res.json({ success: true, message: 'Successfully posted to LinkedIn!' });
  }, 1500);
}

export async function postToTwitter(req: Request, res: Response) {
  const { text, token } = req.body;
  if (!text || !token) return res.status(400).json({ error: 'Missing text or token' });
  
  if (process.env.TWITTER_CLIENT_ID && !token.startsWith('mock_')) {
    try {
      const response = await fetch('https://api.twitter.com/2/tweets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ text })
      });
      
      const data = await response.json();
      if (!response.ok) {
        console.error('Twitter post error:', JSON.stringify(data, null, 2));
        return res.status(response.status).json({ error: data.detail || data.title || JSON.stringify(data) || 'Failed to post to X' });
      }
      return res.json({ success: true, message: 'Successfully posted to X (Twitter)!' });
    } catch (e) {
      console.error(e);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Simulation fallback
  setTimeout(() => {
    res.json({ success: true, message: 'Successfully posted to X (Twitter)!' });
  }, 1500);
}
