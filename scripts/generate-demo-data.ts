/**
 * Demo Data Generator for CasaLoop Screenshots
 * 
 * Run this script to populate your Firebase with sample data
 * for better App Store screenshots
 * 
 * Usage: node --loader ts-node/esm scripts/generate-demo-data.ts
 */

import { collection, addDoc, doc, setDoc } from "firebase/firestore";
import { db } from "../lib/firebase";

// Sample property data
const sampleProperties = [
  {
    title: "Modern 3BR Apartment in Downtown",
    description: "Stunning modern apartment with city views, hardwood floors, and updated kitchen. Walking distance to shops and restaurants.",
    price: 2500,
    location: "Lagos, Nigeria",
    type: "rent",
    category: "apartment",
    bedrooms: 3,
    bathrooms: 2,
    squareFeet: 1200,
    imageUrl: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800",
    images: [
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800",
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800"
    ],
    amenities: ["Parking", "Wi-Fi", "Security", "Gym"],
    status: "active",
    views: 245,
    createdAt: Date.now() - 86400000 * 2
  },
  {
    title: "Luxury Villa with Pool",
    description: "Exclusive 5-bedroom villa featuring private pool, garden, and modern amenities in a quiet neighborhood.",
    price: 15000,
    location: "Accra, Ghana",
    type: "sale",
    category: "house",
    bedrooms: 5,
    bathrooms: 4,
    squareFeet: 3500,
    imageUrl: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800",
    images: [
      "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800",
      "https://images.unsplash.com/photo-1613977257363-707ba9348227?w=800"
    ],
    amenities: ["Pool", "Garden", "Garage", "Security System"],
    status: "active",
    views: 589,
    createdAt: Date.now() - 86400000 * 5
  },
  {
    title: "Cozy Studio Near University",
    description: "Perfect for students! Furnished studio apartment with kitchenette, close to campus and public transport.",
    price: 800,
    location: "Nairobi, Kenya",
    type: "rent",
    category: "studio",
    bedrooms: 1,
    bathrooms: 1,
    squareFeet: 450,
    imageUrl: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800",
    images: [
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800"
    ],
    amenities: ["Furnished", "Wi-Fi", "Utilities Included"],
    status: "active",
    views: 123,
    createdAt: Date.now() - 86400000
  }
];

// Sample service providers
const sampleServices = [
  {
    title: "Expert Electrician Services",
    category: "electrician",
    description: "Licensed electrician with 10 years experience. Specializing in residential wiring, repairs, and installations.",
    pricePerHour: 25,
    location: "Lagos, Nigeria",
    experience: "10 years",
    availability: "Mon-Sat, 8AM-6PM",
    skills: ["Wiring", "Circuit Installation", "Lighting", "Emergency Repairs"],
    verified: true,
    rating: 4.8,
    reviewCount: 47,
    completedJobs: 156,
    views: 89,
    createdAt: Date.now() - 86400000 * 30
  },
  {
    title: "Professional Plumbing Services",
    category: "plumber",
    description: "Fast, reliable plumbing services. From leaky faucets to full bathroom installations.",
    pricePerHour: 30,
    location: "Accra, Ghana",
    experience: "8 years",
    availability: "24/7 Emergency Service",
    skills: ["Pipe Repair", "Drain Cleaning", "Water Heater", "Bathroom Renovation"],
    verified: true,
    rating: 4.9,
    reviewCount: 63,
    completedJobs: 201,
    views: 134,
    createdAt: Date.now() - 86400000 * 45
  },
  {
    title: "Custom Carpentry & Woodwork",
    category: "carpenter",
    description: "Skilled carpenter creating custom furniture, cabinets, and home improvements.",
    pricePerHour: 20,
    location: "Nairobi, Kenya",
    experience: "12 years",
    availability: "Mon-Fri, 9AM-5PM",
    skills: ["Furniture Making", "Cabinet Installation", "Door Repair", "Custom Woodwork"],
    verified: false,
    rating: 4.7,
    reviewCount: 28,
    completedJobs: 93,
    views: 56,
    createdAt: Date.now() - 86400000 * 20
  }
];

// Sample notifications
const createSampleNotifications = (userId: string) => [
  {
    userId: userId,
    type: "message",
    title: "New message from Sarah K.",
    message: "Hi! I'm interested in viewing the downtown apartment. Is it still available?",
    read: false,
    createdAt: Date.now() - 3600000
  },
  {
    userId: userId,
    type: "payment",
    title: "Payment Received",
    message: "You received 2500 Pi for 'Modern 3BR Apartment'",
    read: false,
    createdAt: Date.now() - 7200000
  },
  {
    userId: userId,
    type: "listing",
    title: "Property Getting Attention",
    message: "Your listing 'Luxury Villa' has reached 500 views!",
    read: true,
    createdAt: Date.now() - 86400000
  },
  {
    userId: userId,
    type: "review",
    title: "New 5-Star Review",
    message: "John D. left a review: 'Excellent service! Very professional and on time.'",
    read: true,
    createdAt: Date.now() - 86400000 * 2
  },
  {
    userId: userId,
    type: "system",
    title: "Welcome to CasaLoop!",
    message: "Complete your profile to start buying, selling, and earning rewards.",
    read: true,
    createdAt: Date.now() - 86400000 * 7
  }
];

async function generateDemoData(userId: string, username: string) {
  console.log("🚀 Generating demo data for screenshots...\n");

  try {
    // 1. Add sample properties
    console.log("📍 Adding sample properties...");
    for (const property of sampleProperties) {
      const propertyData = {
        ...property,
        userId: userId,
        username: username
      };
      
      const docRef = await addDoc(collection(db, "listings"), propertyData);
      console.log(`  ✓ Added property: ${property.title} (ID: ${docRef.id})`);
    }

    // 2. Add sample services
    console.log("\n🔧 Adding sample services...");
    for (const service of sampleServices) {
      const serviceData = {
        ...service,
        userId: userId,
        username: username
      };
      
      const docRef = await addDoc(collection(db, "services"), serviceData);
      console.log(`  ✓ Added service: ${service.title} (ID: ${docRef.id})`);
    }

    // 3. Add sample notifications
    console.log("\n🔔 Adding sample notifications...");
    const notifications = createSampleNotifications(userId);
    for (const notification of notifications) {
      const docRef = await addDoc(collection(db, "notifications"), notification);
      console.log(`  ✓ Added notification: ${notification.title}`);
    }

    // 4. Update user profile with demo stats
    console.log("\n👤 Updating user profile...");
    await setDoc(doc(db, "users", userId), {
      uid: userId,
      username: username,
      casaPoints: 156.8,
      currentStreak: 7,
      longestStreak: 12,
      lastCheckIn: Date.now(),
      totalCheckIns: 25,
      spinAvailable: true,
      createdAt: Date.now() - 86400000 * 30
    }, { merge: true });
    console.log("  ✓ Profile updated with demo stats");

    console.log("\n✅ Demo data generation complete!");
    console.log("\n📸 You can now take screenshots with realistic data.");
    console.log("💡 Tip: Refresh the app to see all changes.");

  } catch (error) {
    console.error("❌ Error generating demo data:", error);
  }
}

// Instructions for running
console.log(`
╔════════════════════════════════════════════════════════════╗
║        CasaLoop Demo Data Generator for Screenshots        ║
╚════════════════════════════════════════════════════════════╝

To generate demo data:

1. Make sure Firebase is configured in lib/firebase.ts
2. Get your user ID from the app (check browser console after login)
3. Run this function with your user ID:

   generateDemoData("your-user-id", "your-username");

4. Refresh your app to see the demo data
5. Take screenshots following SCREENSHOTS_GUIDE.md

Note: This will add sample properties, services, and notifications
to your Firebase database.
`);

export { generateDemoData };
