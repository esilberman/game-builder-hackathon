import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Home, Send } from "lucide-react";
import { Link } from "react-router-dom";
import { useGameCode } from '@/ai/codeContext';

const Edit = () => {
  const { gameCode } = useGameCode();

  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim()) return;
    // Handle send logic here
    setInput("");
  };

  useEffect(() => {
    console.log('gameCode: ', gameCode);
  }, [gameCode]);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Header */}
      <div className="p-4 border-b">
        <Link to="/">
          <Button variant="ghost" size="icon" className="hover:bg-accent">
            <Home className="w-5 h-5" />
          </Button>
        </Link>
      </div>

      {/* Main Stage */}
      <div className="flex-1 p-4 bg-accent/5">
        {/* Game preview will go here */}
        {/* Display the generated game code */}
        {gameCode && 
            <div className="w-full h-full text-foreground font-light">
                {gameCode}
            </div>
        }
      </div>

      {/* Input Area */}
      <div className="p-4 border-t flex gap-2">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a command..."
          className="flex-1"
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
        />
        <Button onClick={handleSend}>
          <Send className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
};

export default Edit;