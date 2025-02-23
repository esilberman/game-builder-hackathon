import React, { useState, useEffect, useRef } from "react";
import { Excalidraw } from "@excalidraw/excalidraw";
import { Button } from "@/components/ui/button";
import { MousePointer, Pen, PaintBucket, Image } from "lucide-react";

type Tool = "select" | "draw-stroke" | "draw-fill" | "image";

export const Art = () => {
  const [excalidrawAPI, setExcalidrawAPI] = useState(null);
  const [activeTool, setActiveTool] = useState("select");
  const rightCanvasRef = useRef<HTMLCanvasElement>(null);

  const handleToolClick = (tool: Tool) => {
    setActiveTool(tool);
  };

  return (
    <div className="w-full h-full flex flex-col justify-between">
      {/* Main content area with two panels */}
      <div className="flex flex-row flex-grow gap-2 p-4">
        {/* Left panel - Excalidraw */}
        <div className="flex-1 aspect-square rounded-sm">
          <Excalidraw 
            theme="light" 
            excalidrawAPI={(api)=> setExcalidrawAPI(api)}
            // viewModeEnabled={true}
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
            }}
          />
        </div>

        {/* Right panel - Canvas */}
        <div className="flex-1 aspect-square">
          <canvas
            ref={rightCanvasRef}
            className="w-full h-full bg-muted-foreground rounded-sm border border-accent/20"
          />
        </div>
      </div>

      {/* Bottom Toolbar */}
      <div className="input-area p-2 flex gap-2 bg-black justify-center justify-items-center">
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
