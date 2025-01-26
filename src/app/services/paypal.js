import axios from 'axios';

/**
 * Paypal live Constants
 */
// const PAYPAL_BASE_URL = process.env.PAYPAL_BASE_URL_LIVE;
// const PAYPAL_CLIENT_ID = process.env.PAYPAL_CLIENT_ID_LIVE;
// const PAYPAL_SECRET = process.env.PAYPAL_SECRET_LIVE;

/**
 * Paypal testing Constants
 */
const PAYPAL_BASE_URL = process.env.PAYPAL_BASE_URL_LIVE;
const PAYPAL_CLIENT_ID = process.env.PAYPAL_CLIENT_ID_LIVE;
const PAYPAL_SECRET = process.env.PAYPAL_SECRET_LIVE;

async function generateAccessToken() {
  const response = await axios.post(
    `${PAYPAL_BASE_URL}/v1/oauth2/token`,
    'grant_type=client_credentials',
    {
      auth: {
        username: PAYPAL_CLIENT_ID,
        password: PAYPAL_SECRET,
      },
    }
  );
  return response.data.access_token;
}

export async function createOrder() {
  const accessToken = await generateAccessToken();
  const response = await axios.post(
    `${PAYPAL_BASE_URL}/v2/checkout/orders`,
    {
      intent: 'CAPTURE',
      purchase_units: [
        {
          items: [
            {
              name: 'Node.js Complete Course',
              description: 'Node.js Complete Course with Express and MongoDB',
              quantity: 1,
              unit_amount: {
                currency_code: 'USD',
                value: '1.00',
              },
            },
          ],
          amount: {
            currency_code: 'USD',
            value: '1.00',
            breakdown: {
              item_total: { currency_code: 'USD', value: '1.00' },
            },
          },
        },
      ],
      application_context: {
        return_url: `${process.env.BASE_URL}/complete-order`,
        cancel_url: `${process.env.BASE_URL}/cancel-order`,
        shipping_preference: 'NO_SHIPPING',
        user_action: 'PAY_NOW',
        brand_name: 'manfra.io',
      },
    },
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  return response.data.links.find((link) => link.rel === 'approve').href;
}

export async function capturePayment(orderId) {
  const accessToken = await generateAccessToken();
  const response = await axios.post(
    `${PAYPAL_BASE_URL}/v2/checkout/orders/${orderId}/capture`,
    {},
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  return response.data;
}
