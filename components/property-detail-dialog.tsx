"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { MapPin, Bed, Bath, Maximize, Heart, Eye, X, ChevronLeft, ChevronRight, MessageCircle, Star, BadgeCheck, Flag } from "lucide-react";
import type { Property } from "@/lib/casaloop-types";
import Image from "next/image";
import { PropertyReviews } from "@/components/property-reviews";
import { VerificationBadge } from "@/components/verification-badge";
import { ReportDialog } from "@/components/report-dialog";

interface PropertyDetailDialogProps {
  property: Property | null;
  isOpen: boolean;
  onClose: () => void;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  onContact: () => void;
  currentUser?: { uid: string; username: string };
}

export function PropertyDetailDialog({
  property,
  isOpen,
  onClose,
  isFavorite,
  onToggleFavorite,
  onContact,
  currentUser
}: PropertyDetailDialogProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showReportDialog, setShowReportDialog] = useState(false);

  if (!property) return null;

  const images = property.images && property.images.length > 0 ? property.images : [property.imageUrl || "/placeholder.svg?height=400&width=600"];
  const isOwner = currentUser?.uid === property.userId;

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0">
        <div className="relative">
          {/* Image Gallery */}
          <div className="relative h-96 bg-muted">
            <img
              src={images[currentImageIndex] || "/placeholder.svg"}
              alt={property.title}
              className="w-full h-full object-cover"
            />
            
            {/* Gallery Navigation */}
            {images.length > 1 && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background"
                  onClick={prevImage}
                >
                  <ChevronLeft className="h-5 w-5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background"
                  onClick={nextImage}
                >
                  <ChevronRight className="h-5 w-5" />
                </Button>
                
                {/* Image Counter */}
                <div className="absolute bottom-3 right-3 bg-background/90 px-3 py-1 rounded-full text-sm font-medium">
                  {currentImageIndex + 1} / {images.length}
                </div>
              </>
            )}
            
            {/* Favorite Button */}
            <Button
              variant="ghost"
              size="icon"
              className={`absolute top-3 right-3 h-10 w-10 rounded-full ${
                isFavorite ? 'bg-primary text-primary-foreground' : 'bg-background/80'
              }`}
              onClick={onToggleFavorite}
            >
              <Heart className={`h-5 w-5 ${isFavorite ? 'fill-current' : ''}`} />
            </Button>
            
            {/* Status Badge */}
            <Badge className="absolute top-3 left-3" variant={property.status === 'inactive' ? 'secondary' : 'default'}>
              {property.status === 'inactive' 
                ? (property.type === "sale" ? "SOLD" : "RENTED")
                : (property.type === "sale" ? "FOR SALE" : "FOR RENT")
              }
            </Badge>
          </div>

          {/* Close Button */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-3 right-14 bg-background/80 hover:bg-background"
            onClick={onClose}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Header */}
          <div>
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1">
                <h2 className="text-3xl font-bold text-foreground mb-2">{property.title}</h2>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span>{property.location}</span>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                {property.verified && <VerificationBadge type="verified" size="sm" />}
              </div>
            </div>
            
            {/* Price */}
            <div className="flex items-baseline gap-2 mt-4">
              <p className="text-4xl font-bold text-primary">
                π {property.price.toLocaleString()}
              </p>
              {property.type === "rent" && (
                <span className="text-lg text-muted-foreground">/month</span>
              )}
            </div>
            
            {/* Rating */}
            {property.rating && property.rating > 0 && (
              <div className="flex items-center gap-2 mt-2">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${i < Math.floor(property.rating!) ? 'fill-yellow-500 text-yellow-500' : 'text-muted'}`}
                    />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">
                  {property.rating.toFixed(1)} ({property.reviewCount || 0} reviews)
                </span>
              </div>
            )}
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-4 gap-4">
            <Card className="p-4 text-center">
              <Bed className="h-6 w-6 text-primary mx-auto mb-2" />
              <p className="text-2xl font-bold">{property.bedrooms}</p>
              <p className="text-xs text-muted-foreground">Bedrooms</p>
            </Card>
            <Card className="p-4 text-center">
              <Bath className="h-6 w-6 text-primary mx-auto mb-2" />
              <p className="text-2xl font-bold">{property.bathrooms}</p>
              <p className="text-xs text-muted-foreground">Bathrooms</p>
            </Card>
            <Card className="p-4 text-center">
              <Maximize className="h-6 w-6 text-primary mx-auto mb-2" />
              <p className="text-2xl font-bold">{property.area}</p>
              <p className="text-xs text-muted-foreground">m²</p>
            </Card>
            <Card className="p-4 text-center">
              <Eye className="h-6 w-6 text-primary mx-auto mb-2" />
              <p className="text-2xl font-bold">{property.views || 0}</p>
              <p className="text-xs text-muted-foreground">Views</p>
            </Card>
          </div>

          {/* Description */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Description</h3>
            <p className="text-muted-foreground leading-relaxed">{property.description}</p>
          </div>

          {/* Seller Info */}
          <div className="border-t border-border pt-6">
            <h3 className="text-lg font-semibold mb-3">Listed By</h3>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground">@{property.sellerName || property.username}</p>
                <p className="text-sm text-muted-foreground">Pi Network Verified</p>
              </div>
              {!isOwner && property.status === 'active' && (
                <div className="flex gap-2">
                  <Button onClick={onContact} className="gap-2">
                    <MessageCircle className="h-4 w-4" />
                    Contact Seller
                  </Button>
                  {currentUser && (
                    <Button 
                      variant="outline" 
                      size="icon"
                      onClick={() => setShowReportDialog(true)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Flag className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Thumbnail Gallery */}
          {images.length > 1 && (
            <div className="border-t border-border pt-6">
              <h3 className="text-lg font-semibold mb-3">Gallery</h3>
              <div className="grid grid-cols-5 gap-2">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentImageIndex(idx)}
                    className={`relative h-20 rounded-lg overflow-hidden border-2 transition-all ${
                      currentImageIndex === idx ? 'border-primary' : 'border-transparent'
                    }`}
                  >
                    <img src={img || "/placeholder.svg"} alt={`Gallery ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Reviews Section */}
          {currentUser && (
            <div className="border-t border-border pt-6">
              <PropertyReviews propertyId={property.id} currentUser={currentUser} />
            </div>
          )}
        </div>
      </DialogContent>

      {/* Report Dialog */}
      {currentUser && (
        <ReportDialog
          open={showReportDialog}
          onOpenChange={setShowReportDialog}
          contentType="property"
          contentId={property.id}
          contentTitle={property.title}
          currentUser={currentUser}
        />
      )}
    </Dialog>
  );
}
