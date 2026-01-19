import React, { useState } from 'react';
import { Type, Image as ImageIcon, PenTool, Layers, Upload, Plus, Trash2, ArrowUp, ArrowDown } from 'lucide-react';
import { AVAILABLE_FONTS, CLIPARTS } from '../constants';
import { DesignLayer, TextLayer, ImageLayer } from '../types';

interface ToolbarProps {
  layers: DesignLayer[];
  selectedId: string | null;
  onAddLayer: (layer: DesignLayer) => void;
  onUpdateLayer: (id: string, updates: Partial<DesignLayer>) => void;
  onDeleteLayer: (id: string) => void;
  onReorderLayer: (id: string, direction: 'up' | 'down') => void;
  setDrawingMode: (active: boolean) => void;
  isDrawingMode: boolean;
  drawingSettings: { color: string; width: number };
  setDrawingSettings: (settings: any) => void;
}

const Toolbar: React.FC<ToolbarProps> = ({
  layers,
  selectedId,
  onAddLayer,
  onUpdateLayer,
  onDeleteLayer,
  onReorderLayer,
  setDrawingMode,
  isDrawingMode,
  drawingSettings,
  setDrawingSettings
}) => {
  const [activeTab, setActiveTab] = useState<'text' | 'image' | 'draw' | 'layers'>('text');
  const [inputText, setInputText] = useState('Hello World');

  const selectedLayer = layers.find(l => l.id === selectedId);

  const handleAddText = () => {
    const newLayer: TextLayer = {
      id: `text-${Date.now()}`,
      type: 'text',
      text: inputText,
      fontFamily: 'Inter',
      fontSize: 24,
      fill: '#000000',
      align: 'center',
      x: 300,
      y: 200,
      rotation: 0,
      scaleX: 1,
      scaleY: 1,
      visible: true,
      zIndex: layers.length
    };
    onAddLayer(newLayer);
    setActiveTab('layers'); // Switch to layers to see it
  };

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        img.onload = () => {
            const isLowRes = img.naturalWidth < 1000; // Example threshold
            const newLayer: ImageLayer = {
                id: `img-${Date.now()}`,
                type: 'image',
                src: event.target?.result as string,
                naturalWidth: img.naturalWidth,
                naturalHeight: img.naturalHeight,
                lowResWarning: isLowRes,
                x: 300 - 100,
                y: 200 - 100,
                rotation: 0,
                scaleX: 0.5,
                scaleY: 0.5,
                visible: true,
                zIndex: layers.length
            };
            onAddLayer(newLayer);
            if(isLowRes) alert("Warning: This image is low resolution and may print poorly.");
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const addClipart = (url: string) => {
      const newLayer: ImageLayer = {
          id: `clip-${Date.now()}`,
          type: 'image',
          src: url,
          naturalWidth: 512,
          naturalHeight: 512,
          x: 250,
          y: 250,
          rotation: 0,
          scaleX: 0.3,
          scaleY: 0.3,
          visible: true,
          zIndex: layers.length
      };
      onAddLayer(newLayer);
  };

  return (
    <div className="w-80 bg-white border-l border-gray-200 flex flex-col h-full overflow-y-auto">
      {/* Tabs */}
      <div className="flex border-b border-gray-200">
        <button onClick={() => { setActiveTab('text'); setDrawingMode(false); }} className={`flex-1 py-3 flex justify-center ${activeTab === 'text' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}><Type size={20} /></button>
        <button onClick={() => { setActiveTab('image'); setDrawingMode(false); }} className={`flex-1 py-3 flex justify-center ${activeTab === 'image' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}><ImageIcon size={20} /></button>
        <button onClick={() => { setActiveTab('draw'); setDrawingMode(true); }} className={`flex-1 py-3 flex justify-center ${activeTab === 'draw' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}><PenTool size={20} /></button>
        <button onClick={() => { setActiveTab('layers'); setDrawingMode(false); }} className={`flex-1 py-3 flex justify-center ${activeTab === 'layers' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}><Layers size={20} /></button>
      </div>

      <div className="p-4 flex-1">
        {/* TEXT TAB */}
        {activeTab === 'text' && (
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-800">Add Text</h3>
            <div className="flex gap-2">
              <input 
                type="text" 
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                className="flex-1 border border-white rounded px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button onClick={handleAddText} className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700"><Plus size={20} /></button>
            </div>
            
            {selectedLayer?.type === 'text' && (
              <div className="mt-6 space-y-4 border-t pt-4">
                <h4 className="text-sm font-medium text-gray-500">Edit Text</h4>
                <div>
                    <label className="text-xs text-gray-500">Font Family</label>
                    <select 
                        className="w-full border p-2 rounded text-sm text-white"
                        value={(selectedLayer as TextLayer).fontFamily}
                        onChange={(e) => onUpdateLayer(selectedLayer.id, { fontFamily: e.target.value })}
                    >
                        {AVAILABLE_FONTS.map(f => <option key={f.value} value={f.value} style={{fontFamily: f.value}}>{f.name}</option>)}
                    </select>
                </div>
                <div>
                    <label className="text-xs text-gray-500">Color</label>
                    <input 
                        type="color" 
                        className="w-full h-8 rounded cursor-pointer"
                        value={(selectedLayer as TextLayer).fill}
                        onChange={(e) => onUpdateLayer(selectedLayer.id, { fill: e.target.value })}
                    />
                </div>
                <div>
                    <label className="text-xs text-gray-500">Font Size</label>
                    <input 
                        type="range" min="12" max="100"
                        className="w-full"
                        value={(selectedLayer as TextLayer).fontSize}
                        onChange={(e) => onUpdateLayer(selectedLayer.id, { fontSize: parseInt(e.target.value) })}
                    />
                </div>
              </div>
            )}
          </div>
        )}

        {/* IMAGE TAB */}
        {activeTab === 'image' && (
            <div className="space-y-6">
                <div>
                    <h3 className="font-semibold text-gray-800 mb-2">Upload Image</h3>
                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <Upload className="w-8 h-8 mb-3 text-gray-400" />
                            <p className="text-sm text-gray-500"><span className="font-semibold">Click to upload</span></p>
                            <p className="text-xs text-gray-500">PNG, JPG</p>
                        </div>
                        <input type="file" className="hidden" accept="image/*" onChange={handleUpload} />
                    </label>
                </div>

                <div>
                    <h3 className="font-semibold text-gray-800 mb-2">Clipart Library</h3>
                    <div className="grid grid-cols-2 gap-2">
                        {CLIPARTS.map(clip => (
                            <button key={clip.id} onClick={() => addClipart(clip.url)} className="border p-2 rounded hover:border-blue-500 bg-white">
                                <img src={clip.url} alt={clip.category} className="w-full h-auto object-contain" />
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        )}

        {/* DRAW TAB */}
        {activeTab === 'draw' && (
            <div className="space-y-4">
                 <h3 className="font-semibold text-gray-800">Free Drawing</h3>
                 <div className="bg-yellow-50 text-yellow-800 text-xs p-2 rounded">
                    Draw directly on the canvas!
                 </div>
                 <div>
                    <label className="text-xs text-gray-500">Brush Color</label>
                    <input 
                        type="color" 
                        className="w-full h-8 rounded cursor-pointer border border-white"
                        value={drawingSettings.color}
                        onChange={(e) => setDrawingSettings({...drawingSettings, color: e.target.value})}
                    />
                </div>
                <div>
                    <label className="text-xs text-gray-500">Brush Size: {drawingSettings.width}px</label>
                    <input 
                        type="range" min="1" max="20"
                        className="w-full"
                        value={drawingSettings.width}
                        onChange={(e) => setDrawingSettings({...drawingSettings, width: parseInt(e.target.value)})}
                    />
                </div>
            </div>
        )}

        {/* LAYERS TAB */}
        {activeTab === 'layers' && (
            <div className="space-y-2">
                <h3 className="font-semibold text-gray-800 mb-2">Layers</h3>
                {layers.length === 0 && <p className="text-sm text-gray-400 italic">No layers yet.</p>}
                {[...layers].reverse().map((layer, index) => {
                    // Reverse for display (top layer first), but we need actual index for logic
                    const realIndex = layers.length - 1 - index;
                    return (
                        <div 
                            key={layer.id} 
                            className={`flex items-center justify-between p-2 rounded border ${selectedId === layer.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200 bg-white'}`}
                        >
                            <div className="flex items-center gap-2 cursor-pointer flex-1" onClick={() => {}}>
                                {layer.type === 'text' && <Type size={16} className="text-gray-500"/>}
                                {layer.type === 'image' && <ImageIcon size={16} className="text-gray-500"/>}
                                {layer.type === 'path' && <PenTool size={16} className="text-gray-500"/>}
                                <span className="text-sm truncate w-24">
                                    {layer.type === 'text' ? (layer as TextLayer).text : layer.type}
                                </span>
                            </div>
                            <div className="flex gap-1">
                                <button onClick={() => onReorderLayer(layer.id, 'up')} className="p-1 hover:bg-gray-200 rounded text-gray-600"><ArrowUp size={14} /></button>
                                <button onClick={() => onReorderLayer(layer.id, 'down')} className="p-1 hover:bg-gray-200 rounded text-gray-600"><ArrowDown size={14} /></button>
                                <button onClick={() => onDeleteLayer(layer.id)} className="p-1 hover:bg-red-100 rounded text-red-500"><Trash2 size={14} /></button>
                            </div>
                        </div>
                    );
                })}
            </div>
        )}
      </div>
    </div>
  );
};

export default Toolbar;