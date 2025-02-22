
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Conversation } from "@11labs/client";

interface VoiceAIProps {
  onClose: () => void;
}

const VoiceAI = ({ onClose }: VoiceAIProps) => {
  const conversationRef = useRef<Conversation | null>(null);
  const [status, setStatus] = useState<string>("disconnected");
  const [agentStatus, setAgentStatus] = useState<string>("listening");
  const [transcript, setTranscript] = useState<Array<{ role: 'user' | 'agent', text: string }>>([]);

  useEffect(() => {
    const startConversation = async () => {
      try {
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
          onMessage: (message) => {
            if (message.role && message.text) {
              setTranscript(prev => [...prev, { role: message.role, text: message.text }]);
            }
          }
        });

        conversationRef.current = conversation;
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
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span>Status: {status}</span>
            <span>Mode: {agentStatus}</span>
          </div>
        </div>

        {/* Transcript Area */}
        <div className="flex-1 overflow-y-auto bg-accent/5 rounded-lg p-6 mb-4">
          {transcript.length === 0 ? (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              Start speaking to create your game...
            </div>
          ) : (
            <div className="space-y-4">
              {transcript.map((message, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg ${
                    message.role === "agent"
                      ? "bg-accent/10 ml-8"
                      : "bg-primary/10 mr-8"
                  }`}
                >
                  <div className="font-medium mb-1 text-sm">
                    {message.role === "agent" ? "AI Assistant" : "You"}
                  </div>
                  <div className="text-sm">{message.text}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer with Create Game Button */}
        <div className="flex justify-center pb-4">
          <Button
            size="lg"
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
          >
            Create Game
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default VoiceAI;
