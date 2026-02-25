// Mock Database using localStorage to replace Firebase

export interface MockCollection {
  [key: string]: any;
}

// Helper to get collection from localStorage
const getCollection = (collectionName: string): MockCollection => {
  if (typeof window === 'undefined') return {};
  const data = localStorage.getItem(`casaloop_${collectionName}`);
  return data ? JSON.parse(data) : {};
};

// Helper to save collection to localStorage
const saveCollection = (collectionName: string, data: MockCollection): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(`casaloop_${collectionName}`, JSON.stringify(data));
};

// Generate unique ID
const generateId = (): string => {
  return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

// Mock Firestore API
export const mockDb = {
  // Get a document
  doc: (collectionName: string, docId: string) => ({
    get: async () => {
      const collection = getCollection(collectionName);
      const data = collection[docId];
      return {
        exists: () => !!data,
        data: () => data,
        id: docId
      };
    },
    set: async (data: any, options?: { merge?: boolean }) => {
      const collection = getCollection(collectionName);
      if (options?.merge && collection[docId]) {
        collection[docId] = { ...collection[docId], ...data };
      } else {
        collection[docId] = { ...data, id: docId };
      }
      saveCollection(collectionName, collection);
    },
    update: async (data: any) => {
      const collection = getCollection(collectionName);
      if (collection[docId]) {
        collection[docId] = { ...collection[docId], ...data };
        saveCollection(collectionName, collection);
      }
    },
    delete: async () => {
      const collection = getCollection(collectionName);
      delete collection[docId];
      saveCollection(collectionName, collection);
    }
  }),

  // Add a document to collection
  addDoc: async (collectionName: string, data: any) => {
    const collection = getCollection(collectionName);
    const id = generateId();
    collection[id] = { ...data, id };
    saveCollection(collectionName, collection);
    return { id };
  },

  // Query and subscribe to collection
  onSnapshot: (
    collectionName: string,
    callback: (snapshot: any) => void,
    options?: {
      where?: [string, string, any];
      orderBy?: [string, 'asc' | 'desc'];
    }
  ) => {
    const getData = () => {
      let collection = getCollection(collectionName);
      let docs = Object.values(collection);

      // Apply where filter
      if (options?.where) {
        const [field, operator, value] = options.where;
        docs = docs.filter((doc: any) => {
          if (operator === '==') return doc[field] === value;
          return true;
        });
      }

      // Apply orderBy
      if (options?.orderBy) {
        const [field, direction] = options.orderBy;
        docs.sort((a: any, b: any) => {
          const aVal = a[field] || 0;
          const bVal = b[field] || 0;
          return direction === 'desc' ? bVal - aVal : aVal - bVal;
        });
      }

      return docs;
    };

    // Initial call
    const docs = getData();
    callback(docs);

    // Poll for changes every 500ms
    const interval = setInterval(() => {
      const docs = getData();
      callback(docs);
    }, 500);

    // Return unsubscribe function
    return () => clearInterval(interval);
  },

  // Get all documents in a collection
  getDocs: async (collectionName: string) => {
    const collection = getCollection(collectionName);
    return Object.values(collection);
  }
};

// Initialize with some mock data if empty
export const initializeMockData = () => {
  if (typeof window === 'undefined') return;

  // Check if already initialized
  if (localStorage.getItem('casaloop_initialized')) return;

  console.log('[CasaLoop] Initializing mock data...');

  // Add some sample properties
  const sampleProperties = {
    'prop1': {
      id: 'prop1',
      title: 'Modern 3BR Apartment Downtown',
      price: 5000,
      location: 'New York, NY',
      type: 'rent',
      category: 'apartment',
      status: 'active',
      bedrooms: 3,
      bathrooms: 2,
      area: 1200,
      description: 'Beautiful modern apartment in the heart of downtown. Features include hardwood floors, stainless steel appliances, and stunning city views.',
      imageUrl: '',
      userId: 'demo_user',
      username: 'demo',
      sellerName: 'demo',
      views: 42,
      createdAt: Date.now() - 86400000 * 7
    },
    'prop2': {
      id: 'prop2',
      title: 'Luxury Villa with Pool',
      price: 85000,
      location: 'Miami, FL',
      type: 'sale',
      category: 'house',
      status: 'active',
      bedrooms: 5,
      bathrooms: 4,
      area: 3500,
      description: 'Stunning luxury villa featuring a private pool, spacious garden, and ocean views. Perfect for family living.',
      imageUrl: '',
      userId: 'demo_user2',
      username: 'seller123',
      sellerName: 'seller123',
      views: 128,
      createdAt: Date.now() - 86400000 * 3
    },
    'prop3': {
      id: 'prop3',
      title: 'Commercial Shop Space',
      price: 3500,
      location: 'San Francisco, CA',
      type: 'rent',
      category: 'shop',
      status: 'active',
      bedrooms: 0,
      bathrooms: 1,
      area: 800,
      description: 'Prime retail location in busy shopping district. High foot traffic and excellent visibility.',
      imageUrl: '',
      userId: 'demo_user3',
      username: 'business_owner',
      sellerName: 'business_owner',
      views: 67,
      createdAt: Date.now() - 86400000 * 1
    }
  };

  saveCollection('listings', sampleProperties);
  
  localStorage.setItem('casaloop_initialized', 'true');
  console.log('[CasaLoop] Mock data initialized');
};
