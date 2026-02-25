"use client";

import React from "react"

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Target, Eye, MessageCircle, Star, Home, Wrench, CheckCircle, Clock } from "lucide-react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useToast } from "@/hooks/use-toast";

interface Quest {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  reward: number;
  target: number;
  current: number;
  type: 'daily' | 'weekly';
  completed: boolean;
}

interface QuestSystemProps {
  user: { uid: string; username: string };
}

export function QuestSystem({ user }: QuestSystemProps) {
  const [quests, setQuests] = useState<Quest[]>([]);
  const [questProgress, setQuestProgress] = useState<any>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadQuests();
  }, [user.uid]);

  const loadQuests = async () => {
    const userRef = doc(db, "users", user.uid);
    const userDoc = await getDoc(userRef);
    
    if (userDoc.exists()) {
      const data = userDoc.data();
      const progress = data.questProgress || {};
      setQuestProgress(progress);

      // Generate daily quests
      const dailyQuests: Quest[] = [
        {
          id: 'view_properties',
          title: 'Property Hunter',
          description: 'View 5 properties today',
          icon: <Eye className="h-5 w-5" />,
          reward: 5,
          target: 5,
          current: progress.propertiesViewed || 0,
          type: 'daily',
          completed: (progress.propertiesViewed || 0) >= 5
        },
        {
          id: 'view_services',
          title: 'Service Explorer',
          description: 'Browse 3 service providers',
          icon: <Wrench className="h-5 w-5" />,
          reward: 3,
          target: 3,
          current: progress.servicesViewed || 0,
          type: 'daily',
          completed: (progress.servicesViewed || 0) >= 3
        },
        {
          id: 'send_message',
          title: 'Social Pioneer',
          description: 'Send 2 messages',
          icon: <MessageCircle className="h-5 w-5" />,
          reward: 4,
          target: 2,
          current: progress.messagesSent || 0,
          type: 'daily',
          completed: (progress.messagesSent || 0) >= 2
        },
        {
          id: 'favorite_property',
          title: 'Collector',
          description: 'Add 3 favorites',
          icon: <Star className="h-5 w-5" />,
          reward: 3,
          target: 3,
          current: progress.favoritesAdded || 0,
          type: 'daily',
          completed: (progress.favoritesAdded || 0) >= 3
        }
      ];

      // Generate weekly quests
      const weeklyQuests: Quest[] = [
        {
          id: 'create_listing',
          title: 'Property Pioneer',
          description: 'Create 1 property listing',
          icon: <Home className="h-5 w-5" />,
          reward: 20,
          target: 1,
          current: progress.listingsCreated || 0,
          type: 'weekly',
          completed: (progress.listingsCreated || 0) >= 1
        },
        {
          id: 'leave_review',
          title: 'Trusted Reviewer',
          description: 'Leave 2 reviews',
          icon: <Star className="h-5 w-5" />,
          reward: 15,
          target: 2,
          current: progress.reviewsLeft || 0,
          type: 'weekly',
          completed: (progress.reviewsLeft || 0) >= 2
        },
        {
          id: 'complete_transaction',
          title: 'Deal Maker',
          description: 'Complete 1 transaction',
          icon: <CheckCircle className="h-5 w-5" />,
          reward: 50,
          target: 1,
          current: progress.transactionsCompleted || 0,
          type: 'weekly',
          completed: (progress.transactionsCompleted || 0) >= 1
        }
      ];

      setQuests([...dailyQuests, ...weeklyQuests]);
    }
  };

  const claimReward = async (quest: Quest) => {
    if (!quest.completed) return;

    const userRef = doc(db, "users", user.uid);
    const userDoc = await getDoc(userRef);
    const casaPoints = userDoc.data()?.casaPoints || 0;
    const claimedQuests = userDoc.data()?.claimedQuests || [];

    if (claimedQuests.includes(quest.id)) {
      toast({
        title: "Already Claimed",
        description: "You've already claimed this reward!",
        variant: "destructive"
      });
      return;
    }

    await updateDoc(userRef, {
      casaPoints: casaPoints + quest.reward,
      claimedQuests: [...claimedQuests, quest.id]
    });

    toast({
      title: "Quest Complete! 🎉",
      description: `You earned ${quest.reward} $CASA!`,
    });

    loadQuests();
  };

  const dailyQuests = quests.filter(q => q.type === 'daily');
  const weeklyQuests = quests.filter(q => q.type === 'weekly');

  const dailyCompleted = dailyQuests.filter(q => q.completed).length;
  const weeklyCompleted = weeklyQuests.filter(q => q.completed).length;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Target className="h-6 w-6 text-primary" />
          <h2 className="text-2xl font-bold text-foreground">Quests</h2>
        </div>
        <div className="text-right">
          <p className="text-sm text-muted-foreground">Daily Progress</p>
          <p className="text-lg font-bold text-primary">{dailyCompleted}/{dailyQuests.length}</p>
        </div>
      </div>

      {/* Daily Quests */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-blue-500" />
            Daily Quests
            <Badge variant="outline" className="ml-auto">
              {dailyCompleted}/{dailyQuests.length}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {dailyQuests.map((quest) => (
            <QuestCard key={quest.id} quest={quest} onClaim={() => claimReward(quest)} />
          ))}
        </CardContent>
      </Card>

      {/* Weekly Quests */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-purple-500" />
            Weekly Quests
            <Badge variant="outline" className="ml-auto">
              {weeklyCompleted}/{weeklyQuests.length}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {weeklyQuests.map((quest) => (
            <QuestCard key={quest.id} quest={quest} onClaim={() => claimReward(quest)} />
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

function QuestCard({ quest, onClaim }: { quest: Quest; onClaim: () => void }) {
  const progress = Math.min(100, (quest.current / quest.target) * 100);

  return (
    <div className={`p-4 rounded-lg border-2 transition-all ${
      quest.completed 
        ? 'border-green-500 bg-green-50' 
        : 'border-border bg-card hover:border-primary/50'
    }`}>
      <div className="flex items-start gap-3">
        <div className={`h-10 w-10 rounded-full flex items-center justify-center flex-shrink-0 ${
          quest.completed ? 'bg-green-500 text-white' : 'bg-primary/10 text-primary'
        }`}>
          {quest.icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <div>
              <p className="font-semibold text-foreground">{quest.title}</p>
              <p className="text-sm text-muted-foreground">{quest.description}</p>
            </div>
            {quest.completed ? (
              <Button size="sm" onClick={onClaim} className="gap-1 bg-green-500 hover:bg-green-600">
                <CheckCircle className="h-4 w-4" />
                Claim
              </Button>
            ) : (
              <Badge variant="outline" className="gap-1">
                {quest.reward} $CASA
              </Badge>
            )}
          </div>
          <div className="space-y-1">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Progress</span>
              <span>{quest.current}/{quest.target}</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </div>
      </div>
    </div>
  );
}
