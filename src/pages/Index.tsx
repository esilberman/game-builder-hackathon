import { useState } from "react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Gamepad2, Wand2 } from "lucide-react";
import ConvAIWidget from "@/components/ConvAIWidget";

const Index = () => {
  const [showAgent, setShowAgent] = useState(false);

  return (
    <div className="min-h-screen bg-background text-foreground relative overflow-hidden">
      <div className="hero-pattern absolute inset-0 opacity-50" />
      <div className="hero-gradient absolute inset-0" />
      
      <main className="relative container mx-auto px-4 pt-32 pb-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-4xl mx-auto"
        >
          <div className="inline-block mb-6">
            <div className="glass rounded-full px-6 py-2 text-sm font-light text-grey-400">
              AI Game Studio in Your Pocket
            </div>
          </div>
          
          <h1 className="font-display text-8xl md:text-10xl font-medium text-white mb-6 tracking-tight text-glow">
            AI 
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 text-transparent bg-clip-text">
              &nbsp;Game&nbsp;
            </span>
            Maker
          </h1>
          
          <p className="text-lg md:text-3xl font-thin text-white mb-12 max-w-2xl mx-auto">
            Go from idea to playable game in seconds.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              size="lg"
              onClick={() => setShowAgent(true)}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-6 px-8 rounded-xl transition-all duration-200 transform hover:scale-105 flex items-center gap-2"
            >
              <Wand2 className="w-5 h-5" />
              Create New Game
            </Button>
            
            <Button
              variant="outline"
              size="lg"
              className="glass hover:bg-white/10 font-semibold py-6 px-8 rounded-xl transition-all duration-200 flex items-center gap-2"
            >
              <Gamepad2 className="w-5 h-5" />
              Browse Games
            </Button>
          </div>
        </motion.div>
      </main>

      {showAgent && <ConvAIWidget onClose={() => setShowAgent(false)} />}
    </div>
  );
};

export default Index;
