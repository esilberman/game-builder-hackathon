
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
      
      <main className="relative container mx-auto px-4 pt-20 pb-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto"
        >
          <div className="inline-block mb-6">
            <div className="glass rounded-full px-6 py-2 text-sm font-medium text-purple-300">
              AI-Powered Game Creation
            </div>
          </div>
          
          <h1 className="font-display text-6xl md:text-7xl font-bold mb-6 tracking-tight text-glow">
            Create Your Dream Game
            <br /> 
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 text-transparent bg-clip-text">
              in Seconds
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-gray-400 mb-12 max-w-2xl mx-auto">
            Transform your game ideas into reality with AI. No coding required.
            Just describe your vision and watch it come to life.
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
