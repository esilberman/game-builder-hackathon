import { useEffect, useRef, useState } from "react";
import { Canvas as FabricCanvas, PencilBrush } from "fabric";
import { Button } from "@/components/ui/button";
import { MousePointer, Pen, PaintBucket, Image } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

type Tool = "select" | "draw-stroke" | "draw-fill" | "image";

export const Art = () => {
  const leftCanvasRef = useRef<HTMLCanvasElement>(null);
  const rightCanvasRef = useRef<HTMLCanvasElement>(null);
  const [leftCanvas, setLeftCanvas] = useState<FabricCanvas | null>(null);
  const [rightCanvas, setRightCanvas] = useState<FabricCanvas | null>(null);
  const [activeTool, setActiveTool] = useState<Tool>("select");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (!leftCanvasRef.current || !rightCanvasRef.current) return;

    const canvasSize = Math.min(
      window.innerWidth / 2.5,
      window.innerHeight * 0.7
    );

    // Initialize left canvas
    const left = new FabricCanvas(leftCanvasRef.current, {
      width: canvasSize,
      height: canvasSize,
      backgroundColor: "white",
      selection: true,
      isDrawingMode: false,
    });

    // Initialize PencilBrush
    const pencilBrush = new PencilBrush(left);
    pencilBrush.color = "#000000";
    pencilBrush.width = 2;
    left.freeDrawingBrush = pencilBrush;

    setLeftCanvas(left);

    // Initialize right canvas
    const right = new FabricCanvas(rightCanvasRef.current, {
      width: canvasSize,
      height: canvasSize,
      backgroundColor: "#a1a1aa",
      selection: true,
    });
    setRightCanvas(right);

    // Cleanup
    return () => {
      left.dispose();
      right.dispose();
    };
  }, []);

  useEffect(() => {
    if (!leftCanvas) return;

    // Configure canvas based on selected tool
    leftCanvas.isDrawingMode = activeTool.startsWith("draw");
    
    if (activeTool === "draw-stroke") {
      if (leftCanvas.freeDrawingBrush) {
        leftCanvas.freeDrawingBrush.color = "#000000";
        leftCanvas.freeDrawingBrush.width = 2;
      }
      toast({
        title: "Pencil tool selected",
        description: "Click and drag to draw on the canvas",
      });
    } else if (activeTool === "draw-fill") {
      if (leftCanvas.freeDrawingBrush) {
        leftCanvas.freeDrawingBrush.color = "#000000";
        leftCanvas.freeDrawingBrush.width = 20;
      }
    }

    // Ensure the cursor style matches the current tool
    leftCanvas.defaultCursor = activeTool === "select" ? "default" : "crosshair";
  }, [activeTool, leftCanvas]);

  const handleToolClick = (tool: Tool) => {
    setActiveTool(tool);
    
    if (tool === "image") {
      fileInputRef.current?.click();
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !leftCanvas) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const imgData = e.target?.result as string;
      if (!imgData) return;

      FabricImage.fromURL(imgData, { crossOrigin: 'anonymous' }, (img: FabricImage, error: string) => {
        if (error) {
          console.error(error);
          return;
        }

        const canvasWidth = leftCanvas.width / 2 || 0;
        const canvasHeight = leftCanvas.height / 2 || 0;
        const scale = Math.min(
          (canvasWidth * 0.8) / img.width,
          (canvasHeight * 0.8) / img.height
        );
        img.scale(scale);

        // Center the image manually
        img.set({
          left: (canvasWidth - img.width * scale) / 2,
          top: (canvasHeight - img.height * scale) / 2
        });

        leftCanvas.add(img);
        leftCanvas.renderAll();
        toast({
          title: "Image uploaded",
          description: "The image has been added to the canvas",
        });
      });
    };
    reader.readAsDataURL(file);
    event.target.value = ''; // Reset input
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
