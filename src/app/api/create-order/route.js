import { createOrder } from '../paypal';

export async function POST() {
    try {
        const approvalUrl = await createOrder();
        console.log('Approve Url: ', approvalUrl)

        return new Response(JSON.stringify({
            approvalUrl
        }), {
            status: 200, headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        console.log('Error: ', error)
        return new Response(
            JSON.stringify({ error: error.message }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
}
