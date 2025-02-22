import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
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

const VoiceAI = ({ onClose }: VoiceAIProps) => {
  const conversationRef = useRef<Conversation | null>(null);
  const [status, setStatus] = useState<string>("disconnected");
  const [agentStatus, setAgentStatus] = useState<string>("listening");
  const [transcript, setTranscript] = useState<Message[]>([]);

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
          onMessage: (props: { message: string; source: Role; }) => {
            console.log("Received message:", props);
            setTranscript(prev => [...prev, {
              role: props.source,
              message: props.message
            }]);
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
          <div className="flex items-center gap-5 text-md font-light text-muted-foreground">
            <span>Mode: {agentStatus}</span>
            <span>Status: {status}</span>
          </div>
        </div>

        {/* Transcript Area */}
        <div className="flex-1 overflow-y-auto bg-accent/5 rounded-lg p-6 mb-4">
          {transcript.length === 0 ? (
            <div className="flex items-center justify-center h-full text-lg font-medium text-muted-foreground">
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
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted'
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
        <div className="flex justify-center pb-4">
          <Button
            size="lg"
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
