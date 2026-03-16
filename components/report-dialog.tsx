'use client';

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Flag, AlertTriangle, CheckCircle2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { collection, addDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

interface ReportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  contentType: 'property' | 'service' | 'user' | 'message';
  contentId: string;
  contentTitle?: string;
  currentUser: { uid: string; username: string };
}

const REPORT_REASONS = {
  property: [
    { value: 'fraud', label: 'Fraudulent Listing', description: 'Fake or misleading property information' },
    { value: 'scam', label: 'Scam or Spam', description: 'Attempting to scam users or spam' },
    { value: 'duplicate', label: 'Duplicate Listing', description: 'Same property listed multiple times' },
    { value: 'inappropriate', label: 'Inappropriate Content', description: 'Offensive images or text' },
    { value: 'price', label: 'Price Manipulation', description: 'Unrealistic or misleading pricing' },
    { value: 'other', label: 'Other', description: 'Different issue not listed above' },
  ],
  service: [
    { value: 'fraud', label: 'Fraudulent Service', description: 'False credentials or experience' },
    { value: 'scam', label: 'Scam or Spam', description: 'Attempting to scam users' },
    { value: 'inappropriate', label: 'Inappropriate Content', description: 'Offensive content' },
    { value: 'unsafe', label: 'Safety Concern', description: 'Unlicensed or dangerous practices' },
    { value: 'other', label: 'Other', description: 'Different issue' },
  ],
  user: [
    { value: 'harassment', label: 'Harassment', description: 'Abusive or threatening behavior' },
    { value: 'fraud', label: 'Fraudulent Activity', description: 'Scamming or deceptive practices' },
    { value: 'impersonation', label: 'Impersonation', description: 'Pretending to be someone else' },
    { value: 'spam', label: 'Spam', description: 'Sending unwanted messages' },
    { value: 'other', label: 'Other', description: 'Different issue' },
  ],
  message: [
    { value: 'harassment', label: 'Harassment', description: 'Threatening or abusive message' },
    { value: 'spam', label: 'Spam', description: 'Unwanted commercial message' },
    { value: 'inappropriate', label: 'Inappropriate', description: 'Offensive content' },
    { value: 'scam', label: 'Scam Attempt', description: 'Attempting to defraud' },
    { value: 'other', label: 'Other', description: 'Different issue' },
  ],
};

export function ReportDialog({ open, onOpenChange, contentType, contentId, contentTitle, currentUser }: ReportDialogProps) {
  const [selectedReason, setSelectedReason] = useState('');
  const [details, setDetails] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const { toast } = useToast();

  const reasons = REPORT_REASONS[contentType];

  const handleSubmit = async () => {
    if (!selectedReason) {
      toast({
        title: "Please select a reason",
        description: "Choose why you're reporting this content",
        variant: "destructive"
      });
      return;
    }

    setSubmitting(true);

    try {
      // Create report in Firestore
      await addDoc(collection(db, 'reports'), {
        reporterId: currentUser.uid,
        reporterUsername: currentUser.username,
        contentType,
        contentId,
        contentTitle: contentTitle || 'Unknown',
        reason: selectedReason,
        reasonLabel: reasons.find(r => r.value === selectedReason)?.label || selectedReason,
        details,
        status: 'pending',
        createdAt: Date.now(),
        reviewed: false,
        userAgent: navigator.userAgent,
      });

      console.log('[v0] Report submitted:', { contentType, contentId, reason: selectedReason });

      setSuccess(true);
      
      // Show success state then close
      setTimeout(() => {
        setSelectedReason('');
        setDetails('');
        setSuccess(false);
        onOpenChange(false);
        
        toast({
          title: "Report submitted",
          description: "Thank you for helping us keep CasaLoop safe. We'll review your report shortly."
        });
      }, 2000);

    } catch (error) {
      console.error('[v0] Error submitting report:', error);
      toast({
        title: "Failed to submit report",
        description: "Please try again later",
        variant: "destructive"
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Flag className="h-5 w-5 text-destructive" />
            Report {contentType === 'property' ? 'Property' : contentType === 'service' ? 'Service' : contentType === 'user' ? 'User' : 'Message'}
          </DialogTitle>
          <DialogDescription>
            Help us maintain a safe and trustworthy community. Your report will be reviewed by our team.
          </DialogDescription>
        </DialogHeader>

        {success ? (
          <div className="py-12 text-center space-y-4">
            <div className="mx-auto h-16 w-16 rounded-full bg-green-500/10 flex items-center justify-center animate-in zoom-in duration-300">
              <CheckCircle2 className="h-10 w-10 text-green-500" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground">Report Submitted</h3>
              <p className="text-sm text-muted-foreground mt-2">Thank you for keeping CasaLoop safe!</p>
            </div>
          </div>
        ) : (
          <div className="space-y-4 py-4">
            {/* Content Info */}
            {contentTitle && (
              <div className="p-3 bg-muted/50 rounded-lg">
                <p className="text-sm text-muted-foreground">Reporting:</p>
                <p className="text-sm font-semibold text-foreground">{contentTitle}</p>
              </div>
            )}

            {/* Reason Selection */}
            <div>
              <Label className="text-base font-semibold mb-3 block">
                Why are you reporting this?
              </Label>
              <RadioGroup value={selectedReason} onValueChange={setSelectedReason}>
                <div className="space-y-2">
                  {reasons.map((reason) => (
                    <div key={reason.value} className="flex items-start space-x-3 p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors">
                      <RadioGroupItem value={reason.value} id={reason.value} className="mt-1" />
                      <div className="flex-1">
                        <Label htmlFor={reason.value} className="cursor-pointer">
                          <p className="font-semibold text-foreground">{reason.label}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">{reason.description}</p>
                        </Label>
                      </div>
                    </div>
                  ))}
                </div>
              </RadioGroup>
            </div>

            {/* Additional Details */}
            <div>
              <Label htmlFor="details" className="text-base font-semibold mb-2 block">
                Additional details (optional)
              </Label>
              <Textarea
                id="details"
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                placeholder="Provide any additional information that might help us review this report..."
                className="min-h-24 resize-none"
                maxLength={500}
              />
              <p className="text-xs text-muted-foreground mt-1">
                {details.length}/500 characters
              </p>
            </div>

            {/* Warning */}
            <div className="flex items-start gap-2 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
              <AlertTriangle className="h-4 w-4 text-destructive mt-0.5 flex-shrink-0" />
              <p className="text-xs text-muted-foreground">
                False reports may result in account suspension. Only report content that genuinely violates our policies.
              </p>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={submitting}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!selectedReason || submitting}
            className="flex-1 bg-destructive hover:bg-destructive/90 text-destructive-foreground"
          >
            {submitting ? "Submitting..." : "Submit Report"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
