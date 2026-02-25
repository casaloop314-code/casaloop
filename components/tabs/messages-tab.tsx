"use client";

import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { MessageCircle, Send, ArrowLeft, User } from "lucide-react";
import { collection, query, where, orderBy, onSnapshot, addDoc, updateDoc, doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { Conversation, Message } from "@/lib/casaloop-types";

interface MessagesTabProps {
  user: { uid: string; username: string };
}

export function MessagesTab({ user }: MessagesTabProps) {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load conversations
  useEffect(() => {
    try {
      const q = query(
        collection(db, "conversations"),
        where("participants", "array-contains", user.uid),
        orderBy("lastMessageTime", "desc")
      );

      const unsubscribe = onSnapshot(q, (snapshot) => {
        const convos: Conversation[] = [];
        snapshot.forEach((doc) => {
          convos.push({
            id: doc.id,
            ...doc.data()
          } as Conversation);
        });
        setConversations(convos);
        setLoading(false);
      }, (error) => {
        console.error("[CasaLoop] Error loading conversations:", error);
        setLoading(false);
      });

      return () => unsubscribe();
    } catch (error) {
      console.error("[CasaLoop] Error initializing conversations:", error);
      setLoading(false);
    }
  }, [user.uid]);

  // Load messages for selected conversation
  useEffect(() => {
    if (!selectedConversation) return;

    try {
      const q = query(
        collection(db, "messages"),
        where("conversationId", "==", selectedConversation.id),
        orderBy("createdAt", "asc")
      );

      const unsubscribe = onSnapshot(q, (snapshot) => {
        const msgs: Message[] = [];
        snapshot.forEach((doc) => {
          msgs.push({
            id: doc.id,
            ...doc.data()
          } as Message);
        });
        setMessages(msgs);
        
        // Mark messages as read
        snapshot.docs.forEach(async (docSnapshot) => {
          const message = docSnapshot.data() as Message;
          if (message.receiverId === user.uid && !message.read) {
            await updateDoc(doc(db, "messages", docSnapshot.id), { read: true });
          }
        });
        
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }, (error) => {
        console.error("[CasaLoop] Error loading messages:", error);
      });

      return () => unsubscribe();
    } catch (error) {
      console.error("[CasaLoop] Error initializing messages:", error);
    }
  }, [selectedConversation, user.uid]);

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation) return;

    const otherUserId = selectedConversation.participants.find(id => id !== user.uid);
    const otherUsername = selectedConversation.participantNames.find(name => name !== user.username);

    if (!otherUserId || !otherUsername) return;

    try {
      // Add message
      await addDoc(collection(db, "messages"), {
        conversationId: selectedConversation.id,
        senderId: user.uid,
        senderUsername: user.username,
        receiverId: otherUserId,
        receiverUsername: otherUsername,
        message: newMessage,
        read: false,
        createdAt: Date.now()
      });

      // Update conversation
      await updateDoc(doc(db, "conversations", selectedConversation.id), {
        lastMessage: newMessage,
        lastMessageTime: Date.now()
      });

      setNewMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const getUnreadCount = (conversation: Conversation) => {
    return conversation.unreadCount[user.uid] || 0;
  };

  const getOtherParticipant = (conversation: Conversation) => {
    const otherName = conversation.participantNames.find(name => name !== user.username);
    return otherName || "Unknown";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <MessageCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">Loading messages...</p>
        </div>
      </div>
    );
  }

  if (!selectedConversation) {
    return (
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">Messages</h1>
        
        {conversations.length === 0 ? (
          <Card className="p-12 text-center">
            <MessageCircle className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Messages Yet</h3>
            <p className="text-muted-foreground">
              Start a conversation by contacting a property owner
            </p>
          </Card>
        ) : (
          <div className="space-y-2">
            {conversations.map((conversation) => {
              const unreadCount = getUnreadCount(conversation);
              return (
                <Card
                  key={conversation.id}
                  className="cursor-pointer hover:bg-muted/50 transition-colors"
                  onClick={() => setSelectedConversation(conversation)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <User className="h-4 w-4 text-primary" />
                          <p className="font-semibold">@{getOtherParticipant(conversation)}</p>
                          {unreadCount > 0 && (
                            <Badge variant="default" className="h-5 px-2">
                              {unreadCount}
                            </Badge>
                          )}
                        </div>
                        {conversation.propertyTitle && (
                          <p className="text-xs text-muted-foreground mb-1">
                            Re: {conversation.propertyTitle}
                          </p>
                        )}
                        <p className="text-sm text-muted-foreground line-clamp-1">
                          {conversation.lastMessage}
                        </p>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {new Date(conversation.lastMessageTime).toLocaleDateString()}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen pb-24">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background border-b border-border p-4">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSelectedConversation(null)}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex-1">
            <p className="font-semibold">@{getOtherParticipant(selectedConversation)}</p>
            {selectedConversation.propertyTitle && (
              <p className="text-xs text-muted-foreground">
                Re: {selectedConversation.propertyTitle}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message) => {
            const isOwn = message.senderId === user.uid;
            return (
              <div
                key={message.id}
                className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[70%] rounded-lg p-3 ${
                    isOwn
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted'
                  }`}
                >
                  <p className="text-sm">{message.message}</p>
                  <p
                    className={`text-xs mt-1 ${
                      isOwn ? 'text-primary-foreground/70' : 'text-muted-foreground'
                    }`}
                  >
                    {new Date(message.createdAt).toLocaleTimeString()}
                  </p>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Input */}
      <div className="sticky bottom-20 bg-background border-t border-border p-4">
        <div className="flex gap-2">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            className="flex-1"
          />
          <Button onClick={sendMessage} size="icon">
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
