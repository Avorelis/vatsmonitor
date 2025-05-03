import { Stripe } from 'stripe';

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY')!, {
  apiVersion: '2023-10-16',
});

export const onRequestPost: PagesFunction = async ({ request }) => {
  const sig = request.headers.get('stripe-signature')!;
  const body = await request.text();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      Deno.env.get('STRIPE_WEBHOOK_SECRET')!
    );
  } catch (err) {
    return new Response(`Webhook Error: ${(err as Error).message}`, { status: 400 });
  }

  // Beispiel‑Handling: Abo erfolgreich
  if (event.type === 'checkout.session.completed') {
    // TODO: Supabase Client → user als "paid" markieren
    console.log('Checkout complete:', event.data.object.id);
  }

  return new Response(null, { status: 200 });
};
