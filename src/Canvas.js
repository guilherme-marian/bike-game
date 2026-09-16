import React, { useEffect } from 'react';
import kaplay from 'kaplay';

function Game() {
  const k = kaplay();

  k.loadRoot("./")

  k.add([k.pos(120, 80)]);

  k.onClick(() => k.addKaboom(k.mousePos()));
}

export default Game;