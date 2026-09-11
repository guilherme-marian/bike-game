import React, { useEffect } from 'react';
import kaplay from 'kaplay';

function GameCanvas() {
    useEffect(() => {
    const k = kaplay({
      width: 200,
      height: 200,
      background: "#f46eb3",
      scale: 2,
      canvas: document.getElementById("canvas"),
    });

    const { add, rect, pos } = k;

    const obj = add([
      rect(32, 32),
      pos(10, 20),
      "shape",
    ]);

      obj.onUpdate(() => {
    obj.move(100, 0)
    })
  }, []); 



  return <canvas id="canvas"></canvas>;
}

export default GameCanvas;