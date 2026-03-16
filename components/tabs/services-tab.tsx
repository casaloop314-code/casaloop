"use client";

import { useState, useEffect } from "react";
import { collection, getDocs, query, orderBy, addDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Search, Wrench, Star, MapPin, Clock, Award, Plus, Loader2, Zap, Droplet, Hammer, Paintbrush, Sparkles, Leaf, Wind } from "lucide-react";
import type { ServiceProvider, ServiceCategory } from "@/lib/casaloop-types";
import { useToast } from "@/hooks/use-toast";
import { ServiceGridSkeleton } from "@/components/skeleton-loader";

interface ServicesTabProps {
  user: {
    uid: string;
    username: string;
  };
}

const serviceCategoryConfig: Record<ServiceCategory, { label: string; icon: any; color: string }> = {
  'electrician': { label: 'Electrician', icon: Zap, color: 'text-yellow-500' },
  'plumber': { label: 'Plumber', icon: Droplet, color: 'text-blue-500' },
  'carpenter': { label: 'Carpenter', icon: Hammer, color: 'text-amber-700' },
  'painter': { label: 'Painter', icon: Paintbrush, color: 'text-purple-500' },
  'cleaner': { label: 'Cleaner', icon: Sparkles, color: 'text-pink-500' },
  'landscaper': { label: 'Landscaper', icon: Leaf, color: 'text-green-500' },
  'hvac': { label: 'HVAC', icon: Wind, color: 'text-cyan-500' },
  'roofing': { label: 'Roofing', icon: Wrench, color: 'text-gray-600' },
  'locksmith': { label: 'Locksmith', icon: Wrench, color: 'text-orange-500' },
  'pest-control': { label: 'Pest Control', icon: Wrench, color: 'text-red-500' },
  'handyman': { label: 'Handyman', icon: Wrench, color: 'text-indigo-500' },
  'mason': { label: 'Mason', icon: Wrench, color: 'text-stone-600' },
  'welder': { label: 'Welder', icon: Wrench, color: 'text-orange-600' },
  'tiler': { label: 'Tiler', icon: Wrench, color: 'text-slate-600' },
  'other': { label: 'Other', icon: Wrench, color: 'text-gray-500' },
};

export function ServicesTab({ user }: ServicesTabProps) {
  const [services, setServices] = useState<ServiceProvider[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<ServiceCategory | 'all'>('all');
  const [selectedService, setSelectedService] = useState<ServiceProvider | null>(null);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    title: "",
    category: "electrician" as ServiceCategory,
    description: "",
    pricePerHour: "",
    location: "",
    experience: "",
    availability: "",
    skills: "",
    imageUrl: ""
  });

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const servicesQuery = query(
        collection(db, "services"),
        orderBy("createdAt", "desc")
      );
      const snapshot = await getDocs(servicesQuery);
      const servicesData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as ServiceProvider[];
      setServices(servicesData);
    } catch (error) {
      console.error("Error fetching services:", error);
      toast({
        title: "Error",
        description: "Failed to load services",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!formData.title || !formData.description || !formData.pricePerHour || !formData.location) {
      toast({
        title: "Missing fields",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    setSubmitting(true);
    try {
      await addDoc(collection(db, "services"), {
        userId: user.uid,
        username: user.username,
        title: formData.title,
        category: formData.category,
        description: formData.description,
        pricePerHour: Number(formData.pricePerHour),
        location: formData.location,
        experience: formData.experience,
        availability: formData.availability,
        skills: formData.skills.split(',').map(s => s.trim()).filter(Boolean),
        imageUrl: formData.imageUrl,
        verified: false,
        rating: 0,
        reviewCount: 0,
        completedJobs: 0,
        views: 0,
        createdAt: Date.now()
      });

      toast({
        title: "Success",
        description: "Your service has been listed!"
      });

      setShowAddDialog(false);
      setFormData({
        title: "",
        category: "electrician",
        description: "",
        pricePerHour: "",
        location: "",
        experience: "",
        availability: "",
        skills: "",
        imageUrl: ""
      });
      fetchServices();
    } catch (error) {
      console.error("Error adding service:", error);
      toast({
        title: "Error",
        description: "Failed to add service",
        variant: "destructive"
      });
    } finally {
      setSubmitting(false);
    }
  };

  const filteredServices = services.filter(service => {
    if (categoryFilter !== 'all' && service.category !== categoryFilter) return false;
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return service.title.toLowerCase().includes(query) ||
             service.description.toLowerCase().includes(query) ||
             service.location.toLowerCase().includes(query);
    }
    return true;
  });

  // Pagination
  const totalPages = Math.ceil(filteredServices.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedServices = filteredServices.slice(startIndex, endIndex);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, categoryFilter]);

  if (loading) {
    return <ServiceGridSkeleton />;
  }

  return (
    <div className="pb-20">
      {/* Header */}
      <div className="bg-gradient-to-br from-primary/10 via-background to-background border-b border-border sticky top-0 z-10">
        <div className="p-4 space-y-3">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-foreground">Service Providers</h1>
            <Button onClick={() => setShowAddDialog(true)} size="sm" className="gap-2">
              <Plus className="h-4 w-4" />
              Add Service
            </Button>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search services..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>

          {/* Category Filter */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            <Button
              variant={categoryFilter === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setCategoryFilter('all')}
            >
              All
            </Button>
            {Object.entries(serviceCategoryConfig).map(([key, config]) => {
              const Icon = config.icon;
              return (
                <Button
                  key={key}
                  variant={categoryFilter === key ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setCategoryFilter(key as ServiceCategory)}
                  className="gap-2 whitespace-nowrap"
                >
                  <Icon className={`h-4 w-4 ${categoryFilter === key ? '' : config.color}`} />
                  {config.label}
                </Button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Services List */}
      <div className="p-4 space-y-4">
        {filteredServices.length === 0 ? (
          <div className="text-center py-12">
            <Wrench className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground">No services found</p>
          </div>
        ) : (
          paginatedServices.map((service) => {
            const config = serviceCategoryConfig[service.category];
            const Icon = config.icon;
            return (
              <Card
                key={service.id}
                className="p-4 cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => setSelectedService(service)}
              >
                <div className="flex gap-3">
                  <div className={`h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center ${config.color}`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-foreground">{service.title}</h3>
                        <Badge variant="outline" className="text-xs mt-1">{config.label}</Badge>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-primary">π {service.pricePerHour}/hr</p>
                        {service.rating && service.rating > 0 && (
                          <div className="flex items-center gap-1 text-sm">
                            <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
                            <span>{service.rating.toFixed(1)}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{service.description}</p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {service.location}
                      </div>
                      {service.experience && (
                        <div className="flex items-center gap-1">
                          <Award className="h-3 w-3" />
                          {service.experience}
                        </div>
                      )}
                      {service.completedJobs && service.completedJobs > 0 && (
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {service.completedJobs} jobs
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            );
          })
        )}

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

      {/* Add Service Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add Your Service</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Service Title</label>
              <Input
                placeholder="e.g., Professional Electrician"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Category</label>
              <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value as ServiceCategory })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(serviceCategoryConfig).map(([key, config]) => (
                    <SelectItem key={key} value={key}>{config.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium">Price per Hour (Pi)</label>
              <Input
                type="number"
                placeholder="10"
                value={formData.pricePerHour}
                onChange={(e) => setFormData({ ...formData, pricePerHour: e.target.value })}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Location</label>
              <Input
                placeholder="City, Region"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Experience</label>
              <Input
                placeholder="e.g., 5 years"
                value={formData.experience}
                onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Availability</label>
              <Input
                placeholder="e.g., Mon-Fri, 9AM-5PM"
                value={formData.availability}
                onChange={(e) => setFormData({ ...formData, availability: e.target.value })}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Skills (comma-separated)</label>
              <Input
                placeholder="e.g., Wiring, Circuit Installation, Troubleshooting"
                value={formData.skills}
                onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Description</label>
              <Textarea
                placeholder="Describe your services..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
              />
            </div>
            <Button onClick={handleSubmit} disabled={submitting} className="w-full">
              {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Add Service'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Service Detail Dialog */}
      <Dialog open={!!selectedService} onOpenChange={(open) => !open && setSelectedService(null)}>
        <DialogContent className="max-w-2xl">
          {selectedService && (
            <div className="space-y-4">
              <DialogHeader>
                <DialogTitle className="text-2xl">{selectedService.title}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Badge variant="outline">{serviceCategoryConfig[selectedService.category].label}</Badge>
                  <p className="text-2xl font-bold text-primary">π {selectedService.pricePerHour}/hr</p>
                </div>
                <p className="text-muted-foreground">{selectedService.description}</p>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Location</p>
                    <p className="font-medium">{selectedService.location}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Experience</p>
                    <p className="font-medium">{selectedService.experience || 'Not specified'}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Availability</p>
                    <p className="font-medium">{selectedService.availability || 'Not specified'}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Completed Jobs</p>
                    <p className="font-medium">{selectedService.completedJobs || 0}</p>
                  </div>
                </div>
                {selectedService.skills && selectedService.skills.length > 0 && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Skills</p>
                    <div className="flex flex-wrap gap-2">
                      {selectedService.skills.map((skill, i) => (
                        <Badge key={i} variant="secondary">{skill}</Badge>
                      ))}
                    </div>
                  </div>
                )}
                <div className="pt-4">
                  <p className="text-sm text-muted-foreground">Provider: @{selectedService.username}</p>
                </div>
                <Button className="w-full">Contact Provider</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
