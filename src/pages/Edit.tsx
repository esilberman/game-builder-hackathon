import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronLeft, ArrowUp, RefreshCw } from "lucide-react";
import { Link } from "react-router-dom";
import { useGameCode } from '@/components/ai/codeContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
      {/* Top Bar */}
      <div className="flex flex-row align-center justify-between p-2">
        <Link to="/">
          <Button variant="ghost" size="icon" className="hover:bg-accent">
            <ChevronLeft className="w-5 h-5" />
          </Button>
        </Link>
        <Tabs defaultValue="game">
            <TabsList>
              <TabsTrigger value="game">Game</TabsTrigger>
              <TabsTrigger value="code">Code</TabsTrigger>
            </TabsList>
        </Tabs>
        <Button variant="ghost" size="icon" className="hover:bg-accent">
            <RefreshCw className="w-5 h-5" />
        </Button>
      </div>

      {/* Main Stage */}
      <div className="flex-1 p-4 bg-accent/5">
          <Tabs defaultValue="game">
            <TabsContent value="game">
              <iframe
                srcDoc={gameCode}
                className="w-full h-full rounded-lg border border-accent/20"
                title="Game"
                sandbox="allow-scripts allow-same-origin"
              />
            </TabsContent>
            <TabsContent value="code">
              <div className="w-full h-full text-foreground font-light overflow-y-scroll">
                {gameCode}
              </div>
            </TabsContent>
          </Tabs>
      </div>

      {/* Input Area */}
      <div className="p-2 flex gap-2">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a command..."
          className="flex-1 h-auto"
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
        />
        <Button onClick={handleSend}>
          <ArrowUp className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
};

export default Edit;