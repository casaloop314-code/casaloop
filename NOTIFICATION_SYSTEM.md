# CasaLoop Notification System

Modern, real-time notification center for CasaLoop users.

## Features

- Real-time notifications using Firestore listeners
- Unread count badge with animation
- 6 notification types with custom icons
- Slide-in sheet panel from right side
- Mark as read / Mark all as read functionality
- Time-relative formatting (2m ago, 3h ago, etc.)
- Automatic updates without refresh

## Notification Types

| Type | Icon | Color | Example Use Case |
|------|------|-------|------------------|
| `message` | MessageCircle | Blue | New chat message received |
| `payment` | Coins | Gold | Pi payment received |
| `listing` | Home | Green | Property view milestone reached |
| `service` | Wrench | Purple | Service booking confirmed |
| `review` | TrendingUp | Orange | New review posted |
| `system` | Bell | Gray | Platform announcements |

## Usage

### Sending Notifications

Use the helper functions in `/lib/send-notification.ts`:

```typescript
import { notifyNewMessage, notifyPaymentReceived } from "@/lib/send-notification";

// Notify user of new message
await notifyNewMessage(
  recipientUserId,
  "John Doe",
  "Hi! Is the property still available?"
);

// Notify payment received
await notifyPaymentReceived(
  sellerId,
  2500, // amount in Pi
  "Modern 3BR Apartment"
);
```

### Custom Notifications

```typescript
import { sendNotification } from "@/lib/send-notification";

await sendNotification({
  userId: "user-id-here",
  type: "system",
  title: "Welcome!",
  message: "Thanks for joining CasaLoop",
  metadata: { campaign: "onboarding" }
});
```

## Integration Points

The notification system is already integrated into:

1. **Header** - Bell icon with unread badge
2. **Firebase** - Real-time listener in notification center component
3. **Helper Functions** - Pre-built notification senders

### Where to Add Notification Triggers

Add notification calls in these locations:

**Messages** (`/components/tabs/messages-tab.tsx`):
```typescript
// When sending a message
await notifyNewMessage(recipientId, senderName, messageText);
```

**Payments** (Payment completion handler):
```typescript
// After payment verification
await notifyPaymentReceived(sellerId, amount, propertyTitle);
```

**Property Views** (`/components/tabs/home-tab.tsx`):
```typescript
// When view count hits milestones (100, 500, 1000)
if (newViewCount % 100 === 0) {
  await notifyPropertyView(ownerId, propertyTitle, newViewCount);
}
```

**Reviews** (After review submission):
```typescript
await notifyNewReview(providerId, rating, reviewerName, itemTitle);
```

## Firebase Data Structure

### Notifications Collection

```
notifications/
  {notificationId}/
    - userId: string           // Recipient user ID
    - type: string             // Notification type
    - title: string            // Notification title
    - message: string          // Notification message
    - read: boolean            // Read status
    - createdAt: number        // Timestamp
    - actionUrl?: string       // Optional link
    - metadata?: object        // Optional extra data
```

### Example Document

```json
{
  "userId": "pi-user-123",
  "type": "payment",
  "title": "Payment Received",
  "message": "You received 2500 Pi for 'Modern 3BR Apartment'",
  "read": false,
  "createdAt": 1704835200000,
  "metadata": {
    "paymentId": "pay_abc123",
    "amount": 2500,
    "propertyId": "prop_xyz789"
  }
}
```

## Firestore Security Rules

Already included in `/firestore.rules`:

```
match /notifications/{notificationId} {
  // Users can read their own notifications
  allow read: if request.auth.uid == resource.data.userId;
  
  // Users can update their own notifications (mark as read)
  allow update: if request.auth.uid == resource.data.userId;
  
  // Only system can create notifications (via Cloud Functions ideally)
  allow create: if request.auth != null;
  
  // Users cannot delete notifications
  allow delete: if false;
}
```

## UI Components

### NotificationCenter Component

Location: `/components/notification-center.tsx`

**Props:**
- `user` - Current user object with uid and username

**Features:**
- Automatically subscribes to user's notifications
- Shows unread count badge
- Smooth slide-in animation
- Skeleton loading states
- Empty state when no notifications

### Visual States

1. **Default** - Bell icon in header
2. **Unread** - Red badge with count (max shows "9+")
3. **Open** - Sheet slides from right with notification list
4. **Empty** - Shows empty state illustration
5. **Loading** - Skeleton placeholders while loading

## Customization

### Change Badge Color

Edit `/components/notification-center.tsx`:

```typescript
<Badge 
  variant="destructive"  // Change to "default" or custom
  className="..."
>
```

### Change Sheet Width

```typescript
<SheetContent side="right" className="w-full sm:max-w-md"> 
  {/* Change sm:max-w-md to sm:max-w-lg for wider panel */}
</SheetContent>
```

### Add Click Actions

Extend notification interface with `actionUrl`:

```typescript
interface Notification {
  // ... existing fields
  actionUrl?: string;
}

// In notification card onClick:
onClick={() => {
  markAsRead(notification.id);
  if (notification.actionUrl) {
    window.location.href = notification.actionUrl;
  }
}}
```

## Performance

- Uses Firestore query with `limit(50)` to avoid loading too many
- Only subscribes when component mounts
- Unsubscribes on unmount to prevent memory leaks
- Real-time updates without polling

## Testing

### Test Notifications Manually

1. Open Firebase Console
2. Go to Firestore Database
3. Create notification document:

```json
{
  "userId": "your-user-id",
  "type": "message",
  "title": "Test Notification",
  "message": "This is a test message",
  "read": false,
  "createdAt": 1704835200000
}
```

4. Should appear instantly in app

### Generate Demo Notifications

Use the demo data generator:

```typescript
import { generateDemoData } from "./scripts/generate-demo-data";
await generateDemoData("your-user-id", "your-username");
```

This creates 5 sample notifications with different types.

## Screenshots

For App Store screenshots showing notifications:

1. Generate demo notifications (see above)
2. Click bell icon to open notification panel
3. Ensure 3-5 notifications visible with mix of read/unread
4. Take screenshot with panel open
5. Shows modern, professional notification UI

## Troubleshooting

### Notifications Not Appearing

- Check Firebase connection in browser console
- Verify user ID matches notification userId
- Check Firestore rules allow read access
- Ensure real-time listener is active

### Badge Not Updating

- Check unread count calculation
- Verify `read` field is boolean, not string
- Ensure Firestore listener is subscribed

### Performance Issues

- Limit notifications loaded with `.limit()`
- Add indexes for common queries
- Paginate old notifications

## Future Enhancements

Potential improvements:

1. Push notifications (browser/mobile)
2. Email notification digest
3. Notification preferences/settings
4. Archive old notifications
5. Rich media (images in notifications)
6. Action buttons (Accept/Decline)
7. Notification sound effects
8. Group similar notifications

## Related Files

- `/components/notification-center.tsx` - Main component
- `/lib/send-notification.ts` - Helper functions
- `/app/page.tsx` - Header integration
- `/firestore.rules` - Security rules
- `/SCREENSHOTS_GUIDE.md` - Screenshot instructions
