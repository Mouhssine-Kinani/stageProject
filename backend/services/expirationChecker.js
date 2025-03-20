import Product from '../models/Products/product.model.js';
import User from '../models/Users/user.model.js';
import { calculateExpirationDate, getRemainingDays } from '../utils/expirationUtils.js';
import { sendExpirationNotification } from './emailService.js';
import Notification from '../models/Notifications/notification.model.js';

const NOTIFICATION_INTERVALS = [20, 7, 3];

const getAdminUsers = async () => {
  return User.find({
    'role.roleName': { $in: ['Admin', 'Super Admin'] },
    status: 'active'
  });
};

const hasNotificationBeenSent = async (productId, daysRemaining) => {
  const existingNotification = await Notification.findOne({
    productId,
    delai_notification: `${daysRemaining}jrs`,
    date_envoi: {
      $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) // Within last 24 hours
    }
  });
  return !!existingNotification;
};

const recordNotification = async (productId, daysRemaining) => {
  const notification = new Notification({
    productId,
    contenu: `Expiration notification sent for ${daysRemaining} days remaining`,
    delai_notification: `${daysRemaining}jrs`,
    date_envoi: new Date()
  });
  await notification.save();
};

const checkExpirations = async () => {
  try {
    // const products = await Product.find({
    //   productDeployed: { $exists: true, $ne: null }
    // });
    const products = await Product.find();
    
    const admins = await getAdminUsers();
    console.log(admins);
    
    for (const product of products) {
      const expirationDate = calculateExpirationDate(product);
      const daysRemaining = getRemainingDays(expirationDate);
      
      // Check if we need to send a notification for this interval
      for (const interval of NOTIFICATION_INTERVALS) {
        if (daysRemaining === interval) {
          // Check if we've already sent a notification for this interval
          const alreadySent = await hasNotificationBeenSent(product._id, interval);
          if (!alreadySent) {
            await sendExpirationNotification(admins, product, daysRemaining, expirationDate);
            await recordNotification(product._id, interval);
          }
        }
      }
      await sendExpirationNotification(admins, product, daysRemaining, expirationDate);
      await recordNotification(product._id, 7);
      console.log('GGGGGGGG');
      console.log(product._id);
      console.log('GGGGGGGG');
    }
  } catch (error) {
    console.error('Error in expiration checker:', error);
  }
};

export { checkExpirations }; 