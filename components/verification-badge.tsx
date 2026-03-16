"use client";

import { Badge } from "@/components/ui/badge";
import { BadgeCheck, ShieldCheck, Award } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface VerificationBadgeProps {
  type: "verified" | "kyc" | "professional";
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
}

export function VerificationBadge({ type, size = "md", showLabel = true }: VerificationBadgeProps) {
  const badgeConfig = {
    verified: {
      icon: BadgeCheck,
      label: "Verified Listing",
      description: "This property has been verified by CasaLoop",
      color: "text-primary"
    },
    kyc: {
      icon: ShieldCheck,
      label: "KYC Verified",
      description: "Seller has completed Pi Network KYC verification",
      color: "text-green-500"
    },
    professional: {
      icon: Award,
      label: "Professional Agent",
      description: "Licensed real estate professional",
      color: "text-yellow-500"
    }
  };

  const config = badgeConfig[type];
  const Icon = config.icon;

  const iconSize = {
    sm: "h-3 w-3",
    md: "h-4 w-4",
    lg: "h-5 w-5"
  }[size];

  if (!showLabel) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="inline-flex">
              <Icon className={`${iconSize} ${config.color}`} />
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p className="text-sm font-medium">{config.label}</p>
            <p className="text-xs text-muted-foreground">{config.description}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return (
    <Badge variant="outline" className="gap-1.5">
      <Icon className={`${iconSize} ${config.color}`} />
      <span className="text-xs">{config.label}</span>
    </Badge>
  );
}
