// Server-side PayPal REST helpers: OAuth token + webhook signature verification.
// Docs: https://developer.paypal.com/api/rest/webhooks/#link-verifyeventsignature

const PAYPAL_API_BASE =
  process.env.PAYPAL_API_BASE ||
  (process.env.PAYPAL_MODE === 'sandbox'
    ? 'https://api-m.sandbox.paypal.com'
    : 'https://api-m.paypal.com');

let cachedToken: { value: string; expiresAt: number } | null = null;

async function getAccessToken(): Promise<string> {
  if (cachedToken && cachedToken.expiresAt > Date.now()) {
    return cachedToken.value;
  }

  const clientId = process.env.PAYPAL_CLIENT_ID;
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET;
  if (!clientId || !clientSecret) {
    throw new Error('PAYPAL_CLIENT_ID/PAYPAL_CLIENT_SECRET are not configured');
  }

  const response = await fetch(`${PAYPAL_API_BASE}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`,
    },
    body: 'grant_type=client_credentials',
  });

  if (!response.ok) {
    throw new Error(`PayPal OAuth token request failed: ${response.status}`);
  }

  const data = await response.json();
  cachedToken = {
    value: data.access_token,
    // Refresh a little early to avoid using a token that expires mid-flight.
    expiresAt: Date.now() + (data.expires_in - 60) * 1000,
  };
  return cachedToken.value;
}

export interface PaypalWebhookHeaders {
  transmissionId: string | null;
  transmissionTime: string | null;
  certUrl: string | null;
  authAlgo: string | null;
  transmissionSig: string | null;
}

/**
 * Verifies a PayPal webhook notification against PAYPAL_WEBHOOK_ID using
 * PayPal's Verify Webhook Signature API. Returns false (never throws) on any
 * failure so callers can uniformly reject with a 401.
 */
export async function verifyPaypalWebhookSignature(
  headers: PaypalWebhookHeaders,
  webhookEvent: unknown,
): Promise<boolean> {
  const webhookId = process.env.PAYPAL_WEBHOOK_ID;
  if (!webhookId) {
    console.error('[paypal-webhook] PAYPAL_WEBHOOK_ID is not configured — rejecting webhook.');
    return false;
  }

  const { transmissionId, transmissionTime, certUrl, authAlgo, transmissionSig } = headers;
  if (!transmissionId || !transmissionTime || !certUrl || !authAlgo || !transmissionSig) {
    console.error('[paypal-webhook] Missing required PayPal signature headers — rejecting webhook.');
    return false;
  }

  try {
    const accessToken = await getAccessToken();
    const response = await fetch(`${PAYPAL_API_BASE}/v1/notifications/verify-webhook-signature`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        transmission_id: transmissionId,
        transmission_time: transmissionTime,
        cert_url: certUrl,
        auth_algo: authAlgo,
        transmission_sig: transmissionSig,
        webhook_id: webhookId,
        webhook_event: webhookEvent,
      }),
    });

    if (!response.ok) {
      console.error(`[paypal-webhook] Verify signature request failed: ${response.status}`);
      return false;
    }

    const data = await response.json();
    return data.verification_status === 'SUCCESS';
  } catch (error) {
    console.error('[paypal-webhook] Error verifying webhook signature:', error);
    return false;
  }
}
