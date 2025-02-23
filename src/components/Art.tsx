import React, { useState, useEffect, useRef } from "react";
import { Excalidraw, exportToBlob } from "@excalidraw/excalidraw";
import { Button } from "@/components/ui/button";
import { MousePointer, Pen, PaintBucket, Image } from "lucide-react";
import { Input } from "./ui/input";

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

const thickness = [1, 2, 4, 10];

interface ArtProps {
  onExport?: (userPng: string, input: string) => void;
}

export const Art = ({ onExport }: ArtProps) => {
  const [excalidrawAPI, setExcalidrawAPI] = useState(null);
  const [activeTool, setActiveTool] = useState("select");
  const [selectedColor, setSelectedColor] = useState("black");
  const [selectedThickness, setSelectedThickness] = useState(2);
  const [input, setInput] = useState('');
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
            currentItemStrokeWidth: selectedThickness,
            currentItemRoughness: 0,
            currentItemOpacity: 100,
            currentItemBackgroundColor: selectedColor,
          }
        });
      } else if (tool === 'image') {
        excalidrawAPI.setActiveTool({ type: "image" });
      }
    }
  };

  const handleColorClick = (color: string) => {
    setSelectedColor(color);
    console.log('Changing color to:', color);
    excalidrawAPI.updateScene({
      appState: {
        currentItemStrokeColor: color,
        currentItemFillColor: color,
      }
    });
  };

  const handleThicknessClick = (thickness: number) => {
    setSelectedThickness(thickness);
    console.log('Changing thickness to:', thickness);
    excalidrawAPI.updateScene({
      appState: {
        currentItemStrokeWidth: thickness,
      }
    });
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
            currentItemStrokeWidth: selectedThickness,
            currentItemRoughness: 0,
            currentItemOpacity: 100,
            currentItemBackgroundColor: selectedColor,
          }
        });
      } else if (activeTool === 'image') {
        excalidrawAPI.setActiveTool({ type: "image" });
      }
    }
  }, [activeTool, excalidrawAPI]);

  const exportPng = async () => {
    if (!excalidrawAPI) return;
    
    try {
      const elements = excalidrawAPI.getSceneElements();
      if (!elements || !elements.length) {
        console.log('No elements to export');
        return;
      }

      const blob = await exportToBlob({
        elements,
        appState: {
          exportWithDarkMode: false,
        },
        files: excalidrawAPI.getFiles(),
        getDimensions: () => ({ width: 400, height: 400 }),
        mimeType: "image/png",
      });
      console.log('userPng Blob: ', blob);
      
      const url = URL.createObjectURL(blob);
      console.log('userPng URL: ', url);
      if (onExport) {
        onExport(url, input);
      }
    } catch (error) {
      console.error('Error exporting PNG:', error);
    }
  };

  useEffect(() => {
    const handleExportPngEvent = () => {
      exportPng();
    };

    const excalidrawElement = document.querySelector('.excalidraw');
    if (excalidrawElement) {
      excalidrawElement.addEventListener('exportPng', handleExportPngEvent);
      return () => {
        excalidrawElement.removeEventListener('exportPng', handleExportPngEvent);
      };
    }
  }, [excalidrawAPI]);

  return (
    <div className="w-full h-full flex flex-col justify-between overflow-hidden">
      {/* Main content area with two panels */}
      <div className="input-area p-4 flex gap-2 w-fit-content">
        <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Describe your drawing..."
            className="flex-1 h-auto"
        />
      </div>
      <div className="flex flex-row gap-2 p-4 pt-0 max-w-full max-h-full min-w-0 min-h-0 overflow-hidden items-center justify-center mb-auto">
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
      <div className="bottom-toolbar flex flex-row gap-2 justify-between align-end">
        <div className="bg-secondary flex flex-row p-2 gap-2 justify-center align-center rounded-sm ml-auto mr-auto">
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
        <div className={`bg-secondary flex flex-row p-2 gap-4 justify-center align-center rounded-sm m-auto ${activeTool.startsWith('draw-') ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
          <div className="grid grid-cols-7 gap-1 gap-x-2">
            {Object.entries(colors).map(([colorName, colorCode]) => (
              <Button
                key={colorName}
                variant={colorName === selectedColor ? "default" : "outline"}
                size="xs"
                onClick={() => handleColorClick(colorName)}
                className="hover:bg-accent"
                style={{ backgroundColor: colorCode }}
              />
            ))}
          </div>
          <div className="m-auto">
            {thickness.map((thicknessVal) => (
              <Button
                key={thicknessVal}
                variant={thicknessVal === selectedThickness ? "default" : "ghost"}
                size="sm"
                onClick={() => handleThicknessClick(thicknessVal)}
                className="hover:bg-accent"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={thicknessVal} strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/></svg>
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
