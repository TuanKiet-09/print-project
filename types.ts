export type ProductType = 't-shirt' | 'polo' | 'hoodie' | 'totebag';

export interface ProductVariant {
  id: string;
  name: string;
  colorHex: string;
  imageFront: string;
  imageBack: string;
  price: number;
}

export interface BaseProduct {
  id: string;
  name: string;
  type: ProductType;
  variants: ProductVariant[];
  printArea: {
    width: number; // in px relative to canvas
    height: number;
    top: number;
    left: number;
  };
}

export type LayerType = 'text' | 'image' | 'path';

export interface BaseLayer {
  id: string;
  type: LayerType;
  x: number;
  y: number;
  rotation: number;
  scaleX: number;
  scaleY: number;
  visible: boolean;
  zIndex: number;
}

export interface TextLayer extends BaseLayer {
  type: 'text';
  text: string;
  fontFamily: string;
  fontSize: number;
  fill: string;
  stroke?: string;
  strokeWidth?: number;
  align: 'left' | 'center' | 'right';
  fontStyle?: string; // bold, italic
  shadowColor?: string;
  shadowBlur?: number;
}

export interface ImageLayer extends BaseLayer {
  type: 'image';
  src: string;
  naturalWidth: number;
  naturalHeight: number;
  lowResWarning?: boolean;
}

export interface PathLayer extends BaseLayer {
  type: 'path';
  points: number[];
  stroke: string;
  strokeWidth: number;
  tension: number;
}

export type DesignLayer = TextLayer | ImageLayer | PathLayer;

export interface DesignState {
  productId: string;
  variantId: string;
  side: 'front' | 'back';
  layers: {
    front: DesignLayer[];
    back: DesignLayer[];
  };
}

export interface Order {
  id: string;
  customerName: string;
  date: string;
  status: 'pending' | 'processing' | 'shipped';
  total: number;
  thumbnail: string;
}
