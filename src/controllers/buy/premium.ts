import Premium from '@models/Premium';
import Stripe from 'stripe';
const stripe = new Stripe(process.env.STRIPE_SECRET);

export default async (req: IReq, res: IRes) => {
  // existing premium check
  const existingPremium = await Premium.findOne({
    user: req.user._id,
    isActive: true,
  });

  if (existingPremium) {
    return res.status(400).json({
      message: 'Already a premium mentor',
    });
  }

  const premium = await new Premium({
    user: req.user._id,
  }).save();

  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        price_data: {
          currency: 'usd',
          product_data: {
            name: `Buy Premium Membership`,
          },
          unit_amount: 500, // 5 USD,
          recurring: {
            interval: 'month',
          },
        },
        quantity: 1,
      },
    ],
    mode: 'subscription',
    customer_email: req.user.email,
    billing_address_collection: 'auto',
    metadata: {
      userID: String(req.user._id),
      premiumID: String(premium._id),
    },
    success_url: `${process.env.FRONTEND_URL}?success=true&id=${premium._id}`,
    cancel_url: `${process.env.FRONTEND_URL}?canceled=true`,
  });

  return res.json({
    redirectURL: session.url,
  });
};
