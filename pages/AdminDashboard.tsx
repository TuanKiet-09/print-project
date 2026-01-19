import React, { useState } from 'react';
import { Package, Image as ImageIcon, Layout, Settings, Download, Search } from 'lucide-react';
import { MOCK_ORDERS, MOCK_PRODUCTS } from '../constants';

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'orders' | 'products' | 'assets'>('orders');

  const handleExport = (orderId: string) => {
      alert(`Simulating high-res PDF/PNG generation for Order ${orderId}... \nBackend task: Render Konva Stage @ 300 DPI, exclude BG layer, clip to print area.`);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col">
        <div className="h-16 flex items-center px-6 font-bold text-lg font-oswald tracking-wide border-b border-slate-800">
            PrintMaster Admin
        </div>
        <nav className="flex-1 py-6 px-3 space-y-1">
            <button 
                onClick={() => setActiveTab('orders')}
                className={`flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm font-medium ${activeTab === 'orders' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
            >
                <Package size={20} /> Orders
            </button>
            <button 
                onClick={() => setActiveTab('products')}
                className={`flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm font-medium ${activeTab === 'products' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
            >
                <Layout size={20} /> Products
            </button>
            <button 
                onClick={() => setActiveTab('assets')}
                className={`flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm font-medium ${activeTab === 'assets' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
            >
                <ImageIcon size={20} /> Assets & Fonts
            </button>
        </nav>
        <div className="p-4 border-t border-slate-800">
            <button className="flex items-center gap-3 text-slate-400 hover:text-white text-sm">
                <Settings size={18} /> Settings
            </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        
        {activeTab === 'orders' && (
            <div className="space-y-6">
                <div className="flex justify-between items-end">
                    <h2 className="text-2xl font-bold text-slate-800">Order Management</h2>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input type="text" placeholder="Search orders..." className="pl-10 pr-4 py-2 border rounded-lg text-sm w-64" />
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50 text-gray-600 font-medium border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-3">Order ID</th>
                                <th className="px-6 py-3">Customer</th>
                                <th className="px-6 py-3">Date</th>
                                <th className="px-6 py-3">Status</th>
                                <th className="px-6 py-3">Total</th>
                                <th className="px-6 py-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {MOCK_ORDERS.map(order => (
                                <tr key={order.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 font-medium text-gray-900 flex items-center gap-3">
                                        <img src={order.thumbnail} alt="" className="w-8 h-8 rounded bg-gray-200 object-cover" />
                                        {order.id}
                                    </td>
                                    <td className="px-6 py-4 text-gray-600">{order.customerName}</td>
                                    <td className="px-6 py-4 text-gray-600">{order.date}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${order.status === 'processing' ? 'bg-blue-100 text-blue-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                            {order.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 font-medium">{order.total.toLocaleString()}đ</td>
                                    <td className="px-6 py-4 text-right">
                                        <button onClick={() => handleExport(order.id)} className="text-blue-600 hover:text-blue-800 font-medium inline-flex items-center gap-1">
                                            <Download size={16} /> Export Print
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        )}

        {activeTab === 'products' && (
            <div className="space-y-6">
                <h2 className="text-2xl font-bold text-slate-800">Base Products</h2>
                <div className="grid grid-cols-3 gap-6">
                    {MOCK_PRODUCTS.map(product => (
                        <div key={product.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
                            <div className="aspect-square bg-gray-100 rounded-lg mb-4 relative overflow-hidden group">
                                <img src={product.variants[0].imageFront} alt={product.name} className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                                    Edit Print Area
                                </div>
                            </div>
                            <h3 className="font-bold text-gray-800">{product.name}</h3>
                            <p className="text-sm text-gray-500 mb-2">{product.variants.length} Variants</p>
                            <div className="text-xs bg-gray-100 p-2 rounded text-gray-600">
                                Print Area: {product.printArea.width}x{product.printArea.height}px
                            </div>
                        </div>
                    ))}
                    <button className="flex flex-col items-center justify-center gap-2 aspect-square rounded-xl border-2 border-dashed border-gray-300 text-gray-400 hover:border-blue-500 hover:text-blue-500 transition-colors">
                        <Layout size={32} />
                        <span className="font-medium">Add New Product</span>
                    </button>
                </div>
            </div>
        )}

        {activeTab === 'assets' && (
             <div className="space-y-6">
                <h2 className="text-2xl font-bold text-slate-800">Assets Manager</h2>
                <div className="grid grid-cols-2 gap-8">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                        <h3 className="font-bold mb-4 flex justify-between">
                            Clipart Library
                            <button className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded">Upload New</button>
                        </h3>
                        <div className="grid grid-cols-4 gap-2">
                            {[1,2,3,4,5,6].map(i => (
                                <div key={i} className="aspect-square bg-gray-50 rounded border border-gray-100 flex items-center justify-center">
                                    <ImageIcon size={20} className="text-gray-300" />
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                        <h3 className="font-bold mb-4 flex justify-between">
                            Fonts
                             <button className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded">Add Google Font</button>
                        </h3>
                        <ul className="space-y-2 text-sm text-gray-600">
                            <li className="flex justify-between p-2 hover:bg-gray-50 rounded"><span>Inter</span> <span className="text-green-500">Active</span></li>
                            <li className="flex justify-between p-2 hover:bg-gray-50 rounded"><span>Roboto</span> <span className="text-green-500">Active</span></li>
                            <li className="flex justify-between p-2 hover:bg-gray-50 rounded"><span>Pacifico</span> <span className="text-green-500">Active</span></li>
                        </ul>
                    </div>
                </div>
             </div>
        )}

      </main>
    </div>
  );
};

export default AdminDashboard;
