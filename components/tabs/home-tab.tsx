"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { MapPin, Bed, Bath, Maximize, Home, X, Search, Loader2, Heart, Eye, SlidersHorizontal, ChevronDown, ChevronUp } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { collection, query, orderBy, onSnapshot, addDoc, doc, getDoc, updateDoc, where, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { Property, Reservation } from "@/lib/casaloop-types";
import { usePiAuth } from "@/hooks/use-pi-auth";
import { PRODUCT_CONFIG } from "@/lib/product-config";
import { useToast } from "@/hooks/use-toast";
import { PropertyDetailDialog } from "@/components/property-detail-dialog";
import { PropertyReviews } from "@/components/property-reviews";
import { WelcomeBanner } from "@/components/welcome-banner";
import { PropertyGridSkeleton } from "@/components/skeleton-loader";

interface HomeTabProps {
  user: { uid: string; username: string };
}

// Helper function to get category display with icon
const getCategoryDisplay = (category: string) => {
  const categories = {
    house: { icon: '🏠', label: 'House' },
    apartment: { icon: '🏢', label: 'Apartment' },
    land: { icon: '🌳', label: 'Land' },
    shop: { icon: '🏪', label: 'Shop' }
  };
  return categories[category as keyof typeof categories] || { icon: '🏠', label: 'House' };
};

export function HomeTab({ user }: HomeTabProps) {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [typeFilter, setTypeFilter] = useState<'all' | 'sale' | 'rent'>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'price-low' | 'price-high' | 'popular'>('newest');
  
  // Advanced filter states
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'house' | 'apartment' | 'land' | 'shop'>('all');
  const [minPrice, setMinPrice] = useState<string>("");
  const [maxPrice, setMaxPrice] = useState<string>("");
  const [minBedrooms, setMinBedrooms] = useState<string>("");
  const [minBathrooms, setMinBathrooms] = useState<string>("");
  const [showFilters, setShowFilters] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);
  const [isNewUser, setIsNewUser] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;
  
  const { products } = usePiAuth();
  const { toast } = useToast();

  // Load user favorites and check if new user
  useEffect(() => {
    const loadFavorites = async () => {
      try {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setFavorites(userData.favorites || []);
          console.log("[v0] Loaded favorites:", userData.favorites?.length || 0);
          
          // Check if user created account in last 5 minutes (new user)
          const accountAge = Date.now() - userData.createdAt;
          const isFreshAccount = accountAge < 5 * 60 * 1000; // 5 minutes
          
          if (isFreshAccount) {
            console.log("[v0] New user detected - showing welcome banner");
            setIsNewUser(true);
            setShowWelcome(true);
          }
        }
      } catch (error) {
        console.error("[v0] Error loading favorites:", error);
      }
    };
    
    loadFavorites();
  }, [user.uid]);

  // Increment property views
  const incrementViews = async (propertyId: string) => {
    try {
      const propertyRef = doc(db, "listings", propertyId);
      const propertyDoc = await getDoc(propertyRef);
      
      if (propertyDoc.exists()) {
        const currentViews = propertyDoc.data().views || 0;
        await updateDoc(propertyRef, {
          views: currentViews + 1
        });
        console.log("[v0] Property view incremented:", propertyId);
      }
    } catch (error) {
      console.error("[v0] Error incrementing views:", error);
    }
  };

  // Toggle favorite
  const toggleFavorite = async (propertyId: string) => {
    const isFavorited = favorites.includes(propertyId);
    const newFavorites = isFavorited
      ? favorites.filter(id => id !== propertyId)
      : [...favorites, propertyId];
    
    console.log("[v0] Toggling favorite:", propertyId, isFavorited ? "removing" : "adding");
    
    // Optimistic update
    setFavorites(newFavorites);
    
    // Save to Firestore
    try {
      await updateDoc(doc(db, "users", user.uid), {
        favorites: newFavorites
      });
    } catch (error) {
      console.error("[v0] Error updating favorites:", error);
      // Revert on error
      setFavorites(favorites);
      toast({
        title: "Error",
        description: "Failed to update favorites. Please try again.",
        variant: "destructive"
      });
    }
  };

  // Payment handler for property reservation
  const handlePayment = () => {
    if (!selectedProperty) return;

    // Find the product
    const product = products.find(p => p.id === PRODUCT_CONFIG.PRODUCT_69775a665c9cf7437b8113c9);

    if (!product) {
      toast({
        title: "Product not available",
        description: "The reservation product is not available at this time.",
        variant: "destructive"
      });
      return;
    }

    const amount = product.price_in_pi;

    console.log("[v0] Initiating payment for property:", selectedProperty.title);
    setIsProcessingPayment(true);

    // Call window.pay
    if (typeof window !== "undefined" && window.pay) {
      window.pay({
        amount,
        memo: `${product.name} - ${selectedProperty.title}`,
        metadata: {
          productId: product.id,
          propertyId: selectedProperty.id,
          propertyTitle: selectedProperty.title
        },
        onComplete: async (payment) => {
          console.log("[v0] Payment completed:", payment);
          
          // Save reservation to Firestore
          try {
            const reservation: Omit<Reservation, 'id'> = {
              userId: user.uid,
              username: user.username,
              propertyId: selectedProperty.id,
              propertyTitle: selectedProperty.title,
              propertyPrice: selectedProperty.price,
              propertyLocation: selectedProperty.location,
              reservationDate: Date.now(),
              status: 'reserved',
              paymentId: payment.txid
            };
            
            await addDoc(collection(db, "reservations"), reservation);
            console.log("[v0] Reservation saved to Firestore");
          } catch (error) {
            console.error("[v0] Error saving reservation:", error);
          }
          
          setIsProcessingPayment(false);
          toast({
            title: "Reservation Successful!",
            description: `You have successfully reserved ${selectedProperty.title}. The agent will contact you soon.`,
          });
          setSelectedProperty(null);
        },
        onError: (error) => {
          console.error("[v0] Payment error:", error);
          setIsProcessingPayment(false);
          toast({
            title: "Payment Failed",
            description: "There was an error processing your payment. Please try again.",
            variant: "destructive"
          });
        }
      });
    } else {
      console.error("[v0] window.pay is not available");
      setIsProcessingPayment(false);
      toast({
        title: "Payment unavailable",
        description: "Payment system is not available. Please try again later.",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    try {
      const q = query(collection(db, "listings"), orderBy("createdAt", "desc"));
      
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const propertiesData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Property[];
        
        setProperties(propertiesData);
        setLoading(false);
      }, (error) => {
        console.error("[CasaLoop] Error fetching listings:", error);
        setLoading(false);
      });

      return () => unsubscribe();
    } catch (error) {
      console.error("[CasaLoop] Error initializing Firestore listener:", error);
      setLoading(false);
    }
  }, []);

  // Filter properties based on all filters
  const filteredProperties = properties.filter((property) => {
    // Apply favorites filter first
    if (showFavoritesOnly && !favorites.includes(property.id)) {
      return false;
    }
    
    // Apply type filter
    if (typeFilter !== 'all' && property.type !== typeFilter) {
      return false;
    }
    
    // Apply category filter
    if (categoryFilter !== 'all' && property.category !== categoryFilter) {
      return false;
    }
    
    // Apply price filters
    if (minPrice && property.price < Number(minPrice)) {
      return false;
    }
    if (maxPrice && property.price > Number(maxPrice)) {
      return false;
    }
    
    // Apply bedroom filter
    if (minBedrooms && property.bedrooms < Number(minBedrooms)) {
      return false;
    }
    
    // Apply bathroom filter
    if (minBathrooms && property.bathrooms < Number(minBathrooms)) {
      return false;
    }
    
    // Apply search filter
    if (!searchQuery.trim()) return true;
    
    const query = searchQuery.toLowerCase();
    const titleMatch = property.title.toLowerCase().includes(query);
    const locationMatch = property.location.toLowerCase().includes(query);
    const descriptionMatch = property.description.toLowerCase().includes(query);
    
    return titleMatch || locationMatch || descriptionMatch;
  });

  // Sort properties based on selected sort option
  const sortedProperties = [...filteredProperties].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'popular':
        return (b.views || 0) - (a.views || 0);
      case 'newest':
      default:
        return b.createdAt - a.createdAt;
    }
  });

  // Pagination
  const totalPages = Math.ceil(sortedProperties.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedProperties = sortedProperties.slice(startIndex, endIndex);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, typeFilter, categoryFilter, sortBy, showFavoritesOnly, minPrice, maxPrice, minBedrooms, minBathrooms]);

  // Start a conversation with property owner
  const startConversation = async (property: Property) => {
    if (!selectedProperty) return;
    
    try {
      // Check if conversation already exists
      const conversationsQuery = query(
        collection(db, "conversations"),
        where("participants", "array-contains", user.uid)
      );
      const conversationsSnapshot = await getDocs(conversationsQuery);
      
      let existingConversation: any = null;
      conversationsSnapshot.forEach((doc) => {
        const data = doc.data();
        if (data.participants.includes(property.userId) && data.propertyId === property.id) {
          existingConversation = { id: doc.id, ...data };
        }
      });

      if (!existingConversation) {
        // Create new conversation
        await addDoc(collection(db, "conversations"), {
          participants: [user.uid, property.userId],
          participantNames: [user.username, property.username],
          lastMessage: "Interested in your property",
          lastMessageTime: Date.now(),
          propertyId: property.id,
          propertyTitle: property.title,
          unreadCount: {
            [user.uid]: 0,
            [property.userId]: 1
          }
        });
      }

      toast({
        title: "Message Sent",
        description: "Your inquiry has been sent to the seller. Check Messages tab."
      });
      setSelectedProperty(null);
    } catch (error) {
      console.error("Error starting conversation:", error);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return <PropertyGridSkeleton />;
  }

  if (properties.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-6">
        <div className="text-center space-y-3">
          <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
            <MapPin className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold text-foreground">
            No Properties Yet
          </h3>
          <p className="text-muted-foreground max-w-sm">
            Be the first to list a property on CasaLoop
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-24">
      {/* Welcome Banner for New Users */}
      {showWelcome && (
        <WelcomeBanner
          username={user.username}
          isNewUser={isNewUser}
          onDismiss={() => setShowWelcome(false)}
        />
      )}

      {/* Welcome Header */}
      <div className="px-4 pt-4 pb-2">
        <h1 className="text-2xl font-bold text-foreground">
          Welcome, <span className="text-primary">@{user.username}</span>!
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Discover your dream property on Pi Network
        </p>
      </div>

      {/* Sticky Search Bar */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b border-border px-4 py-4 space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-primary" />
          <Input
            type="text"
            placeholder="Search by city or property name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-card border-primary/30 focus:border-primary text-foreground placeholder:text-muted-foreground h-12"
          />
        </div>
        
        {/* Filter Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Type Filter Buttons */}
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setTypeFilter('all')}
              className={`font-medium transition-all ${
                typeFilter === 'all'
                  ? 'bg-muted text-foreground border-foreground/30'
                  : 'border-border/50 hover:border-foreground/30 hover:bg-muted/50'
              }`}
            >
              All
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setTypeFilter('sale')}
              className={`font-medium transition-all ${
                typeFilter === 'sale'
                  ? 'bg-primary text-primary-foreground border-primary hover:bg-primary/90'
                  : 'border-border/50 hover:border-primary/50 hover:bg-primary/10'
              }`}
            >
              For Sale
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setTypeFilter('rent')}
              className={`font-medium transition-all ${
                typeFilter === 'rent'
                  ? 'bg-green-500 text-white border-green-500 hover:bg-green-600'
                  : 'border-border/50 hover:border-green-500/50 hover:bg-green-500/10'
              }`}
            >
              For Rent
            </Button>
          </div>

          {/* Favorites Filter Button */}
          <Button
            variant={showFavoritesOnly ? "default" : "outline"}
            size="sm"
            onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
            className={`gap-2 ${showFavoritesOnly ? 'bg-primary text-primary-foreground' : 'border-primary/30 hover:border-primary hover:bg-primary/5'}`}
          >
            <Heart className={`h-4 w-4 ${showFavoritesOnly ? 'fill-current' : ''}`} />
            Favorites {showFavoritesOnly && `(${favorites.length})`}
          </Button>

          {/* Sort By Dropdown */}
          <div className="ml-auto flex items-center gap-2">
            <span className="text-sm text-muted-foreground font-medium">Sort By:</span>
            <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
              <SelectTrigger className="w-[180px] bg-card border-primary/30 text-primary font-medium h-9">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-card border-primary/30">
                <SelectItem value="newest" className="text-primary font-medium focus:bg-primary/10 focus:text-primary">
                  Newest
                </SelectItem>
                <SelectItem value="price-low" className="text-primary font-medium focus:bg-primary/10 focus:text-primary">
                  Price: Low to High
                </SelectItem>
                <SelectItem value="price-high" className="text-primary font-medium focus:bg-primary/10 focus:text-primary">
                  Price: High to Low
                </SelectItem>
                <SelectItem value="popular" className="text-primary font-medium focus:bg-primary/10 focus:text-primary">
                  Most Popular
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        {/* Advanced Filters Toggle */}
        <div className="px-4 pb-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
            className="w-full gap-2 border-border/50 hover:border-primary/50 hover:bg-primary/5"
          >
            <SlidersHorizontal className="h-4 w-4" />
            Advanced Filters
            {showFilters ? <ChevronUp className="h-4 w-4 ml-auto" /> : <ChevronDown className="h-4 w-4 ml-auto" />}
          </Button>
        </div>
        
        {/* Advanced Filters Panel */}
        {showFilters && (
          <div className="px-4 pb-3 space-y-3 border-b border-border">
            {/* Category Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Property Type</label>
              <div className="grid grid-cols-2 gap-2">
                {(['all', 'house', 'apartment', 'land', 'shop'] as const).map((cat) => (
                  <Button
                    key={cat}
                    variant="outline"
                    size="sm"
                    onClick={() => setCategoryFilter(cat)}
                    className={`${
                      categoryFilter === cat
                        ? 'bg-primary text-primary-foreground border-primary'
                        : 'border-border/50 hover:border-primary/50'
                    }`}
                  >
                    {cat === 'all' ? 'All Types' : cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </Button>
                ))}
              </div>
            </div>
            
            {/* Price Range */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Price Range (Pi)</label>
              <div className="grid grid-cols-2 gap-2">
                <Input
                  type="number"
                  placeholder="Min"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  className="border-border/50"
                />
                <Input
                  type="number"
                  placeholder="Max"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  className="border-border/50"
                />
              </div>
            </div>
            
            {/* Bedrooms & Bathrooms */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Min Bedrooms</label>
                <Select value={minBedrooms || "0"} onValueChange={setMinBedrooms}>
                  <SelectTrigger className="border-border/50">
                    <SelectValue placeholder="Any" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">Any</SelectItem>
                    <SelectItem value="1">1+</SelectItem>
                    <SelectItem value="2">2+</SelectItem>
                    <SelectItem value="3">3+</SelectItem>
                    <SelectItem value="4">4+</SelectItem>
                    <SelectItem value="5">5+</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Min Bathrooms</label>
                <Select value={minBathrooms || "0"} onValueChange={setMinBathrooms}>
                  <SelectTrigger className="border-border/50">
                    <SelectValue placeholder="Any" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">Any</SelectItem>
                    <SelectItem value="1">1+</SelectItem>
                    <SelectItem value="2">2+</SelectItem>
                    <SelectItem value="3">3+</SelectItem>
                    <SelectItem value="4">4+</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            {/* Clear Filters Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setCategoryFilter('all');
                setMinPrice('');
                setMaxPrice('');
                setMinBedrooms('');
                setMinBathrooms('');
              }}
              className="w-full text-muted-foreground hover:text-foreground"
            >
              Clear All Filters
            </Button>
          </div>
        )}
      </div>

      <div className="p-4 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-foreground">
            {searchQuery ? 'Search Results' : 'Available Properties'}
          </h2>
          <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
            {sortedProperties.length} {searchQuery ? 'Found' : 'Listings'}
          </Badge>
        </div>

        {sortedProperties.length === 0 && (searchQuery || showFavoritesOnly) && (
          <div className="flex flex-col items-center justify-center py-20 px-6">
            <div className="text-center space-y-3">
              <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                {showFavoritesOnly ? (
                  <Heart className="h-8 w-8 text-muted-foreground" />
                ) : (
                  <Search className="h-8 w-8 text-muted-foreground" />
                )}
              </div>
              <h3 className="text-lg font-semibold text-foreground">
                {showFavoritesOnly ? 'No favorites yet' : 'No properties found'}
              </h3>
              <p className="text-muted-foreground max-w-sm">
                {showFavoritesOnly 
                  ? 'Start adding properties to your favorites by clicking the heart icon'
                  : 'Try searching with a different city or property name'
                }
              </p>
            </div>
          </div>
        )}

        {paginatedProperties.map((property) => (
          <Card 
            key={property.id} 
            className="overflow-hidden border-border bg-card shadow-sm hover:shadow-md transition-all cursor-pointer hover:scale-[1.01]"
            onClick={() => {
              setSelectedProperty(property);
              incrementViews(property.id);
            }}
          >
            {/* Image Section - Instagram Style */}
            <div className="relative w-full aspect-[4/3] bg-gradient-to-br from-muted to-muted/50 overflow-hidden">
              {property.imageUrl ? (
                <img
                  src={property.imageUrl || "/placeholder.svg"}
                  alt={property.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    // Fallback if image fails to load
                    e.currentTarget.style.display = 'none';
                    if (e.currentTarget.nextElementSibling) {
                      (e.currentTarget.nextElementSibling as HTMLElement).style.display = 'flex';
                    }
                  }}
                />
              ) : null}
              {!property.imageUrl && (
                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-muted via-muted/80 to-background/50">
                  <Home className="h-20 w-20 text-primary/40" strokeWidth={1.5} />
                </div>
              )}
              {property.imageUrl && (
                <div className="absolute inset-0 hidden items-center justify-center bg-gradient-to-br from-muted via-muted/80 to-background/50">
                  <Home className="h-20 w-20 text-primary/40" strokeWidth={1.5} />
                </div>
              )}
              <Badge 
                className={`absolute top-3 left-3 shadow-lg font-bold text-xs tracking-wide ${
                  property.status === 'inactive'
                    ? "bg-gray-600 text-white"
                    : property.type === "sale" 
                      ? "bg-primary text-primary-foreground" 
                      : "bg-green-500 text-white"
                }`}
              >
                {property.status === 'inactive' 
                  ? (property.type === "sale" ? "SOLD" : "RENTED")
                  : (property.type === "sale" ? "SALE" : "RENT")
                }
              </Badge>
              
              {/* Heart/Favorite Button */}
              <Button
                variant="ghost"
                size="icon"
                className={`absolute top-3 right-3 h-10 w-10 rounded-full shadow-lg backdrop-blur-sm transition-all ${
                  favorites.includes(property.id)
                    ? 'bg-primary/90 hover:bg-primary text-primary-foreground'
                    : 'bg-background/80 hover:bg-background text-foreground'
                }`}
                onClick={(e) => {
                  e.stopPropagation();
                  toggleFavorite(property.id);
                }}
              >
                <Heart
                  className={`h-5 w-5 transition-all ${
                    favorites.includes(property.id)
                      ? 'fill-current text-primary-foreground'
                      : 'text-foreground'
                  }`}
                />
              </Button>
            </div>
            
            {/* Details Section - Instagram Style */}
            <CardContent className="p-4 space-y-3">
              {/* Price - Most Prominent */}
              <div className="flex items-baseline gap-2">
                {property.status === 'inactive' ? (
                  <p className="text-2xl font-bold text-muted-foreground tracking-tight">
                    OFF MARKET
                  </p>
                ) : (
                  <>
                    <p className="text-3xl font-bold text-primary tracking-tight">
                      π {property.price.toLocaleString()}
                    </p>
                    {property.type === "rent" && (
                      <span className="text-base text-muted-foreground font-medium">/month</span>
                    )}
                  </>
                )}
              </div>

              {/* Title and Location */}
              <div>
                <h3 className="font-bold text-lg text-foreground leading-tight mb-1.5">
                  {property.title}
                </h3>
                {property.category && (
                  <p className="text-xs text-muted-foreground mb-1.5">
                    {getCategoryDisplay(property.category).icon} {getCategoryDisplay(property.category).label}
                  </p>
                )}
                <div className="flex items-center gap-1.5 text-muted-foreground mb-1">
                  <MapPin className="h-4 w-4 flex-shrink-0" />
                  <span className="text-sm">{property.location}</span>
                </div>
                <p className="text-xs text-primary font-medium">
                  Listed by @{property.sellerName || property.username}
                </p>
              </div>

              {/* Property Stats */}
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1.5 text-foreground">
                  <Bed className="h-4 w-4 text-primary" />
                  <span className="font-medium">{property.bedrooms}</span>
                </div>
                <div className="flex items-center gap-1.5 text-foreground">
                  <Bath className="h-4 w-4 text-primary" />
                  <span className="font-medium">{property.bathrooms}</span>
                </div>
                <div className="flex items-center gap-1.5 text-foreground">
                  <Maximize className="h-4 w-4 text-primary" />
                  <span className="font-medium">{property.area} m²</span>
                </div>
              </div>

              {/* Description */}
              {property.description && (
                <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                  {property.description}
                </p>
              )}

              {/* Footer - Listed By and Views */}
              <div className="pt-3 border-t border-border flex items-center justify-between">
                <p className="text-xs text-muted-foreground">
                  Listed by <span className="text-foreground font-medium">@{property.username}</span>
                </p>
                <div className="flex items-center gap-1 text-xs text-muted-foreground font-bold">
                  <Eye className="h-3.5 w-3.5" />
                  <span>{property.views || 0} Views</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 py-6">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            
            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => {
                // Show first, last, current, and adjacent pages
                if (
                  page === 1 ||
                  page === totalPages ||
                  Math.abs(page - currentPage) <= 1
                ) {
                  return (
                    <Button
                      key={page}
                      variant={page === currentPage ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCurrentPage(page)}
                      className="min-w-[40px]"
                    >
                      {page}
                    </Button>
                  );
                } else if (
                  page === currentPage - 2 ||
                  page === currentPage + 2
                ) {
                  return <span key={page} className="text-muted-foreground px-2">...</span>;
                }
                return null;
              })}
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        )}
      </div>

      {/* Property Details Modal */}
      <Dialog open={!!selectedProperty} onOpenChange={(open) => !open && setSelectedProperty(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto p-0">
          {selectedProperty && (
            <>
              {/* Full Width Image */}
              <div className="relative w-full aspect-[16/9] bg-gradient-to-br from-muted to-muted/50 overflow-hidden">
                {selectedProperty.imageUrl ? (
                  <img
                    src={selectedProperty.imageUrl || "/placeholder.svg"}
                    alt={selectedProperty.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      if (e.currentTarget.nextElementSibling) {
                        (e.currentTarget.nextElementSibling as HTMLElement).style.display = 'flex';
                      }
                    }}
                  />
                ) : null}
                {!selectedProperty.imageUrl && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-muted via-muted/80 to-background/50">
                    <Home className="h-24 w-24 text-primary/40" strokeWidth={1.5} />
                  </div>
                )}
                {selectedProperty.imageUrl && (
                  <div className="absolute inset-0 hidden items-center justify-center bg-gradient-to-br from-muted via-muted/80 to-background/50">
                    <Home className="h-24 w-24 text-primary/40" strokeWidth={1.5} />
                  </div>
                )}
                <Badge 
                  className={`absolute top-4 left-4 shadow-lg font-bold text-base px-3 py-1 tracking-wide ${
                    selectedProperty.status === 'inactive'
                      ? "bg-gray-600 text-white"
                      : selectedProperty.type === 'sale'
                        ? "bg-primary text-primary-foreground"
                        : "bg-green-500 text-white"
                  }`}
                >
                  {selectedProperty.status === 'inactive'
                    ? (selectedProperty.type === 'sale' ? 'SOLD' : 'RENTED')
                    : (selectedProperty.type === 'sale' ? 'SALE' : 'RENT')
                  }
                </Badge>
              </div>

              {/* Property Details */}
              <div className="p-6 space-y-4">
                {/* Price */}
                <div className="flex items-baseline gap-2">
                  {selectedProperty.status === 'inactive' ? (
                    <p className="text-3xl font-bold text-muted-foreground tracking-tight">
                      OFF MARKET
                    </p>
                  ) : (
                    <>
                      <p className="text-4xl font-bold text-primary tracking-tight">
                        π {selectedProperty.price.toLocaleString()}
                      </p>
                      {selectedProperty.type === "rent" && (
                        <span className="text-lg text-muted-foreground font-medium">/month</span>
                      )}
                    </>
                  )}
                </div>

                {/* Title */}
                <DialogHeader>
                  <DialogTitle className="text-2xl font-bold text-foreground leading-tight">
                    {selectedProperty.title}
                  </DialogTitle>
                  <DialogDescription className="space-y-1 pt-1">
                    {selectedProperty.category && (
                      <p className="text-sm text-muted-foreground">
                        {getCategoryDisplay(selectedProperty.category).icon} {getCategoryDisplay(selectedProperty.category).label}
                      </p>
                    )}
                    <div className="flex items-center gap-2 text-base">
                      <MapPin className="h-5 w-5 text-primary" />
                      <span className="text-foreground">{selectedProperty.location}</span>
                    </div>
                    <p className="text-sm text-primary font-medium">
                      Listed by @{selectedProperty.sellerName || selectedProperty.username}
                    </p>
                  </DialogDescription>
                </DialogHeader>

                {/* Property Stats */}
                <div className="flex items-center gap-6 py-4 border-y border-border">
                  <div className="flex items-center gap-2">
                    <Bed className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-2xl font-bold text-foreground">{selectedProperty.bedrooms}</p>
                      <p className="text-xs text-muted-foreground">Bedrooms</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Bath className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-2xl font-bold text-foreground">{selectedProperty.bathrooms}</p>
                      <p className="text-xs text-muted-foreground">Bathrooms</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Maximize className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-2xl font-bold text-foreground">{selectedProperty.area}</p>
                      <p className="text-xs text-muted-foreground">m²</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Eye className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-2xl font-bold text-muted-foreground">{selectedProperty.views || 0}</p>
                      <p className="text-xs text-muted-foreground font-bold">Views</p>
                    </div>
                  </div>
                </div>

                {/* Full Description */}
                <div>
                  <h4 className="font-semibold text-foreground mb-2">Description</h4>
                  <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                    {selectedProperty.description || "No description provided."}
                  </p>
                </div>

                {/* Listed By */}
                <div className="pt-2">
                  <p className="text-sm text-muted-foreground">
                    Listed by <span className="text-foreground font-semibold">@{selectedProperty.username}</span>
                  </p>
                </div>

                {/* Action Buttons */}
                <DialogFooter className="pt-4 flex-col sm:flex-row gap-3">
                  {selectedProperty.status === 'inactive' ? (
                    <div className="w-full text-center py-6 bg-muted rounded-lg">
                      <p className="text-muted-foreground font-medium">
                        This property is no longer available
                      </p>
                    </div>
                  ) : (
                    <>
                      <Button 
                        variant="outline"
                        className="flex-1 font-semibold text-base py-6 border-primary/30 hover:bg-primary/10 hover:border-primary bg-transparent"
                        onClick={() => {
                          toast({
                            title: "Agent Notified",
                            description: "The property agent has been notified of your interest."
                          });
                          setSelectedProperty(null);
                        }}
                      >
                        Contact Agent
                      </Button>
                      <Button 
                        className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-base py-6 gap-2"
                        onClick={handlePayment}
                        disabled={isProcessingPayment || !products.find(p => p.id === PRODUCT_CONFIG.PRODUCT_69775a665c9cf7437b8113c9)}
                      >
                        {isProcessingPayment ? (
                          <>
                            <Loader2 className="h-5 w-5 animate-spin" />
                            Processing...
                          </>
                        ) : (
                          <>
                            Reserve Property (π {products.find(p => p.id === PRODUCT_CONFIG.PRODUCT_69775a665c9cf7437b8113c9)?.price_in_pi || '0.01'})
                          </>
                        )}
                      </Button>
                    </>
                  )}
                </DialogFooter>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
