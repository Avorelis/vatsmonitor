import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY')!, {
  apiVersion: '2022-11-15',
});

export async function POST(req: Request) {
  const { priceId } = await req.json();

  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/checkout/success`,
    cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/checkout/cancel`,
    billing_address_collection: 'auto',
    subscription_data: { trial_period_days: 14 },
  });

  return NextResponse.json({ url: session.url });
}
