import { useState } from "react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Gamepad2, Wand2, Plus } from "lucide-react";
import VoiceAI from "@/components/ai/VoiceAI";
import { useToast } from '@/components/ui/use-toast';
import { generateAICode } from '@/components/ai/GameAI';
import { useNavigate } from 'react-router-dom';
import { useGameCode } from '@/components/ai/codeContext';

const Initial = () => {
  const [showAgent, setShowAgent] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { gameCode, setGameCode } = useGameCode();

  const handleCreateGame = async (description: string) => {
    if (!description) {
      toast({
        title: "Error",
        description: "No game description available. Please chat with the AI first to define your game.",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await generateAICode(description);

      if (!response) {
        throw new Error('Failed to generate game');
      }

      // Store the generated game response
      setGameCode(response.content);

      // Navigate to edit page after successful generation
      setShowAgent(false);
      navigate('/edit');
    } catch (error) {
      console.error('Error generating game:', error);
      toast({
        title: "Error",
        description: "Failed to generate your game. Please try again.",
        variant: "destructive",
      });
    }
  };

  return <div className="min-h-screen bg-background text-foreground relative overflow-hidden">
      <div className="hero-pattern absolute inset-0 opacity-50" />
      <div className="hero-gradient absolute inset-0" />
      <main className="relative container mx-auto px-4 pt-24 pb-32">
        <motion.div initial={{
        opacity: 0,
        y: 20
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        duration: 0.6
      }} className="text-center max-w-5xl mx-auto">
          <div className="inline-block mb-6">
            <div className="glass rounded-full px-6 py-2 text-sm font-light text-grey-400">
              An Arcade in Your Pocket
            </div>
          </div>
          <h1 className="flex flex-row justify-center flex-wrap font-display text-9xl font-medium text-white mb-6 tracking-tight text-glow">
            AI&nbsp;
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 text-transparent bg-clip-text">
              Game
            </span>
            &nbsp;Maker
          </h1>
          <p className="text-m md:text-5xl font-thin text-grey-300 mb-12 mx-auto">
            Idea to playable game in seconds.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button size="xl" onClick={() => setShowAgent(true)} className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white py-6 px-8 rounded-xl transition-all duration-200 transform hover:scale-105 flex items-center gap-2 font-medium">
              <Plus className="w-5 h-5" />
              Create Game
            </Button>
          
          </div>
        </motion.div>
      </main>

      {showAgent && <VoiceAI onClose={() => setShowAgent(false)} onCreateGame={handleCreateGame} />}  
    </div>;
};
export default Initial;