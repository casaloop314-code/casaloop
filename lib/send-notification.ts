import { collection, addDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export type NotificationType = 'message' | 'payment' | 'listing' | 'service' | 'review' | 'system';

interface SendNotificationParams {
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  actionUrl?: string;
  metadata?: Record<string, any>;
}

/**
 * Send a notification to a user
 * @param params Notification parameters
 * @returns Promise with notification ID
 */
export async function sendNotification(params: SendNotificationParams): Promise<string> {
  try {
    const notificationData = {
      userId: params.userId,
      type: params.type,
      title: params.title,
      message: params.message,
      read: false,
      createdAt: Date.now(),
      actionUrl: params.actionUrl || null,
      metadata: params.metadata || {}
    };

    const docRef = await addDoc(collection(db, "notifications"), notificationData);
    
    console.log("[v0] Notification sent to user:", params.userId, "ID:", docRef.id);
    
    return docRef.id;
  } catch (error) {
    console.error("[v0] Error sending notification:", error);
    throw error;
  }
}

/**
 * Send notification for new message
 */
export async function notifyNewMessage(recipientId: string, senderName: string, preview: string) {
  return sendNotification({
    userId: recipientId,
    type: 'message',
    title: `New message from ${senderName}`,
    message: preview,
  });
}

/**
 * Send notification for payment received
 */
export async function notifyPaymentReceived(userId: string, amount: number, propertyTitle: string) {
  return sendNotification({
    userId: userId,
    type: 'payment',
    title: 'Payment Received',
    message: `You received ${amount} Pi for "${propertyTitle}"`,
  });
}

/**
 * Send notification for property view
 */
export async function notifyPropertyView(ownerId: string, propertyTitle: string, viewCount: number) {
  return sendNotification({
    userId: ownerId,
    type: 'listing',
    title: 'Property Getting Attention',
    message: `"${propertyTitle}" has reached ${viewCount} views!`,
  });
}

/**
 * Send notification for new review
 */
export async function notifyNewReview(userId: string, rating: number, reviewer: string, itemTitle: string) {
  return sendNotification({
    userId: userId,
    type: 'review',
    title: 'New Review Received',
    message: `${reviewer} left a ${rating}-star review for "${itemTitle}"`,
  });
}

/**
 * Send system notification
 */
export async function notifySystem(userId: string, title: string, message: string) {
  return sendNotification({
    userId: userId,
    type: 'system',
    title: title,
    message: message,
  });
}
