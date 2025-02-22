
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useEffect, useRef } from "react";

interface ConvAIWidgetProps {
  onClose: () => void;
}

const ConvAIWidget = ({ onClose }: ConvAIWidgetProps) => {
  const agentRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    // Start the conversation automatically when the component mounts
    setTimeout(() => {
      const agent = document.querySelector('elevenlabs-convai');
      if (agent) {
        agentRef.current = agent;
        // @ts-ignore - startConversation is a custom method from ElevenLabs
        agent.startConversation();
      }
    }, 1000); // Small delay to ensure the agent is properly mounted

    // Cleanup function
    return () => {
      if (agentRef.current) {
        // @ts-ignore - endConversation is a custom method from ElevenLabs
        agentRef.current.endConversation();
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
          className="relative w-full max-w-3xl bg-background rounded-2xl shadow-2xl"
        >
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 top-4 z-10"
            onClick={onClose}
          >
            <X className="w-5 h-5" />
          </Button>
          
          <div className="p-6">
            <elevenlabs-convai agent-id="8MFPKeCEf8q2bVQWbIJS"></elevenlabs-convai>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ConvAIWidget;
