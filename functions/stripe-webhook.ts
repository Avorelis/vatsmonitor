// functions/stripe-webhook.ts                <-- bleibt in /functions
import { Stripe } from 'stripe';

// 1) Definiere das Typ‑Binding deiner Env‑Variablen
interface Env {
  STRIPE_SECRET_KEY: string;
  STRIPE_WEBHOOK_SECRET: string; // <= im Dashboard hinterlegen!
}

// 2) Pages‑Function‑Handler
export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  // Stripe‑SDK initialisieren
  const stripe = new Stripe(env.STRIPE_SECRET_KEY, {
    apiVersion: '2023-10-16',
  });

  // 3) Roh‑Body auslesen (Pages liefert bereits einen ReadableStream)
  const rawBody = await request.text();
  const sig = request.headers.get('stripe-signature') || '';

  try {
    // 4) Event verifizieren
    const event = stripe.webhooks.constructEvent(
      rawBody,
      sig,
      env.STRIPE_WEBHOOK_SECRET
    );

    // 5) Reagiere auf relevante Events
    switch (event.type) {
      case 'checkout.session.completed':
        // TODO:  ➜  in Supabase Abo‑Status aktualisieren
        break;
      // weitere Event‑Typen …
    }

    return new Response(null, { status: 200 });
  } catch (err) {
    console.error('⚠️  Webhook error', err);
    return new Response('Webhook Error', { status: 400 });
  }
};
