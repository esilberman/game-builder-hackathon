import React, { useState, useEffect, useRef } from "react";
import { Excalidraw } from "@excalidraw/excalidraw";
import { Button } from "@/components/ui/button";
import { MousePointer, Pen, PaintBucket, Image } from "lucide-react";

type Tool = "select" | "draw-path" | "draw-fill" | "image";

const colors = {
  black: '#000000',
  grey: '#7f7f7f',
  white: '#FFFFFF',
  red: '#FF4848',
  orange: '#F99716',
  yellow: '#ffe640',
  green: '#4CAF50',
  aqua: '#20d3e3',
  blue: '#3867ff',
  purple: '#8f49f2',
  pink: '#fc5dba',
  paleSkin: '#F9DCC4',
  brown: '#B07D62',
  darkBrown: '#5D4037',
};

const thickness = {
  xs: 1,
  sm: 2,
  md: 4,
  lg: 10,
};

export const Art = () => {
  const [excalidrawAPI, setExcalidrawAPI] = useState(null);
  const [activeTool, setActiveTool] = useState("select");
  const [selectedColor, setSelectedColor] = useState("black");
  const [selectedThickness, setSelectedThickness] = useState("sm");
  const rightCanvasRef = useRef<HTMLCanvasElement>(null);

  const handleToolClick = (tool: Tool) => {
    setActiveTool(tool);
    // Update Excalidraw tool based on selection
    console.log('Changing tool to:', tool);
    if (excalidrawAPI) {
      if (tool === 'select') {
        excalidrawAPI.setActiveTool({ type: "selection" });
      } else if (tool === 'draw-path') {
        excalidrawAPI.setActiveTool({ 
          type: "freedraw",
          customType: null,
          locked: false,
        });
      } else if (tool === 'draw-fill') {
        // For fill tool, use freedraw with fill settings
        excalidrawAPI.setActiveTool({ 
          type: "freedraw",
          customType: "fill",
          locked: false,
        });
        // Configure the fill settings
        excalidrawAPI.updateScene({
          appState: {
            currentItemFillStyle: "solid",
            currentItemStrokeStyle: "solid",
            currentItemStrokeWidth: 2,
            currentItemRoughness: 0,
            currentItemOpacity: 100,
            currentItemBackgroundColor: excalidrawAPI.getAppState().currentItemStrokeColor,
          }
        });
      } else if (tool === 'image') {
        excalidrawAPI.setActiveTool({ type: "image" });
      }
    }
  };

  const handleColorClick = (color: string) => {
    setSelectedColor(color);
  };

  const handleThicknessClick = (thickness: string) => {
    setSelectedThickness(thickness);
  };

  // Update tool whenever activeTool changes
  useEffect(() => {
    console.log('Active tool changed:', activeTool);
    if (excalidrawAPI) {
      if (activeTool === 'select') {
        excalidrawAPI.setActiveTool({ type: "selection" });
      } else if (activeTool === 'draw-path') {
        excalidrawAPI.setActiveTool({ 
          type: "freedraw",
          customType: null,
          locked: false,
        });
      } else if (activeTool === 'draw-fill') {
        // For fill tool, use freedraw with fill settings
        excalidrawAPI.setActiveTool({ 
          type: "freedraw",
          customType: "fill",
          locked: false,
        });
        // Configure the fill settings
        excalidrawAPI.updateScene({
          appState: {
            currentItemFillStyle: "solid",
            currentItemStrokeStyle: "solid",
            currentItemStrokeWidth: 2,
            currentItemRoughness: 0,
            currentItemOpacity: 100,
            currentItemBackgroundColor: excalidrawAPI.getAppState().currentItemStrokeColor,
          }
        });
      } else if (activeTool === 'image') {
        excalidrawAPI.setActiveTool({ type: "image" });
      }
    }
  }, [activeTool, excalidrawAPI]);

  return (
    <div className="w-full h-full flex flex-col justify-between overflow-hidden">
      {/* Main content area with two panels */}
      <div className="flex flex-row gap-2 p-4 max-w-full max-h-full min-w-0 min-h-0 overflow-hidden items-center justify-center mt-auto mb-auto">
        {/* Left panel - Excalidraw */}
        <div className="flex-1 aspect-square min-w-0 min-h-0">
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
        <div className="flex-1 aspect-square min-w-0 min-h-0">
          <canvas
            ref={rightCanvasRef}
            className="w-full h-full bg-muted-foreground border border-accent/20"
          />
        </div>
      </div>

      {/* Bottom Toolbar */}
      <div className="bottom-toolbar flex flex-row p-2 gap-2 justify-center align-end ml-auto mr-auto">
        <div className="bg-secondary flex flex-row p-2 gap-2 justify-center align-center rounded-sm">
          <Button
            variant={activeTool === "select" ? "default" : "ghost"}
            size="icon"
            onClick={() => handleToolClick("select")}
            className="hover:bg-accent"
          >
            <MousePointer className="w-5 h-5" />
          </Button>
          <Button
            variant={activeTool === "draw-path" ? "default" : "ghost"}
            size="icon"
            onClick={() => handleToolClick("draw-path")}
            className="hover:bg-accent"
          >
            <Pen className="w-5 h-5" />
          </Button>
          {/* <Button
            variant={activeTool === "draw-fill" ? "default" : "ghost"}
            size="icon"
            onClick={() => handleToolClick("draw-fill")}
            className="hover:bg-accent"
          >
            <PaintBucket className="w-5 h-5" />
          </Button> */}
          <Button
            variant={activeTool === "image" ? "default" : "ghost"}
            size="icon"
            onClick={() => handleToolClick("image")}
            className="hover:bg-accent"
          >
            <Image className="w-5 h-5" />
          </Button>
        </div>
        <div className="bg-secondary flex flex-row p-2 gap-4 justify-center align-center rounded-sm m-auto">
          <div className="grid grid-cols-7 gap-2">
            {Object.entries(colors).map(([colorName, colorCode]) => (
              <Button
                key={colorName}
                variant={colorName === selectedColor ? "default" : "ghost"}
                size="xs"
                onClick={() => handleColorClick(colorName)}
                className="hover:bg-accent"
                style={{ backgroundColor: colorCode }}
              />
            ))}
          </div>
          <div>
            {Object.entries(thickness).map(([thicknessName, thicknessVal]) => (
              <Button
                key={thicknessName}
                variant={thicknessName === selectedThickness ? "default" : "ghost"}
                size="sm"
                onClick={() => handleThicknessClick(thicknessName)}
                className="hover:bg-accent"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width={thicknessVal} stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-minus"><path d="M5 12h14"/></svg>
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
