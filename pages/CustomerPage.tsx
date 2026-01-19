import React, { useState, useRef } from 'react';
import DesignCanvas from '../components/DesignCanvas';
import Toolbar from '../components/Toolbar';
import { MOCK_PRODUCTS } from '../constants';
import { DesignState, DesignLayer, BaseProduct, ProductVariant } from '../types';
import { ShoppingCart, Share2, Save, Download } from 'lucide-react';

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
  
  const stageRef = useRef<any>(null);

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

  const handleSave = () => {
      // Simulate saving to backend
      console.log('Saving Design:', designState);
      alert('Design saved! (Check console for object)');
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
             <button onClick={() => setDesignState(prev => ({...prev, side: prev.side === 'front' ? 'back' : 'front'}))} className="text-sm font-medium text-gray-600 hover:text-blue-600 px-3 py-1 border rounded">
                Side: {designState.side.toUpperCase()}
             </button>
             <button onClick={handleSave} className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg">
                <Save size={18} /> Save
             </button>
             <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm">
                <ShoppingCart size={18} /> Add to Cart - {(selectedVariant.price).toLocaleString()}đ
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
            <DesignCanvas 
                product={selectedProduct}
                variant={selectedVariant}
                side={designState.side} // Passed side prop
                layers={currentLayers}
                selectedId={selectedLayerId}
                onSelect={setSelectedLayerId}
                onChange={updateLayers}
                isDrawingMode={isDrawingMode}
                drawingSettings={drawingSettings}
                stageRef={stageRef}
            />
            
            {/* Size Chart Popup Trigger (Visual only for demo) */}
            <button className="absolute bottom-4 left-4 bg-white px-3 py-1 rounded shadow text-xs text-gray-500 underline">
                View Size Chart
            </button>
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
    </div>
  );
};

export default CustomerPage;