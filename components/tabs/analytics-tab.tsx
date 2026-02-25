"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Eye, Heart, MessageCircle, TrendingUp, Home } from "lucide-react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { Property } from "@/lib/casaloop-types";

interface AnalyticsTabProps {
  user: { uid: string; username: string };
}

interface PropertyStats {
  property: Property;
  views: number;
  favorites: number;
  inquiries: number;
}

export function AnalyticsTab({ user }: AnalyticsTabProps) {
  const [properties, setProperties] = useState<Property[]>([]);
  const [stats, setStats] = useState<PropertyStats[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalytics();
  }, [user.uid]);

  const loadAnalytics = async () => {
    try {
      // Load user's properties
      const propertiesQuery = query(
        collection(db, "listings"),
        where("userId", "==", user.uid)
      );
      const propertiesSnapshot = await getDocs(propertiesQuery);
      const propertiesData: Property[] = [];
      propertiesSnapshot.forEach((doc) => {
        propertiesData.push({
          id: doc.id,
          ...doc.data()
        } as Property);
      });
      setProperties(propertiesData);

      // Calculate stats for each property
      const propertyStats: PropertyStats[] = [];

      for (const property of propertiesData) {
        // Count favorites
        const usersQuery = query(collection(db, "users"));
        const usersSnapshot = await getDocs(usersQuery);
        let favoriteCount = 0;
        usersSnapshot.forEach((doc) => {
          const userData = doc.data();
          if (userData.favorites && userData.favorites.includes(property.id)) {
            favoriteCount++;
          }
        });

        // Count inquiries (conversations about this property)
        const conversationsQuery = query(
          collection(db, "conversations"),
          where("propertyId", "==", property.id)
        );
        const conversationsSnapshot = await getDocs(conversationsQuery);
        const inquiryCount = conversationsSnapshot.size;

        propertyStats.push({
          property,
          views: property.views || 0,
          favorites: favoriteCount,
          inquiries: inquiryCount
        });
      }

      // Sort by views
      propertyStats.sort((a, b) => b.views - a.views);
      setStats(propertyStats);
      setLoading(false);
    } catch (error) {
      console.error("Error loading analytics:", error);
      setLoading(false);
    }
  };

  const totalViews = stats.reduce((sum, stat) => sum + stat.views, 0);
  const totalFavorites = stats.reduce((sum, stat) => sum + stat.favorites, 0);
  const totalInquiries = stats.reduce((sum, stat) => sum + stat.inquiries, 0);
  const activeListings = properties.filter(p => p.status === 'active').length;

  if (loading) {
    return (
      <div className="p-4">
        <p className="text-muted-foreground text-center py-12">Loading analytics...</p>
      </div>
    );
  }

  if (properties.length === 0) {
    return (
      <div className="p-4">
        <Card className="p-12 text-center">
          <TrendingUp className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Properties Listed</h3>
          <p className="text-muted-foreground">
            List a property to start tracking your analytics
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-6 pb-24">
      <h1 className="text-2xl font-bold">Property Analytics</h1>

      {/* Overview Cards */}
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Views
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <Eye className="h-8 w-8 text-primary" />
              <p className="text-3xl font-bold">{totalViews}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Favorites
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <Heart className="h-8 w-8 text-primary" />
              <p className="text-3xl font-bold">{totalFavorites}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Inquiries
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <MessageCircle className="h-8 w-8 text-primary" />
              <p className="text-3xl font-bold">{totalInquiries}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Active Listings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <Home className="h-8 w-8 text-primary" />
              <p className="text-3xl font-bold">{activeListings}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Property Performance */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Property Performance</h2>
        <div className="space-y-3">
          {stats.map((stat, index) => (
            <Card key={stat.property.id}>
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="relative h-20 w-20 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                    {stat.property.imageUrl ? (
                      <img
                        src={stat.property.imageUrl || "/placeholder.svg"}
                        alt={stat.property.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Home className="h-8 w-8 text-muted-foreground" />
                      </div>
                    )}
                    {index === 0 && (
                      <Badge className="absolute top-1 left-1 text-xs">
                        Top
                      </Badge>
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-sm mb-1 truncate">
                      {stat.property.title}
                    </h3>
                    <p className="text-xs text-muted-foreground mb-2">
                      {stat.property.location}
                    </p>
                    
                    <div className="flex items-center gap-4 text-xs">
                      <div className="flex items-center gap-1">
                        <Eye className="h-3 w-3 text-primary" />
                        <span>{stat.views}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Heart className="h-3 w-3 text-primary" />
                        <span>{stat.favorites}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MessageCircle className="h-3 w-3 text-primary" />
                        <span>{stat.inquiries}</span>
                      </div>
                    </div>
                  </div>
                  
                  <Badge variant={stat.property.status === 'active' ? 'default' : 'secondary'}>
                    {stat.property.status === 'active' ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
