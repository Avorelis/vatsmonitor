// functions/stripe-webhook.ts
import { Stripe } from 'stripe';

/** Cloudflare‑Pages‑Env‑Variablen */
interface Env {
  STRIPE_SECRET_KEY: string;
  STRIPE_WEBHOOK_SECRET: string;
}

/** POST / functions/stripe-webhook */
export const onRequestPost = async (
  { request, env }: { request: Request; env: Env },
): Promise<Response> => {
  /* 1 · Stripe‑SDK initialisieren */
  const stripe = new Stripe(env.STRIPE_SECRET_KEY, {
    apiVersion: '2023-10-16',
  });

  /* 2 · Roh‑Body + Signatur auslesen */
  const rawBody = await request.text();
  const sig = request.headers.get('stripe-signature') ?? '';

  try {
    /* 3 · Event verifizieren */
    const event = stripe.webhooks.constructEvent(
      rawBody,
      sig,
      env.STRIPE_WEBHOOK_SECRET,
    );

    /* 4 · Relevante Events behandeln */
    switch (event.type) {
      case 'checkout.session.completed':
        // TODO: Supabase‑Abo‑Status updaten
        break;

      // weitere Event‑Typen …
    }

    return new Response(null, { status: 200 });
  } catch (err) {
    console.error('⚠️  Webhook error', err);
    return new Response('Webhook Error', { status: 400 });
  }
};
