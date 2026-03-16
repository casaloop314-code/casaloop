"use client";

import React from "react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Building2, Loader2, Trash2, MapPin, Bed, Bath, Maximize, Upload, X, Pencil } from "lucide-react";
import { collection, addDoc, query, where, orderBy, onSnapshot, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useToast } from "@/hooks/use-toast";
import type { Property } from "@/lib/casaloop-types";

interface ListingsTabProps {
  user: { uid: string; username: string };
}

export function ListingsTab({ user }: ListingsTabProps) {
  const [loading, setLoading] = useState(false);
  const [myListings, setMyListings] = useState<Property[]>([]);
  const [loadingListings, setLoadingListings] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [propertyToDelete, setPropertyToDelete] = useState<Property | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    title: "",
    price: "",
    location: "",
    type: "sale",
    category: "house",
    bedrooms: "",
    bathrooms: "",
    area: "",
    description: "",
    imageUrl: "",
    images: [] as string[]
  });
  const [uploadingImages, setUploadingImages] = useState(false);

  // Load user's listings
  useEffect(() => {
    try {
      const listingsQuery = query(
        collection(db, "listings"),
        where("userId", "==", user.uid),
        orderBy("createdAt", "desc")
      );

      const unsubscribe = onSnapshot(listingsQuery, (snapshot) => {
        const listingsData: Property[] = [];
        snapshot.forEach((doc) => {
          listingsData.push({
            id: doc.id,
            ...doc.data()
          } as Property);
        });
        setMyListings(listingsData);
        setLoadingListings(false);
        console.log("[v0] Loaded user listings:", listingsData.length);
      }, (error) => {
        console.error("[CasaLoop] Error loading listings:", error);
        setLoadingListings(false);
      });

      return () => unsubscribe();
    } catch (error) {
      console.error("[CasaLoop] Error initializing listings listener:", error);
      setLoadingListings(false);
    }
  }, [user.uid]);

  // Handle multiple image uploads using Vercel Blob
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    // Validate total number of images (max 5)
    if (formData.images.length + files.length > 5) {
      toast({
        title: "Too many images",
        description: "Maximum 5 images allowed per listing.",
        variant: "destructive"
      });
      return;
    }

    setUploadingImages(true);

    try {
      const uploadPromises = Array.from(files).map(async (file) => {
        // Validate file type
        if (!file.type.startsWith('image/')) {
          throw new Error(`${file.name} is not an image file`);
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
          throw new Error(`${file.name} is larger than 5MB`);
        }

        // Upload to Vercel Blob
        const formDataUpload = new FormData();
        formDataUpload.append('file', file);

        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formDataUpload,
        });

        if (!response.ok) {
          throw new Error('Upload failed');
        }

        const data = await response.json();
        return data.url;
      });

      const uploadedUrls = await Promise.all(uploadPromises);
      const newImages = [...formData.images, ...uploadedUrls];
      
      setFormData({ ...formData, images: newImages, imageUrl: newImages[0] || formData.imageUrl });
      
      toast({
        title: "Images uploaded",
        description: `${uploadedUrls.length} image(s) uploaded successfully`,
      });
    } catch (error) {
      console.error("[v0] Upload error:", error);
      toast({
        title: "Upload failed",
        description: error instanceof Error ? error.message : "Failed to upload images",
        variant: "destructive"
      });
    } finally {
      setUploadingImages(false);
    }
  };

  const handleRemoveImage = (index: number) => {
    const newImages = formData.images.filter((_, i) => i !== index);
    setFormData({ ...formData, images: newImages, imageUrl: newImages[0] || "" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.price || !formData.location) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);

    try {
      if (editingProperty) {
        // Update existing property
        await updateDoc(doc(db, "listings", editingProperty.id), {
          title: formData.title,
          price: parseFloat(formData.price),
          location: formData.location,
          type: formData.type,
          category: formData.category,
          bedrooms: parseInt(formData.bedrooms) || 1,
          bathrooms: parseInt(formData.bathrooms) || 1,
          area: parseInt(formData.area) || 0,
          description: formData.description,
          imageUrl: formData.imageUrl,
          images: formData.images,
        });
        
        console.log("[v0] Property updated:", editingProperty.id);

        toast({
          title: "Updated!",
          description: "Your property listing has been updated",
        });
      } else {
        // Create new property
        await addDoc(collection(db, "listings"), {
          title: formData.title,
          price: parseFloat(formData.price),
          location: formData.location,
          type: formData.type,
          category: formData.category,
          status: 'active',
          bedrooms: parseInt(formData.bedrooms) || 1,
          bathrooms: parseInt(formData.bathrooms) || 1,
          area: parseInt(formData.area) || 0,
          description: formData.description,
          imageUrl: formData.imageUrl,
          userId: user.uid,
          username: user.username,
          sellerName: user.username,
          views: 0,
          images: formData.images,
          createdAt: Date.now()
        });
        
        console.log("[v0] Property listed by @" + user.username);

        toast({
          title: "Success!",
          description: "Your property has been listed",
        });
      }

      // Reset form
      setFormData({
        title: "",
        price: "",
        location: "",
        type: "sale",
        category: "house",
        bedrooms: "",
        bathrooms: "",
        area: "",
        description: "",
        imageUrl: ""
      });
      setImagePreview("");
      setEditingProperty(null);
    } catch (error) {
      console.error("[CasaLoop] Error adding listing:", error);
      toast({
        title: "Error",
        description: "Failed to create listing. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (property: Property) => {
    setPropertyToDelete(property);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!propertyToDelete) return;

    setDeleting(true);
    console.log("[v0] Deleting property:", propertyToDelete.id);

    try {
      await deleteDoc(doc(db, "listings", propertyToDelete.id));
      
      toast({
        title: "Listing Deleted",
        description: "Your property listing has been removed.",
      });
      
      setDeleteDialogOpen(false);
      setPropertyToDelete(null);
    } catch (error) {
      console.error("[v0] Error deleting listing:", error);
      toast({
        title: "Error",
        description: "Failed to delete listing. Please try again.",
        variant: "destructive"
      });
    } finally {
      setDeleting(false);
    }
  };

  const handleMarkSoldRented = async (property: Property) => {
    try {
      const propertyRef = doc(db, "listings", property.id);
      await updateDoc(propertyRef, {
        status: 'inactive'
      });

      console.log("[v0] Property marked as", property.type === 'sale' ? 'sold' : 'rented');
      
      toast({
        title: property.type === 'sale' ? "Marked as Sold" : "Marked as Rented",
        description: "Your listing is now off the market.",
      });
    } catch (error) {
      console.error("[v0] Error updating property status:", error);
      toast({
        title: "Error",
        description: "Failed to update listing. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleEdit = (property: Property) => {
    console.log("[v0] Editing property:", property.id);
    
    // Populate form with property data
    setFormData({
      title: property.title,
      price: property.price.toString(),
      location: property.location,
      type: property.type,
      category: property.category,
      bedrooms: property.bedrooms.toString(),
      bathrooms: property.bathrooms.toString(),
      area: property.area.toString(),
      description: property.description,
      imageUrl: property.imageUrl || ""
    });
    
    // Set image preview if exists
    if (property.imageUrl) {
      setImagePreview(property.imageUrl);
    }
    
    setEditingProperty(property);
    
    // Scroll to form
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="p-4 pb-24 space-y-6">
      {/* Add New Property Section */}
      <Card className="border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-foreground">
            <Building2 className="h-5 w-5 text-primary" />
            {editingProperty ? 'Edit Property' : 'Add New Property'}
          </CardTitle>
          {editingProperty && (
            <p className="text-sm text-muted-foreground mt-1">
              Updating: {editingProperty.title}
            </p>
          )}
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Property Title *</Label>
              <Input
                id="title"
                placeholder="e.g. Modern 3BR Apartment"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">
                  Price (Pi{formData.type === "rent" ? "/month" : ""}) *
                </Label>
                <Input
                  id="price"
                  type="number"
                  placeholder={formData.type === "rent" ? "500" : "10000"}
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="type">Listing Type *</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value) => setFormData({ ...formData, type: value })}
                >
                  <SelectTrigger id="type">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sale">For Sale</SelectItem>
                    <SelectItem value="rent">For Rent</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => setFormData({ ...formData, category: value })}
                >
                  <SelectTrigger id="category">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="house">🏠 House</SelectItem>
                    <SelectItem value="apartment">🏢 Apartment</SelectItem>
                    <SelectItem value="land">🌳 Land</SelectItem>
                    <SelectItem value="shop">🏪 Shop</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location *</Label>
              <Input
                id="location"
                placeholder="e.g. New York, USA"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                required
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="bedrooms">Bedrooms</Label>
                <Input
                  id="bedrooms"
                  type="number"
                  placeholder="3"
                  value={formData.bedrooms}
                  onChange={(e) => setFormData({ ...formData, bedrooms: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="bathrooms">Bathrooms</Label>
                <Input
                  id="bathrooms"
                  type="number"
                  placeholder="2"
                  value={formData.bathrooms}
                  onChange={(e) => setFormData({ ...formData, bathrooms: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="area">Area (m²)</Label>
                <Input
                  id="area"
                  type="number"
                  placeholder="120"
                  value={formData.area}
                  onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="imageUpload">Property Photo (optional)</Label>
              
              {!imagePreview ? (
                <div className="relative">
                  <Input
                    id="imageUpload"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <Label
                    htmlFor="imageUpload"
                    className="flex items-center justify-center gap-2 h-32 border-2 border-dashed border-border rounded-lg cursor-pointer hover:border-primary/50 hover:bg-muted/30 transition-colors"
                  >
                    <Upload className="h-6 w-6 text-muted-foreground" />
                    <div className="text-center">
                      <p className="text-sm font-medium text-foreground">
                        Upload Photo
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Click to select (Max 2MB)
                      </p>
                    </div>
                  </Label>
                </div>
              ) : (
                <div className="relative group">
                  <div className="h-32 rounded-lg overflow-hidden border border-border">
                    <img
                      src={imagePreview || "/placeholder.svg"}
                      alt="Property preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={handleRemoveImage}
                    className="absolute top-2 right-2 h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                  <p className="text-xs text-muted-foreground mt-2 text-center">
                    Photo uploaded successfully
                  </p>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Describe your property..."
                rows={4}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>

            <Button
              type="submit"
              className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {editingProperty ? 'Updating...' : 'Listing Property...'}
                </>
              ) : (
                editingProperty ? "Update Listing" : "List Property"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* My Active Listings Section */}
      <Card className="border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-foreground">
            <Building2 className="h-5 w-5 text-primary" />
            My Active Listings
            <Badge variant="secondary" className="ml-auto">
              {myListings.length}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loadingListings ? (
            <div className="space-y-4">
              {[1, 2].map((i) => (
                <div key={i} className="h-32 bg-muted/30 rounded-lg animate-pulse" />
              ))}
            </div>
          ) : myListings.length === 0 ? (
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-muted/30 mb-3">
                <Building2 className="h-8 w-8 text-muted-foreground" />
              </div>
              <p className="text-muted-foreground font-medium">No active listings</p>
              <p className="text-sm text-muted-foreground/70 mt-1">
                Your property listings will appear here
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {myListings.map((property) => (
                <div
                  key={property.id}
                  className="p-4 rounded-lg bg-muted/20 border border-border/50 hover:border-primary/30 transition-colors"
                >
                  <div className="flex items-start gap-4">
                    {/* Property Image */}
                    <div className="h-20 w-20 rounded-lg bg-muted flex-shrink-0 overflow-hidden">
                      {property.imageUrl ? (
                        <img
                          src={property.imageUrl || "/placeholder.svg"}
                          alt={property.title}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center">
                          <Building2 className="h-8 w-8 text-muted-foreground" />
                        </div>
                      )}
                    </div>

                    {/* Property Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h3 className="font-semibold text-foreground text-base leading-tight">
                          {property.title}
                        </h3>
                        <Badge
                          className={`flex-shrink-0 font-bold text-xs ${
                            property.type === "sale"
                              ? "bg-primary text-primary-foreground"
                              : "bg-green-500 text-white"
                          }`}
                        >
                          {property.type === "sale" ? "SALE" : "RENT"}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                        <MapPin className="h-3.5 w-3.5 flex-shrink-0" />
                        <span className="truncate">{property.location}</span>
                      </div>

                      <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
                        <div className="flex items-center gap-1">
                          <Bed className="h-3.5 w-3.5" />
                          <span>{property.bedrooms}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Bath className="h-3.5 w-3.5" />
                          <span>{property.bathrooms}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Maximize className="h-3.5 w-3.5" />
                          <span>{property.area}m²</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-baseline gap-1">
                          <span className="text-lg font-bold text-primary">
                            π {property.price.toLocaleString()}
                          </span>
                          {property.type === "rent" && (
                            <span className="text-sm text-muted-foreground font-medium">/month</span>
                          )}
                        </div>
                        <div className="flex gap-2">
                          {property.status !== 'inactive' && (
                            <Button
                              variant="outline"
                              size="sm"
                              className="border-muted-foreground/30 hover:bg-muted/50 gap-2 text-xs bg-transparent"
                              onClick={() => handleMarkSoldRented(property)}
                            >
                              Mark as {property.type === 'sale' ? 'Sold' : 'Rented'}
                            </Button>
                          )}
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-primary/30 hover:bg-primary/10 hover:border-primary gap-2 bg-transparent"
                            onClick={() => handleEdit(property)}
                          >
                            <Pencil className="h-4 w-4" />
                            Edit
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-destructive hover:text-destructive hover:bg-destructive/10 gap-2"
                            onClick={() => handleDeleteClick(property)}
                          >
                            <Trash2 className="h-4 w-4" />
                            Delete
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the listing for{" "}
              <span className="font-semibold text-foreground">
                {propertyToDelete?.title}
              </span>
              . This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              disabled={deleting}
              className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
            >
              {deleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete Listing"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
