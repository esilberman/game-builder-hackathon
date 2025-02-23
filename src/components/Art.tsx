import React, { useState, useEffect } from "react";
import { Excalidraw } from "@excalidraw/excalidraw";
import { Button } from "@/components/ui/button";
import { MousePointer, Pen, PaintBucket, Image } from "lucide-react";

type Tool = "select" | "draw-stroke" | "draw-fill" | "image";

export const Art = () => {
  const [excalidrawAPI, setExcalidrawAPI] = useState(null);
  const [activeTool, setActiveTool] = useState("select");

  useEffect(() => {
    const appMenu = document.querySelector('.App-menu');
    appMenu?.setAttribute('style', 'display: none !important');
  }, []);

  const handleToolClick = (tool: Tool) => {
    setActiveTool(tool);
  };

  return (
    <div className="w-full h-full min-h-[500px] bg-background p-4">
      <div className="w-full h-full glass rounded-lg overflow-hidden">
        <Excalidraw 
          theme="light" 
          excalidrawAPI={(api)=> setExcalidrawAPI(api)}
          viewModeEnabled={true}
          UIOptions={{
            canvasActions: {
              changeViewBackgroundColor: false,
              clearCanvas: false,
              export: false,
              loadScene: false,
              saveToActiveFile: false,
              toggleTheme: false,
              saveAsImage: false,
            },
            dockedSidebarBreakpoint: 0, // Disable docked sidebar
          }}
        />
      </div>

       {/* Bottom Toolbar */}
       <div className="absolute input-area bottom-0 w-full p-2 flex gap-2 bg-black justify-center justify-items-center">
        <Button
          variant={activeTool === "select" ? "default" : "ghost"}
          size="icon"
          onClick={() => handleToolClick("select")}
          className="hover:bg-accent"
        >
          <MousePointer className="w-5 h-5" />
        </Button>
        <Button
          variant={activeTool === "draw-stroke" ? "default" : "ghost"}
          size="icon"
          onClick={() => handleToolClick("draw-stroke")}
          className="hover:bg-accent"
        >
          <Pen className="w-5 h-5" />
        </Button>
        <Button
          variant={activeTool === "draw-fill" ? "default" : "ghost"}
          size="icon"
          onClick={() => handleToolClick("draw-fill")}
          className="hover:bg-accent"
        >
          <PaintBucket className="w-5 h-5" />
        </Button>
        <Button
          variant={activeTool === "image" ? "default" : "ghost"}
          size="icon"
          onClick={() => handleToolClick("image")}
          className="hover:bg-accent"
        >
          <Image className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
};
