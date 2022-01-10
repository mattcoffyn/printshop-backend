import { KeystoneContext, SessionStore } from '@keystone-6/core/types';
import { Session } from '../types';
import { completedEmail } from '../lib/mail';

const graphql = String.raw;

async function sendEmail(
  root: any,
  { processProductId }: { processProductId: string },
  context: KeystoneContext
) {
  console.log('Attempting Email Send');
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

  return await completedEmail(orderName, orderNumber, orderEmail);
}

export default sendEmail;
