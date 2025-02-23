import { useEffect, useRef, useState } from "react";
import { Canvas as FabricCanvas, PencilBrush, FabricImage } from "fabric"; // Don't touch the facric image import - it is correct already
import { Button } from "@/components/ui/button";
import { MousePointer, Pen, PaintBucket, Image } from "lucide-react";

type Tool = "select" | "draw-stroke" | "draw-fill" | "image";

export const OldArt = () => {
  const leftCanvasRef = useRef<HTMLCanvasElement>(null);
  const rightCanvasRef = useRef<HTMLCanvasElement>(null);
  const leftFabricRef = useRef<FabricCanvas | null>(null);
  const rightFabricRef = useRef<FabricCanvas | null>(null);
  const [activeTool, setActiveTool] = useState<Tool>("select");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Initialize canvas only once
  useEffect(() => {
    if (!leftCanvasRef.current || !rightCanvasRef.current) return;
    if (leftFabricRef.current || rightFabricRef.current) return;

    const canvasSize = Math.min(
      window.innerWidth / 2.5,
      window.innerHeight * 0.7
    );

    // Initialize left canvas
    const left = new FabricCanvas(leftCanvasRef.current, {
      isDrawingMode: false,
      width: canvasSize,
      height: canvasSize,
      backgroundColor: 'white'
    });
    leftFabricRef.current = left;

    // Initialize PencilBrush
    const pencilBrush = new PencilBrush(left);
    pencilBrush.width = 2;
    pencilBrush.color = '#000000';
    left.freeDrawingBrush = pencilBrush;

    // Initialize right canvas
    const right = new FabricCanvas(rightCanvasRef.current, {
      isDrawingMode: false,
      width: canvasSize,
      height: canvasSize,
      backgroundColor: '#a1a1aa'
    });
    rightFabricRef.current = right;

    // Cleanup function
    return () => {
      if (leftFabricRef.current) {
        leftFabricRef.current.dispose();
        leftFabricRef.current = null;
      }
      if (rightFabricRef.current) {
        rightFabricRef.current.dispose();
        rightFabricRef.current = null;
      }
    };
  }, []);

  // Handle tool changes
  useEffect(() => {
    const canvas = leftFabricRef.current;
    if (!canvas) return;

    canvas.isDrawingMode = activeTool.startsWith("draw");
    console.log('isDrawingMode:', canvas.isDrawingMode);

    if (canvas.isDrawingMode) {
      if (activeTool === "draw-stroke") {
        canvas.freeDrawingBrush.width = 2;
      } else if (activeTool === "draw-fill") {
        canvas.freeDrawingBrush.width = 20;
      }
      canvas.freeDrawingBrush.color = '#000000';
    }

    // canvas.renderAll();
  }, [activeTool]);

  const handleToolClick = (tool: Tool) => {
    setActiveTool(tool);
    
    if (tool === "image") {
      fileInputRef.current?.click();
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !leftFabricRef.current) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const imgData = e.target?.result as string;
      if (!imgData) return;

      FabricImage.fromURL(imgData, { crossOrigin: 'anonymous' }, (img: FabricImage, error: string) => {
        if (error) {
          console.error(error);
          return;
        }

        const canvas = leftFabricRef.current;
        if (!canvas) return;

        const canvasWidth = canvas.width / 2 || 0;
        const canvasHeight = canvas.height / 2 || 0;
        const scale = Math.min(
          (canvasWidth * 0.8) / (img.width || 1),
          (canvasHeight * 0.8) / (img.height || 1)
        );
        img.scale(scale);

        img.set({
          left: (canvasWidth - (img.width || 0) * scale) / 2,
          top: (canvasHeight - (img.height || 0) * scale) / 2
        });

        canvas.add(img);
        // canvas.renderAll();
      });
    };
    reader.readAsDataURL(file);
    event.target.value = '';
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center">
      {/* Main Stage */}
      <div className="flex flex-col">
        <div className="flex gap-4 p-4">
          <div className="flex flex-row relative art-main-stage gap-4">
            <canvas
              ref={leftCanvasRef}
              className="bg-white rounded-sm border border-accent/20"
            />
            <canvas
              ref={rightCanvasRef}
              className="bg-muted-foreground rounded-sm border border-accent/20"
            />
          </div>
        </div>
        <div className="flex flex-row justify-between w-full">
          <div className="text-xs text-muted-foreground text-center m-auto">Draw</div>
          <div className="text-xs text-muted-foreground text-center m-auto">AI</div>
        </div>
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
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleImageUpload}
          accept="image/*"
          className="hidden"
        />
      </div>
    </div>
  );
};
