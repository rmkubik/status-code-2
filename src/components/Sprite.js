import React, { useEffect, useMemo, useRef } from "react";
import { useTheme } from "styled-components";

const drawImageWithColor = ({ canvas, image, tileSize, location, color }) => {
  const context = canvas.getContext("2d");

  // draw image
  // https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/drawImage
  // drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight)
  context.drawImage(
    image,
    tileSize * location.col,
    tileSize * location.row,
    tileSize,
    tileSize,
    0,
    0,
    tileSize,
    tileSize
  );

  if (color) {
    // set composite mode
    context.globalCompositeOperation = "source-in";

    // draw color
    context.fillStyle = color;
    context.fillRect(0, 0, canvas.width, canvas.height);

    context.globalCompositeOperation = "source-over";
  }
};

const Sprite = ({ src, location, color, tileSize = 16, ...props }) => {
  const { colors } = useTheme();
  const canvasRef = useRef();
  const spriteImage = useMemo(() => {
    const sprite = new Image();
    sprite.src = src;

    return sprite;
  }, [src]);

  const drawSpriteWhenReady = () => {
    const canvas = canvasRef.current;

    if (spriteImage.complete) {
      drawImageWithColor({
        canvas,
        image: spriteImage,
        tileSize,
        location,
        color: colors[color],
      });
    } else {
      spriteImage.onload = () => {
        drawImageWithColor({
          canvas,
          image: spriteImage,
          tileSize,
          location,
          color: colors[color],
        });
      };
    }
  };

  useEffect(() => {
    drawSpriteWhenReady();

    return () => {
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");

      context.clearRect(0, 0, canvas.width, canvas.height);
    };
  }, [colors, src, color]);

  return (
    <canvas width={tileSize} height={tileSize} ref={canvasRef} {...props} />
  );
};

export default Sprite;
