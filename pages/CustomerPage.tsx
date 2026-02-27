import React, { useState, useRef } from 'react';
import DesignCanvas from '../components/DesignCanvas';
import Toolbar from '../components/Toolbar';
import { MOCK_PRODUCTS, CANVAS_SIZE } from '../constants';
import { DesignState, DesignLayer, BaseProduct, ProductVariant } from '../types';
import { ShoppingCart, Save, X } from 'lucide-react';

const CustomerPage: React.FC = () => {
  const [selectedProduct, setSelectedProduct] = useState<BaseProduct>(MOCK_PRODUCTS[0]);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant>(MOCK_PRODUCTS[0].variants[0]);
  
  const [designState, setDesignState] = useState<DesignState>({
    productId: MOCK_PRODUCTS[0].id,
    variantId: MOCK_PRODUCTS[0].variants[0].id,
    side: 'front',
    layers: { front: [], back: [] }
  });

  const [selectedLayerId, setSelectedLayerId] = useState<string | null>(null);
  const [isDrawingMode, setDrawingMode] = useState(false);
  const [drawingSettings, setDrawingSettings] = useState({ color: '#000000', width: 3 });
  const [showSizeChart, setShowSizeChart] = useState(false);
  
  const frontStageRef = useRef<any>(null);
  const backStageRef = useRef<any>(null);

  const currentLayers = designState.layers[designState.side];

  const updateLayers = (newLayers: DesignLayer[]) => {
    setDesignState(prev => ({
        ...prev,
        layers: {
            ...prev.layers,
            [prev.side]: newLayers
        }
    }));
  };

  // Helper for specific side updates from the dual canvas setup
  const updateSideLayers = (side: 'front' | 'back', newLayers: DesignLayer[]) => {
    setDesignState(prev => ({
        ...prev,
        layers: {
            ...prev.layers,
            [side]: newLayers
        }
    }));
  };

  const handleAddLayer = (layer: DesignLayer) => {
    updateLayers([...currentLayers, layer]);
    setSelectedLayerId(layer.id);
  };

  const handleUpdateLayer = (id: string, updates: Partial<DesignLayer>) => {
    const newLayers = currentLayers.map(l => l.id === id ? { ...l, ...updates } as DesignLayer : l);
    updateLayers(newLayers);
  };

  const handleDeleteLayer = (id: string) => {
    updateLayers(currentLayers.filter(l => l.id !== id));
    setSelectedLayerId(null);
  };

  const handleReorderLayer = (id: string, direction: 'up' | 'down') => {
    const idx = currentLayers.findIndex(l => l.id === id);
    if (idx === -1) return;
    
    const newLayers = [...currentLayers];
    if (direction === 'up' && idx < newLayers.length - 1) {
        [newLayers[idx], newLayers[idx + 1]] = [newLayers[idx + 1], newLayers[idx]];
    } else if (direction === 'down' && idx > 0) {
        [newLayers[idx], newLayers[idx - 1]] = [newLayers[idx - 1], newLayers[idx]];
    }
    updateLayers(newLayers);
  };

  const handleSwitchSide = () => {
    setSelectedLayerId(null); // Clear selection when switching
    setDesignState(prev => ({...prev, side: prev.side === 'front' ? 'back' : 'front'}));
  };

  const handleSave = async () => {
      // 1. Clear selection to remove transformer handles from the screenshot
      setSelectedLayerId(null);

      // 2. Wait a brief moment for the re-render to remove the transformer
      setTimeout(async () => {
          if (frontStageRef.current && backStageRef.current) {
              try {
                  // Capture both stages
                  const frontData = frontStageRef.current.toDataURL({ pixelRatio: 2 });
                  const backData = backStageRef.current.toDataURL({ pixelRatio: 2 });

                  // Create a canvas to merge them
                  const canvas = document.createElement('canvas');
                  const gap = 40;
                  const labelHeight = 50;
                  canvas.width = (800 * 2) + gap;
                  canvas.height = 1000 + labelHeight;
                  
                  const ctx = canvas.getContext('2d');
                  if (!ctx) return;

                  // White background
                  ctx.fillStyle = '#ffffff';
                  ctx.fillRect(0, 0, canvas.width, canvas.height);

                  // Helper to load image
                  const loadImage = (src: string) => new Promise<HTMLImageElement>((resolve) => {
                      const img = new Image();
                      img.onload = () => resolve(img);
                      img.src = src;
                  });

                  // Load captured images
                  const [imgFront, imgBack] = await Promise.all([loadImage(frontData), loadImage(backData)]);

                  // Draw text labels
                  ctx.font = "bold 24px Oswald, sans-serif";
                  ctx.fillStyle = "#1e3a8a"; // Brand blue
                  ctx.textAlign = "center";
                  ctx.textBaseline = "middle";
                  
                  ctx.fillText("FRONT VIEW", 800 / 2, labelHeight / 2);
                  ctx.fillText("BACK VIEW", 800 + gap + (800 / 2), labelHeight / 2);

                  // Draw Images
                  ctx.drawImage(imgFront, 0, labelHeight, 800, 1000);
                  ctx.drawImage(imgBack, 800 + gap, labelHeight, 800, 1000);

                  // Download
                  const link = document.createElement('a');
                  link.download = `Printtique-Design-${selectedProduct.name.replace(/\s+/g, '-')}-${Date.now()}.png`;
                  link.href = canvas.toDataURL('image/png');
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);

              } catch (e) {
                  console.error("Export failed", e);
                  alert("Failed to generate preview.");
              }
          }
      }, 100);
  };

  return (
    <div className="flex flex-col h-screen bg-slate-50">
      {/* Header */}
      <header className="h-16 bg-white border-b border-gray-200 px-6 flex items-center justify-between z-10">
        <div className="flex items-center gap-4">
            <h1 className="text-xl font-bold font-oswald text-blue-700 tracking-wide">Printtique Studio</h1>
            <div className="h-6 w-px bg-gray-300 mx-2"></div>
            <select 
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2"
                onChange={(e) => {
                    const prod = MOCK_PRODUCTS.find(p => p.id === e.target.value);
                    if (prod) {
                        setSelectedProduct(prod);
                        setSelectedVariant(prod.variants[0]);
                    }
                }}
            >
                {MOCK_PRODUCTS.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
        </div>
        
        <div className="flex items-center gap-3">
             <button 
                onClick={() => setShowSizeChart(true)}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm"
                 >
                View Size Chart
             </button>
             <button onClick={handleSwitchSide} className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm">
                Side: {designState.side.toUpperCase()}
             </button>
             <button onClick={handleSave} className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm">
                <Save size={18} /> Save Preview
             </button>
             <button 
                onClick={() => window.open('https://www.facebook.com/profile.php?id=61587083019760&locale=vi_VN', '_blank', 'noopener,noreferrer')} 
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-800 hover:bg-blue-900 rounded-lg shadow-sm"
                >
                Facebook
             </button>
        </div>
      </header>

      {/* Main Workspace */}
      <div className="flex flex-1 overflow-hidden">
        
        {/* Left: Product & Variants (Mini Configurator) */}
        <div className="w-20 bg-white border-r border-gray-200 flex flex-col items-center py-4 gap-4">
             <div className="text-xs text-gray-400 font-bold uppercase tracking-wider">Color</div>
             {selectedProduct.variants.map(v => (
                 <button 
                    key={v.id}
                    onClick={() => setSelectedVariant(v)}
                    className={`w-8 h-8 rounded-full border-2 shadow-sm ${selectedVariant.id === v.id ? 'border-blue-600 scale-110' : 'border-gray-200'}`}
                    style={{ backgroundColor: v.colorHex }}
                    title={v.name}
                 />
             ))}
        </div>

        {/* Center: Canvas Area */}
        <div className="flex-1 bg-gray-100 overflow-auto flex items-center justify-center p-8 relative">
            
            {/* 
               Render BOTH canvases but hide the inactive one off-screen.
               This ensures both are available in the DOM for image capture via .toDataURL().
            */}
            <div className="relative w-full h-full flex items-center justify-center">
                
                {/* FRONT CANVAS */}
                <div style={{
                    position: designState.side === 'front' ? 'relative' : 'absolute',
                    left: designState.side === 'front' ? 'auto' : '-9999px',
                    visibility: designState.side === 'front' ? 'visible' : 'hidden',
                    zIndex: designState.side === 'front' ? 10 : 0
                }}>
                    <DesignCanvas 
                        product={selectedProduct}
                        variant={selectedVariant}
                        side="front"
                        layers={designState.layers.front}
                        selectedId={designState.side === 'front' ? selectedLayerId : null}
                        onSelect={setSelectedLayerId}
                        onChange={(layers) => updateSideLayers('front', layers)}
                        isDrawingMode={designState.side === 'front' && isDrawingMode}
                        drawingSettings={drawingSettings}
                        stageRef={frontStageRef}
                    />
                </div>

                {/* BACK CANVAS */}
                <div style={{
                     position: designState.side === 'back' ? 'relative' : 'absolute',
                     left: designState.side === 'back' ? 'auto' : '-9999px',
                     visibility: designState.side === 'back' ? 'visible' : 'hidden',
                     zIndex: designState.side === 'back' ? 10 : 0
                }}>
                    <DesignCanvas 
                        product={selectedProduct}
                        variant={selectedVariant}
                        side="back"
                        layers={designState.layers.back}
                        selectedId={designState.side === 'back' ? selectedLayerId : null}
                        onSelect={setSelectedLayerId}
                        onChange={(layers) => updateSideLayers('back', layers)}
                        isDrawingMode={designState.side === 'back' && isDrawingMode}
                        drawingSettings={drawingSettings}
                        stageRef={backStageRef}
                    />
                </div>
            </div>
        </div>

        {/* Right: Tools */}
        <Toolbar 
            layers={currentLayers}
            selectedId={selectedLayerId}
            onAddLayer={handleAddLayer}
            onUpdateLayer={handleUpdateLayer}
            onDeleteLayer={handleDeleteLayer}
            onReorderLayer={handleReorderLayer}
            setDrawingMode={setDrawingMode}
            isDrawingMode={isDrawingMode}
            drawingSettings={drawingSettings}
            setDrawingSettings={setDrawingSettings}
        />
      </div>

      {/* Size Chart Modal */}
      {showSizeChart && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="absolute inset-0" onClick={() => setShowSizeChart(false)}></div>
            <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full overflow-hidden relative z-10 animate-in zoom-in-95 duration-200">
                <button 
                    onClick={() => setShowSizeChart(false)}
                    className="absolute top-4 right-4 p-2 bg-gray-100 rounded-full hover:bg-gray-200 text-gray-600 transition-colors"
                >
                    <X size={20} />
                </button>
                <div className="p-8">
                    <h3 className="text-2xl font-bold font-oswald text-slate-800 mb-2">Size Guide</h3>
                    <p className="text-gray-500 mb-6">Find your perfect fit for the {selectedProduct.name}</p>
                    
                    <div className="grid grid-cols-1 gap-8">
                        {/* Image Illustration */}
                        <div className="bg-gray-50 rounded-lg p-4 flex items-center justify-center border border-gray-100">
                            <img 
                                src="https://i.postimg.cc/3wccVgWD/size.png" 
                                alt="Measurement Guide" 
                                className="w-full opacity-80"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default CustomerPage;