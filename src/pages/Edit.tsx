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
  const [tab, setTab] = useState("game");

  const handleSend = () => {
    if (!input.trim()) return;
    // Handle send logic here
    setInput("");
  };

  useEffect(() => {
    console.log('gameCode: ', gameCode);
  }, [gameCode]);

  return (
    <div className="h-screen bg-background text-foreground flex flex-col">
      {/* Top Bar */}
      <div className="top-0 w-screen flex flex-row align-center justify-between p-2">
        <Link to="/">
          <Button variant="ghost" size="icon" className="hover:bg-accent">
            <ChevronLeft className="w-5 h-5" />
          </Button>
        </Link>
        <Tabs defaultValue="game">
            <TabsList>
              <TabsTrigger value="game" onClick={() => setTab('game')}>Game</TabsTrigger>
              <TabsTrigger value="code" onClick={() => setTab('code')}>Code</TabsTrigger>
            </TabsList>
        </Tabs>
        <Button variant="ghost" size="icon" className="hover:bg-accent">
            <RefreshCw className="w-5 h-5" />
        </Button>
      </div>

      {/* Main Stage */}
      <div className="main-stage flex-1 max-w-screen p-2">
          {tab === "game" ? (
              <iframe
                srcDoc={gameCode}
                className="w-full h-full rounded-lg border border-accent/20"
                title="Game"
                sandbox="allow-scripts allow-same-origin"
              />
          ) : (
              <div className="w-full h-full text-foreground font-light overflow-y-scroll">
                {gameCode}
              </div>
           )}
      </div>

      {/* Input Area */}
      <div className="input-area bottom-0 w-full p-2 flex gap-2 bg-black">
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