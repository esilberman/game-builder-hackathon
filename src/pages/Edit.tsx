import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronLeft, ArrowUp, RefreshCw } from "lucide-react";
import { Link } from "react-router-dom";
import { useGameCode } from '@/components/codeContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { generateAICode } from "@/components/CodeAI";
import { useToast } from "@/components/ui/use-toast";
import example from "@/data/example.json";
import { Skeleton } from "@/components/ui/skeleton";
import { Art } from "@/components/Art";

const DEBUG = false;

const Edit = () => {
  const { gameCode, setGameCode } = useGameCode();
  const [input, setInput] = useState("");
  const [tab, setTab] = useState("game");
  const [code, setCode] = useState("");
  const { toast } = useToast();
  const [iframeKey, setIframeKey] = useState(0);

  useEffect(() => {
    if (DEBUG) {
      setGameCode(example.code);
    }
  }, []);

  const handleSend = async () => {
    if (!input.trim()) return;
    
    try {
      // Combine the current code and user input for the new prompt
      const prompt = `${input}\n\nCODE:\n${code}`;
      
      // Generate new code using the game AI
      const result = await generateAICode(prompt);
      
      if (result?.content) {
        // Extract and set the new code
        setGameCode(result.content);
        const newCode = extractCode(result.content);
        setCode(newCode);
        
        // Clear input after successful generation
        setInput("");
        
        // toast({
        //   title: "Game updated",
        //   description: "Your changes have been applied to the game",
        // });
      }
    } catch (error) {
      console.error("Error generating game:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update the game. Please try again.",
      });
    }
  };

  useEffect(() => {
    console.log('gameCode: ', gameCode);
    if (gameCode) {
      extractCode(gameCode);
    }
  }, [gameCode]);

  const extractCode = (raw: string | null) => {
    if (!raw) return "";
    
    const start = raw.indexOf('<!DOCTYPE html>');
    const end = raw.indexOf('</html>');

    let extractedCode = raw;
    if (end > 0) {
        extractedCode = raw.slice(start, end + '</html>'.length);
    } else {
        extractedCode = raw.slice(start);
    }

    // No HTML? Something went wrong
    if (extractedCode.length < 100) {
        throw Error('Unable to extract code from response: ' + raw);
    }

    console.log('Extracted code: ', extractedCode);
    setCode(extractedCode);
    return extractedCode;
  };

  const refreshIframe = () => {
    const iframe = document.getElementById('game-iframe') as HTMLIFrameElement;
    if (iframe) {
      setIframeKey(prevKey => prevKey + 1);
    }
  };

  return (
    <div className="h-screen max-h-screen bg-background text-foreground flex flex-col">
      {/* Top Bar */}
      <div className="top-0 w-screen flex flex-row align-center justify-between p-2">
        <Link to="/">
          <Button variant="ghost" size="icon" className="hover:bg-accent">
            <ChevronLeft className="w-5 h-5" />
          </Button>
        </Link>
        <Tabs defaultValue="game" value={tab}>
            <TabsList>
              <TabsTrigger value="game" onClick={() => setTab('game')}>Game</TabsTrigger>
              <TabsTrigger value="code" onClick={() => setTab('code')}>Code</TabsTrigger>
              <TabsTrigger value="art" onClick={() => setTab('art')}>Art</TabsTrigger>
            </TabsList>
        </Tabs>
        {(tab === "game" || tab === "code") ? (
            <Button variant="ghost" size="icon" className="hover:bg-accent" onClick={refreshIframe}>
                <RefreshCw className="w-5 h-5" />
            </Button>
        ) : (
            <div></div>
        )}
      </div>

      {/* Main Stage */}
      <div className="main-stage flex-1 max-w-screen p-2">
          {tab === "game" ? (
            code ? (
              <iframe
                id="game-iframe"
                key={iframeKey}
                srcDoc={code}
                className="w-full h-full rounded-sm border border-accent/20"
                title="Game"
                sandbox="allow-scripts allow-same-origin"
              />
            ) : (
              <Skeleton className="w-full h-full rounded-sm border border-accent/20" />
            )
          ) : tab === "code" ? (
              <div className="w-full h-full text-foreground font-light overflow-y-scroll">
                <pre className="pre-wrap break-all p-2">{code}</pre>
              </div>
           ) : (
              <Art />
           )}
      </div>

      {/* Bottom Toolbar */}
      {(tab === "game" || tab === "code") && (
          <div className="input-area bottom-0 w-full p-2 flex gap-2 bg-black">
            <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Make a change..."
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
        )}
    </div>
  );
};

export default Edit;
