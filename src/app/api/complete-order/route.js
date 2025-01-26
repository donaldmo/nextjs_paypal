import { capturePayment } from '../paypal';

export async function POST(req) {
  try {
    const { token, payerID } = await req.json();

    if (!token || !payerID) {
      return new Response('Missing token or PayerID.', { status: 400 });
    }

    const order = await capturePayment(token); // Assuming `capturePayment` only needs the token
    console.log('Order: ', order);

    return new Response('Course purchased successfully', { status: 200 });
  } catch (error) {
    return new Response('Error: ' + error.message, { status: 500 });
  }
}
