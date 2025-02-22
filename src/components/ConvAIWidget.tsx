
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useConversation } from "@11labs/react";
import { useEffect } from "react";

interface ConvAIWidgetProps {
  onClose: () => void;
}

const ConvAIWidget = ({ onClose }: ConvAIWidgetProps) => {
  const conversation = useConversation();

  useEffect(() => {
    const startAgent = async () => {
      try {
        // Start the conversation with our game creation agent
        await conversation.startSession({
          agentId: "8MFPKeCEf8q2bVQWbIJS"
        });
      } catch (error) {
        console.error("Failed to start conversation:", error);
      }
    };

    startAgent();

    // Cleanup when component unmounts
    return () => {
      conversation.endSession();
    };
  }, [conversation]);

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
            onClick={() => {
              conversation.endSession();
              onClose();
            }}
          >
            <X className="w-5 h-5" />
          </Button>
          
          <div className="text-center mb-6">
            <h2 className="text-2xl font-display font-bold">Describe Your Game</h2>
            <p className="text-gray-400">Tell me about the game you want to create</p>
          </div>

          {conversation.status === "connected" ? (
            <div className="h-96 flex items-center justify-center">
              {conversation.isSpeaking ? (
                <div className="text-center text-gray-400">AI is speaking...</div>
              ) : (
                <div className="text-center text-gray-400">Listening...</div>
              )}
            </div>
          ) : (
            <div className="h-96 flex items-center justify-center">
              <div className="text-center text-gray-400">Connecting to AI...</div>
            </div>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ConvAIWidget;
