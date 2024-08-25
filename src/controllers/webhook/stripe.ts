import Chat from '@models/Chat';
import Order from '@models/Order';
import Premium from '@models/Premium';
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

  if (event.type.startsWith('customer.subscription')) {
    if (event.type === 'customer.subscription.deleted') {
      const subscription = event.data.object as Stripe.Subscription;
      await Premium.findOneAndDelete({
        subscriptionID: subscription.id,
      });
    }

    if (event.type === 'customer.subscription.updated') {
      const subscription = event.data.object as Stripe.Subscription;
      let isActive = false;
      if (
        subscription.status === 'active' ||
        subscription.status === 'trialing'
      ) {
        isActive = true;
      }
      await Premium.updateOne(
        {
          subscriptionID: subscription.id,
        },
        {
          isActive,
        },
      );
    }

    return res.send();
  }

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed': {
      const eventData = event.data.object;
      const info = eventData.metadata;

      if (info?.premiumID) {
        const premium = await Premium.findOne({
          _id: info.premiumID,
          paid: false,
        });

        if (!premium) {
          return res.status(400).send('Premium not found');
        }

        // Update the premium to paid
        await Premium.updateOne(
          {
            _id: premium._id,
          },
          {
            isActive: true,
            subscriptionID: eventData.subscription,
          },
        );
      } else {
        // Handle Normal Order
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

        const chat = await Chat.findOne({
          order: order._id,
        });
        if (chat) {
          chat.pausingOn = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days
          chat.order = order._id;
          await chat.save();
          break;
        }
        await Chat.create({
          order: order._id,
          user: order.user._id,
          mentor: order.mentor,
          pausingOn: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
        });
      }
      break;
    }
    default: {
      console.log(`Unhandled event type ${event.type}`);
    }
  }

  // Return a 200 response to acknowledge receipt of the event
  return res.send();
};
