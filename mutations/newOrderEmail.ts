/* eslint-disable */
import { KeystoneContext, SessionStore } from '@keystone-6/core/types';
import { Session } from '../types';
import { newOrderEmail } from '../lib/mail';

const graphql = String.raw;

async function sendNewOrderEmail(
  root: any,
  { processProductId }: { processProductId: string },
  context: KeystoneContext
) {
  console.log('Attempting Email Send');
  // 1. Query the current user see if they are signed in
  const sesh = context.session as Session;
  if (!sesh.itemId) {
    throw new Error('You must be logged in to do this!');
  }
  const order = await context.lists.ProcessProduct.findOne({
    where: { id: processProductId },
    resolveFields: graphql`
      id
      user {
        name
        email
      }
    `,
  });

  const orderNumber = `FL000${order.id}`;
  const orderName = order.user.name;
  const orderEmail = order.user.email;

  return await newOrderEmail(orderName, orderNumber, orderEmail);
}

export default sendNewOrderEmail;
