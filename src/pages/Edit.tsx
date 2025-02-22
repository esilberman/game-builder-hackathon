
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Home, Send } from "lucide-react";
import { Link, useLocation, Navigate } from "react-router-dom";

const Edit = () => {
  const location = useLocation();
  const [input, setInput] = useState("");

  // Get the game code and description from navigation state
  const gameData = location.state as { gameCode: string; description: string } | null;

  const handleSend = () => {
    if (!input.trim()) return;
    // Handle send logic here
    setInput("");
  };

  // If there's no game data, redirect to home
  if (!gameData) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Header */}
      <div className="p-4 border-b flex justify-between items-center">
        <Link to="/">
          <Button variant="ghost" size="icon" className="hover:bg-accent">
            <Home className="w-5 h-5" />
          </Button>
        </Link>
        <div className="text-sm font-light text-muted-foreground">
          {gameData.description}
        </div>
      </div>

      {/* Main Stage */}
      <div className="flex-1 p-4 bg-accent/5">
        <iframe
          srcDoc={gameData.gameCode}
          className="w-full h-full rounded-lg border border-accent/20"
          title="Game Preview"
          sandbox="allow-scripts allow-same-origin"
        />
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
