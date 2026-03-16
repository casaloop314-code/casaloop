"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Layers, X } from "lucide-react";
import type { Property } from "@/lib/casaloop-types";

interface PropertyMapProps {
  properties: Property[];
  onPropertySelect: (property: Property) => void;
}

export function PropertyMap({ properties, onPropertySelect }: PropertyMapProps) {
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);

  // For now, we'll show a list-based map view
  // In production, you would integrate with a mapping library like Mapbox, Leaflet, or Google Maps

  const handlePropertyClick = (property: Property) => {
    setSelectedProperty(property);
    onPropertySelect(property);
  };

  return (
    <div className="relative h-full">
      {/* Map Placeholder */}
      <div className="absolute inset-0 bg-muted/20 flex items-center justify-center">
        <div className="text-center">
          <MapPin className="h-16 w-16 text-primary mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Map View</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Interactive map coming soon
          </p>
          <div className="flex items-center gap-2 justify-center text-xs text-muted-foreground">
            <Layers className="h-4 w-4" />
            <span>{properties.length} properties in this area</span>
          </div>
        </div>
      </div>

      {/* Property List Overlay */}
      <div className="absolute bottom-0 left-0 right-0 max-h-64 overflow-y-auto bg-background/95 backdrop-blur border-t border-border p-4">
        <div className="grid grid-cols-1 gap-2">
          {properties.map((property) => (
            <Card
              key={property.id}
              className="cursor-pointer hover:bg-muted/50 transition-colors"
              onClick={() => handlePropertyClick(property)}
            >
              <div className="flex items-center gap-3 p-3">
                <div className="h-16 w-16 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                  {property.imageUrl ? (
                    <img
                      src={property.imageUrl || "/placeholder.svg"}
                      alt={property.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <MapPin className="h-6 w-6 text-muted-foreground" />
                    </div>
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-sm truncate">{property.title}</h4>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
                    <MapPin className="h-3 w-3" />
                    <span className="truncate">{property.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={property.type === "sale" ? "default" : "secondary"} className="text-xs">
                      {property.type === "sale" ? "For Sale" : "For Rent"}
                    </Badge>
                    <span className="text-sm font-bold text-primary">π {property.price.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
