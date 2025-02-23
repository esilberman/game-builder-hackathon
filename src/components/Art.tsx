
import React from "react";
import { Excalidraw } from "@excalidraw/excalidraw";

export const Art = () => {
  return (
    <div className="w-full h-full min-h-[500px] bg-background p-4">
      <div className="w-full h-full glass rounded-lg overflow-hidden">
        <Excalidraw theme="dark" />
      </div>
    </div>
  );
};
