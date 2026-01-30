import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Stage, Layer, Image as KonvaImage, Text, Transformer, Group, Line, Rect } from 'react-konva';
import { DesignLayer, BaseProduct, ProductVariant, PathLayer } from '../types';
import { CANVAS_SIZE } from '../constants';

// --- Helper Hook for Loading Images ---
const useImage = (url: string) => {
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  useEffect(() => {
    if (!url) {
      setImage(null);
      return;
    }
    const img = new window.Image();
    img.crossOrigin = 'Anonymous';
    img.src = url;
    img.onload = () => setImage(img);
  }, [url]);
  return [image];
};

interface DesignCanvasProps {
  product: BaseProduct;
  variant: ProductVariant;
  side: 'front' | 'back'; // Added side prop
  layers: DesignLayer[];
  selectedId: string | null;
  onSelect: (id: string | null) => void;
  onChange: (newLayers: DesignLayer[]) => void;
  isDrawingMode: boolean;
  drawingSettings: { color: string; width: number };
  stageRef: React.RefObject<any>;
}

const URLImage = ({ src, layerConfig, onSelect, onChange }: any) => {
  const [image] = useImage(src);
  const shapeRef = useRef<any>(null);

  return (
    <KonvaImage
      image={image || undefined}
      {...layerConfig}
      ref={shapeRef}
      draggable
      onClick={onSelect}
      onTap={onSelect}
      onDragEnd={(e: any) => {
        onChange({
          ...layerConfig,
          x: e.target.x(),
          y: e.target.y(),
        });
      }}
      onTransformEnd={(e: any) => {
        const node = shapeRef.current;
        const scaleX = node.scaleX();
        const scaleY = node.scaleY();
        node.scaleX(1);
        node.scaleY(1);
        onChange({
          ...layerConfig,
          x: node.x(),
          y: node.y(),
          width: Math.max(5, node.width() * scaleX),
          height: Math.max(node.height() * scaleY),
          rotation: node.rotation(),
          scaleX: scaleX, // Store scale
          scaleY: scaleY,
        });
      }}
    />
  );
};

const DesignCanvas: React.FC<DesignCanvasProps> = ({
  product,
  variant,
  side,
  layers,
  selectedId,
  onSelect,
  onChange,
  isDrawingMode,
  drawingSettings,
  stageRef
}) => {
  // Select the correct image URL based on the current side
  const imageUrl = side === 'front' ? variant.imageFront : variant.imageBack;
  const [bgImage] = useImage(imageUrl);
  const maskUrl = side === 'front' ? variant.maskFront : variant.maskBack;
  const [maskImage] = useImage(maskUrl);
  
  const transformerRef = useRef<any>(null);
  
  // Selection handling
  useEffect(() => {
    if (selectedId && transformerRef.current) {
        const stage = transformerRef.current.getStage();
        const selectedNode = stage.findOne('.' + selectedId);
        if (selectedNode) {
          transformerRef.current.nodes([selectedNode]);
          transformerRef.current.getLayer().batchDraw();
        } else {
            transformerRef.current.nodes([]);
        }
    } else if (transformerRef.current) {
      transformerRef.current.nodes([]);
    }
  }, [selectedId, layers]);

  // Free drawing handlers
  const isDrawing = useRef(false);

  const handleMouseDown = (e: any) => {
    const stage = e.target.getStage();
    // Deselect if clicked on empty area
    const clickedOnEmpty = e.target === stage.findOne('#bg-overlay') || e.target === stage;
    if (clickedOnEmpty && !isDrawingMode) {
      onSelect(null);
    }

    if (!isDrawingMode) return;

    isDrawing.current = true;
    const pos = stage.getPointerPosition();
    const newLine: PathLayer = {
      id: `path-${Date.now()}`,
      type: 'path',
      points: [pos.x, pos.y],
      stroke: drawingSettings.color,
      strokeWidth: drawingSettings.width,
      tension: 0.5,
      x: 0, y: 0, rotation: 0, scaleX: 1, scaleY: 1, visible: true, zIndex: layers.length
    };
    onChange([...layers, newLine]);
  };

  const handleMouseMove = (e: any) => {
    if (!isDrawingMode || !isDrawing.current) return;
    
    const stage = e.target.getStage();
    const point = stage.getPointerPosition();
    const lastLayer = layers[layers.length - 1];

    if (lastLayer.type === 'path') {
        const newPoints = lastLayer.points.concat([point.x, point.y]);
        const updatedLayers = layers.slice(0, layers.length - 1);
        updatedLayers.push({ ...lastLayer, points: newPoints });
        onChange(updatedLayers);
    }
  };

  const handleMouseUp = () => {
    isDrawing.current = false;
  };

  return (
    <div className="bg-gray-200 shadow-lg rounded-lg overflow-hidden flex justify-center items-center p-4 scale-[0.6] origin-center">
      <Stage
        width={800}
        height={1000}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onTouchStart={handleMouseDown}
        onTouchMove={handleMouseMove}
        onTouchEnd={handleMouseUp}
        ref={stageRef}
        style={{ backgroundImage: 'linear-gradient(45deg, #ccc 25%, transparent 25%), linear-gradient(-45deg, #ccc 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #ccc 75%), linear-gradient(-45deg, transparent 75%, #ccc 75%)', backgroundSize: '20px 20px', backgroundColor: 'white' }}
        className="border border-gray-300"// Removed bg-gray-100 for a cleaner look
      >
        <Layer>
        {bgImage && (
          <KonvaImage
            image={bgImage}
            width={800}
            height={1000}
            listening={false}
          />
        )}
      </Layer>

      {/* --- LAYER 2: LỚP MÀU (Xử lý riêng biệt) --- */}
      {/* Layer này nằm đè lên Layer 1. Những chỗ trong suốt sẽ nhìn xuyên qua thấy Layer 1 */}
      <Layer>
        {variant.colorHex.toLowerCase() !== '#ffffff' && maskImage && (
          <Group>
            {/* Bước A: Vẽ cái khuôn (Mask) trước */}
            <KonvaImage
              image={maskImage}
              width={800}
              height={1000}
              listening={false}
            />

            {/* Bước B: Đổ màu vào khuôn */}
            <Rect
              width={800}
              height={1000}
              fill={variant.colorHex}
              // source-in: Chỉ giữ lại màu ở những chỗ đè lên Mask (trong Layer này)
              // Vì Layer này tách biệt, nó không xóa ảnh nền ở Layer 1
              globalCompositeOperation="source-in"
              
              // Chỉnh độ trong suốt để màu hòa trộn với nếp nhăn áo ở Layer 1
              opacity={0.75} // Thử chỉnh từ 0.5 đến 0.8 để thấy độ thật
              listening={false}
            />
          </Group>
        )}
      </Layer>
      <Layer>
          
          {/* Print Area Guide */}
          <Rect 
            x={product.printArea.left}
            y={product.printArea.top}
            width={product.printArea.width}
            height={product.printArea.height}
            strokeDash={[5, 5]}
            stroke="rgba(0,0,0,0.2)"
            id="print-area-guide"
            listening={false}
          />

          {/* Clipping Group for Print Area */}
          <Group
             clipX={product.printArea.left}
             clipY={product.printArea.top}
             clipWidth={product.printArea.width}
             clipHeight={product.printArea.height}
          >
             {layers.map((layer, i) => {
               
               if (layer.type === 'text') {
                 return (
                   <Text
                     key={layer.id}
                     id={layer.id}
                     name={layer.id}
                     text={(layer as any).text}
                     x={layer.x}
                     y={layer.y}
                     fontSize={(layer as any).fontSize}
                     fontFamily={(layer as any).fontFamily}
                     fill={(layer as any).fill}
                     stroke={(layer as any).stroke}
                     strokeWidth={(layer as any).strokeWidth || 0}
                     shadowColor={(layer as any).shadowColor}
                     shadowBlur={(layer as any).shadowBlur}
                     draggable={!isDrawingMode}
                     onClick={() => onSelect(layer.id)}
                     onTap={() => onSelect(layer.id)}
                     onDragEnd={(e) => {
                        const newLayers = [...layers];
                        newLayers[i] = { ...layer, x: e.target.x(), y: e.target.y() };
                        onChange(newLayers);
                     }}
                   />
                 );
               } else if (layer.type === 'image') {
                 return (
                   <URLImage
                     key={layer.id}
                     src={(layer as any).src}
                     layerConfig={{...layer, name: layer.id}}
                     onSelect={() => onSelect(layer.id)}
                     onChange={(newAttrs: any) => {
                        const newLayers = [...layers];
                        newLayers[i] = newAttrs;
                        onChange(newLayers);
                     }}
                   />
                 );
               } else if (layer.type === 'path') {
                   return (
                       <Line
                        key={layer.id}
                        id={layer.id}
                        name={layer.id}
                        points={(layer as any).points}
                        stroke={(layer as any).stroke}
                        strokeWidth={(layer as any).strokeWidth}
                        tension={(layer as any).tension}
                        lineCap="round"
                        lineJoin="round"
                        draggable={!isDrawingMode}
                        onClick={() => onSelect(layer.id)}
                        onDragEnd={(e) => {
                            const newLayers = [...layers];
                            newLayers[i] = { ...layer, x: e.target.x(), y: e.target.y() };
                            onChange(newLayers);
                        }}
                       />
                   )
               }
               return null;
             })}
          </Group>

          {/* Transformer layer - sits on top */}
          <Transformer ref={transformerRef} boundBoxFunc={(oldBox, newBox) => {
              if (newBox.width < 5 || newBox.height < 5) {
                return oldBox;
              }
              return newBox;
            }} 
          />
        </Layer>
      </Stage>
      
    </div>
  );
};

export default DesignCanvas;