import { useEffect, useRef, useState } from "react";
import { Canvas as FabricCanvas } from "fabric";

export const Art = () => {
  const leftCanvasRef = useRef<HTMLCanvasElement>(null);
  const rightCanvasRef = useRef<HTMLCanvasElement>(null);
  const [leftCanvas, setLeftCanvas] = useState<FabricCanvas | null>(null);
  const [rightCanvas, setRightCanvas] = useState<FabricCanvas | null>(null);

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
    });
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
      <div className="input-area bottom-0 w-full p-2 flex gap-2 bg-black">
      </div>
    </div>
  );
};
