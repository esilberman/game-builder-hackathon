
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Conversation } from "@11labs/client";

interface ConvAIWidgetProps {
  onClose: () => void;
}

const ConvAIWidget = ({ onClose }: ConvAIWidgetProps) => {
  const conversationRef = useRef<Conversation | null>(null);
  const [status, setStatus] = useState<string>("disconnected");
  const [agentStatus, setAgentStatus] = useState<string>("listening");

  useEffect(() => {
    const startConversation = async () => {
      try {
        // Request microphone permission
        await navigator.mediaDevices.getUserMedia({ audio: true });

        // Start the conversation
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
        });

        conversationRef.current = conversation;
      } catch (error) {
        console.error("Failed to start conversation:", error);
      }
    };

    startConversation();

    // Cleanup function
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
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
    >
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="relative w-full max-w-3xl bg-background rounded-2xl shadow-2xl p-6"
        >
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 top-4 z-10"
            onClick={onClose}
          >
            <X className="w-5 h-5" />
          </Button>

          <div className="space-y-4">
            <div className="flex items-center justify-between text-sm">
              <p>Status: {status}</p>
              <p>Agent: {agentStatus}</p>
            </div>
            
            <div className="aspect-video bg-muted rounded-lg overflow-hidden">
              {/* This will be your chat interface or visualization */}
              <div className="h-full flex items-center justify-center text-muted-foreground">
                {status === "connected" ? (
                  agentStatus === "speaking" ? (
                    "AI is speaking..."
                  ) : (
                    "Listening..."
                  )
                ) : (
                  "Connecting..."
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ConvAIWidget;
