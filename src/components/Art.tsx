
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
      backgroundColor: "#1a1a1a",
      selection: true,
    });
    setLeftCanvas(left);

    // Initialize right canvas
    const right = new FabricCanvas(rightCanvasRef.current, {
      width: canvasSize,
      height: canvasSize,
      backgroundColor: "#1a1a1a",
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
      <div className="flex gap-4 p-4">
        <div className="relative">
          <canvas
            ref={leftCanvasRef}
            className="rounded-lg border border-accent/20"
          />
          <div className="absolute bottom-2 left-2 text-xs text-muted-foreground">
            Source
          </div>
        </div>
        <div className="relative">
          <canvas
            ref={rightCanvasRef}
            className="rounded-lg border border-accent/20"
          />
          <div className="absolute bottom-2 left-2 text-xs text-muted-foreground">
            Generated
          </div>
        </div>
      </div>
    </div>
  );
};
