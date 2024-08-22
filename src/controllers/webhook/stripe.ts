import Chat from '@models/Chat';
import Order from '@models/Order';
import Stripe from 'stripe';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async (req: IReq, res: IRes) => {
  const sig = req.headers['stripe-signature'];

  let event: Stripe.Event | null = null;
  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET,
    );
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed': {
      const eventData = event.data.object;
      const info = eventData.metadata;

      const order = await Order.findOne({
        _id: info.orderID,
        paid: false,
      }).populate('user');

      if (!order) {
        return res.status(400).send('Order not found');
      }

      // Update the order to paid
      await Order.updateOne(
        {
          _id: order._id,
        },
        {
          paid: true,
        },
      );

      await Chat.create({
        user: order.user._id,
        mentor: order.mentor,
      });
      break;
    }
    default: {
      console.log(`Unhandled event type ${event.type}`);
    }
  }

  // Return a 200 response to acknowledge receipt of the event
  return res.send();
};
