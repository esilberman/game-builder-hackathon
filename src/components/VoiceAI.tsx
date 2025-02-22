import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Conversation } from "@11labs/client";

interface VoiceAIProps {
  onClose: () => void;
}

type Message = {
  role: 'user' | 'ai';
  message: string;
  time_in_call_secs?: number;
};

type Role = 'user' | 'ai';

const DEBUG = true;

const VoiceAI = ({ onClose }: VoiceAIProps) => {
  const conversationRef = useRef<Conversation | null>(null);
  const [status, setStatus] = useState<string>("disconnected");
  const [agentStatus, setAgentStatus] = useState<string>("listening");
  const [transcript, setTranscript] = useState<Message[]>([]);
  const [description, setDescription] = useState<string>("");

  useEffect(() => {
    const startConversation = async () => {
      try {
        if (DEBUG) {
          setTranscript([
            { role: 'ai', message: "What's up? It's ya boy Jamal here. So what kind of game would you like to make?" },
            { role: 'user', message: "I'm not sure, but I want to make something with one mechanic. Can you suggest some ideas?" },
            { role: 'ai', message: "Yo, I feel you! One-mechanic games can be super dope when done right. Let's brainstorm some sick ideas that could blow up on the web. How about these: 1. \"Gravity Flip\" - A platformer where you can only jump and flip gravity. You gotta navigate through wild levels by switching between floor and ceiling. Think \"VVVVVV\" but with your own twist. 2. \"Color Matcher\" - A puzzle game where you've got this color-changing blob, and you..." },
            { role: 'user', message: "Okay. Let's make the first one." },
            { role: 'ai', message: "Awesome choice, my dude! \"Gravity Flip\" it is! Let's flesh this bad boy out and make it pop. I'm stoked to help you design this gravity-defying masterpiece! So, let's break it down:..." },
          ]);

          setDescription("A platformer where you can only jump and flip gravity. The player navigates through levels by switching between floor and ceiling.");
        } else {
          await navigator.mediaDevices.getUserMedia({ audio: true });

          const conversation = await Conversation.startSession({
            agentId: "8MFPKeCEf8q2bVQWbIJS",
            onConnect: () => {
              setStatus("connected");
            },
            onDisconnect: () => {
              setStatus("disconnected");
            },
            onError: (error) => {
              console.error("Error:", error);
            },
            onModeChange: (mode) => {
              setAgentStatus(mode.mode);
            },
            onMessage: (props: { message: string; source: Role; }) => {
              console.log("Received message:", props);
              setTranscript(prev => [...prev, {
                role: props.source,
                message: props.message
              }]);
            }
          });

          conversationRef.current = conversation;
        }
      } catch (error) {
        console.error("Failed to start conversation:", error);
      }
    };

    startConversation();

    return () => {
      if (conversationRef.current) {
        conversationRef.current.endSession();
        conversationRef.current = null;
      }
    };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-background z-50"
    >
      <div className="absolute inset-0 flex flex-col h-full p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="hover:bg-accent"
          >
            <X className="w-6 h-6" />
          </Button>
          <div className="flex items-center gap-5 text-md font-light text-muted-foreground">
            <span>Mode: {agentStatus}</span>
            <span>Status: {status}</span>
          </div>
        </div>

        {/* Primary Content */}
        <div className="overflow-y-auto flex flex-col items-center justify-between flex-1 bg-accent/5 rounded-lg p-6 mb-4 gap-4">
            {transcript.length === 0 ? (
              <div className="flex items-center justify-center h-full text-lg font-light text-muted-foreground">
                Start talking to create your game...
              </div>
            ) : (
              <div className="space-y-4">
                {transcript.map((message, index) => (
                  <div
                    key={index}
                    className={`flex flex-col ${
                      message.role === 'user' ? 'items-end' : 'items-start'
                    }`}
                  >
                    <div
                      className={`px-4 py-2 rounded-lg ${
                        message.role === 'user'
                          ? 'bg-muted text-accent-foreground font-light'
                          : 'outline outline-1 outline-muted text-muted-foreground font-light'
                      }`}
                    >
                      {message.message}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        {/* Footer with Create Game Button */}
        <div className="flex flex-col items-center justify-center pb-4 p-6 gap-4">
            <div className="px-4 py-2 rounded-lg text-xl bg-primary text-primary-foreground font-medium">
              {description}
            </div>
          <Button
            size="xl"
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-medium"
          >
            Create Game
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default VoiceAI;
