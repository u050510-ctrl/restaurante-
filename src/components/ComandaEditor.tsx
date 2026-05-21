import React from 'react';
import { Comanda, Platillo, Personal, ComandaItem, EstadoComandaItem } from '../types';
import { Plus, Minus, Send, ChefHat, Clock, AlertCircle, Sparkles, Check, Trash2, X } from 'lucide-react';

interface ComandaEditorProps {
  onClose: () => void;
  mesaId: string;
  menu: Platillo[];
  staff: Personal[];
  onSaveOrder: (mesaId: string, items: { platilloId: string; cantidad: number; notas?: string }[], notasPrincipal?: string) => void;
}

export const ComandaEditor: React.FC<ComandaEditorProps> = ({
  onClose,
  mesaId,
  menu,
  staff,
  onSaveOrder,
}) => {
  const [selectedCategory, setSelectedCategory] = React.useState<'Entradas' | 'Fuertes' | 'Postres' | 'Bebidas'>('Entradas');
  const [orderItems, setOrderItems] = React.useState<{ platilloId: string; cantidad: number; notas?: string }[]>([]);
  const [generalNotes, setGeneralNotes] = React.useState('');
  const [itemNoteText, setItemNoteText] = React.useState<{[key: string]: string}>({});

  const filteredMenu = menu.filter(item => item.categoria === selectedCategory && item.disponible);

  const handleAddItem = (platilloId: string) => {
    setOrderItems(prev => {
      const existing = prev.find(i => i.platilloId === platilloId);
      if (existing) {
        return prev.map(i => i.platilloId === platilloId ? { ...i, cantidad: i.cantidad + 1 } : i);
      }
      return [...prev, { platilloId, cantidad: 1, notas: '' }];
    });
  };

  const handleRemoveItem = (platilloId: string) => {
    setOrderItems(prev => {
      const existing = prev.find(i => i.platilloId === platilloId);
      if (existing && existing.cantidad > 1) {
        return prev.map(i => i.platilloId === platilloId ? { ...i, cantidad: i.cantidad - 1 } : i);
      }
      return prev.filter(i => i.platilloId !== platilloId);
    });
  };

  const handleRemoveAllOfItem = (platilloId: string) => {
    setOrderItems(prev => prev.filter(i => i.platilloId !== platilloId));
  };

  const handleItemNoteChange = (platilloId: string, text: string) => {
    setItemNoteText(prev => ({ ...prev, [platilloId]: text }));
    setOrderItems(prev => prev.map(item => item.platilloId === platilloId ? { ...item, notas: text } : item));
  };

  // Math totals
  const totalItems = orderItems.reduce((acc, curr) => acc + curr.cantidad, 0);
  const totalCost = orderItems.reduce((acc, curr) => {
    const platillo = menu.find(p => p.id === curr.platilloId);
    return acc + (platillo ? platillo.precio * curr.cantidad : 0);
  }, 0);

  const handleSubmit = () => {
    if (orderItems.length === 0) {
      alert('Por favor agregue al menos un platillo a la comanda.');
      return;
    }
    onSaveOrder(mesaId, orderItems, generalNotes);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-[#000000]/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div 
        className="bg-[#0F0F0F] border border-white/10 rounded-3xl w-full max-w-5xl h-[90vh] flex flex-col overflow-hidden shadow-2xl shadow-amber-500/2 text-gray-300"
        id="comanda-editor-dialog"
      >
        {/* Header */}
        <div className="border-b border-white/5 p-6 flex justify-between items-center bg-[#141414]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-500 rounded-2xl flex items-center justify-center text-black font-black text-lg shadow-[0_0_15px_rgba(245,158,11,0.2)]">
              C
            </div>
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight">Nueva Comanda en Mesa {mesaId}</h2>
              <p className="text-xs text-gray-400">Seleccione los platillos, configure notas especiales y envíe a Cocina</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-gray-500 hover:text-white bg-white/5 rounded-xl hover:bg-white/10 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 grid grid-cols-12 overflow-hidden">
          
          {/* Menu Selection Side (Left 7 Columns) */}
          <div className="col-span-12 lg:col-span-7 flex flex-col overflow-hidden border-r border-white/5 p-6 space-y-4">
            
            {/* Category tabs */}
            <div className="flex bg-[#141414] border border-white/5 p-1 rounded-2xl gap-1">
              {(['Entradas', 'Fuertes', 'Postres', 'Bebidas'] as const).map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all-custom cursor-pointer ${
                    selectedCategory === cat 
                      ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/10' 
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Dishes list */}
            <div className="flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar">
              {filteredMenu.length === 0 ? (
                <div className="text-center py-20 text-xs text-gray-500">
                  <AlertCircle className="mx-auto mb-2 opacity-50" size={24} />
                  No hay platillos disponibles en esta categoría.
                </div>
              ) : (
                filteredMenu.map(platillo => {
                  const currentQty = orderItems.find(i => i.platilloId === platillo.id)?.cantidad || 0;
                  return (
                    <div 
                      key={platillo.id}
                      className={`p-4 rounded-2xl border transition-all duration-200 flex items-center justify-between ${
                        currentQty > 0 
                          ? 'bg-amber-950/10 border-amber-500/30' 
                          : 'bg-[#141414] border-white/5 hover:border-white/10'
                      }`}
                    >
                      <div className="flex-1 min-w-0 pr-4">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-sm text-white truncate">{platillo.nombre}</span>
                          <div className="flex items-center gap-0.5 text-[9px] bg-amber-500/10 text-amber-400 px-1.5 py-0.5 rounded font-mono">
                            <Sparkles size={9} /> {'★'.repeat(platillo.estrellas)}
                          </div>
                        </div>
                        <p className="text-xs text-gray-400 mt-1 line-clamp-1 italic">{platillo.descripcion}</p>
                        
                        <div className="flex items-center gap-3 mt-2 font-mono text-[10px] text-gray-500">
                          <span>Prep: {platillo.tiempoMin} min</span>
                          <span>•</span>
                          <span>Popularidad: {platillo.ordenesCount} órdenes</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="font-mono text-sm font-semibold text-amber-500 pr-2">
                          ${platillo.precio.toFixed(2)}
                        </span>

                        {currentQty > 0 ? (
                          <div className="flex items-center bg-white/5 border border-white/10 rounded-xl p-1 gap-1">
                            <button
                              onClick={() => handleRemoveItem(platillo.id)}
                              className="w-7 h-7 bg-white/5 hover:bg-white/10 rounded-lg flex items-center justify-center text-gray-400 hover:text-white transition-colors"
                            >
                              <Minus size={12} />
                            </button>
                            <span className="w-6 font-bold text-center text-xs text-white">
                              {currentQty}
                            </span>
                            <button
                              onClick={() => handleAddItem(platillo.id)}
                              className="w-7 h-7 bg-white/5 hover:bg-white/10 rounded-lg flex items-center justify-center text-gray-400 hover:text-white transition-colors"
                            >
                              <Plus size={12} />
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => handleAddItem(platillo.id)}
                            className="bg-amber-500 hover:bg-amber-600 text-black font-bold p-2 px-3 rounded-xl text-xs flex items-center gap-1 transition-colors"
                          >
                            <Plus size={12} /> Agregar
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Checkout/Order Summary Panel (Right 5 Columns) */}
          <div className="col-span-12 lg:col-span-5 flex flex-col bg-[#111111] overflow-hidden p-6 space-y-4">
            <h3 className="text-xs uppercase font-black tracking-widest text-gray-500">
              Resumen del Pedido (Mesa {mesaId})
            </h3>

            {/* List of ordered items with dynamic note input per item */}
            <div className="flex-1 overflow-y-auto pr-1 space-y-3 custom-scrollbar">
              {orderItems.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-8 text-xs text-gray-500">
                  <ChefHat className="h-12 w-12 text-gray-700 mb-3 animate-bounce" />
                  <span>No hay platillos en la comanda actual.</span>
                  <span className="opacity-70 mt-1">Haga clic en "+ Agregar" para registrar alimentos.</span>
                </div>
              ) : (
                orderItems.map(item => {
                  const platillo = menu.find(p => p.id === item.platilloId);
                  if (!platillo) return null;
                  return (
                    <div 
                      key={item.platilloId}
                      className="p-3.5 bg-[#181818] rounded-xl border border-white/5 flex flex-col gap-2 relative group"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="font-semibold text-xs text-white">{platillo.nombre}</span>
                          <span className="text-[10px] text-gray-500 block font-mono">
                            Precio unitario: ${platillo.precio.toFixed(2)}
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono font-bold text-amber-500">
                            ${(platillo.precio * item.cantidad).toFixed(2)}
                          </span>
                          <button
                            onClick={() => handleRemoveAllOfItem(platillo.id)}
                            className="p-1 hover:bg-red-950/20 text-gray-500 hover:text-red-400 rounded transition-colors"
                            title="Remover todo"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </div>

                      {/* Flex item counter inside summary */}
                      <div className="flex items-center justify-between mt-1 text-[11px] text-gray-400">
                        <span className="opacity-95">Cantidad: {item.cantidad} unidades</span>

                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => handleRemoveItem(platillo.id)}
                            className="bg-white/5 p-1 rounded hover:bg-white/10 text-gray-400"
                          >
                            <Minus size={10} />
                          </button>
                          <button
                            onClick={() => handleAddItem(platillo.id)}
                            className="bg-white/5 p-1 rounded hover:bg-white/10 text-gray-400"
                          >
                            <Plus size={10} />
                          </button>
                        </div>
                      </div>

                      {/* Custom instructions / comments */}
                      <input
                        type="text"
                        placeholder="Instrucción especial del chef (ej. sin cebolla)"
                        className="w-full bg-[#1c1c1c] border border-white/5 rounded-lg px-2.5 py-1 text-[10px] text-gray-300 focus:outline-none focus:border-amber-500/50"
                        value={itemNoteText[platillo.id] || ''}
                        onChange={e => handleItemNoteChange(platillo.id, e.target.value)}
                      />
                    </div>
                  );
                })
              )}
            </div>

            {/* General Comanda Notes */}
            <div className="bg-[#181818] rounded-xl border border-white/5 p-4 space-y-2">
              <label className="block text-[10px] text-gray-400 uppercase font-black">
                Notas Generales para Cocina
              </label>
              <textarea
                placeholder="Ej. Servir bebidas lo antes posible, o cubiertos adicionales..."
                rows={2}
                className="w-full bg-[#121212] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                value={generalNotes}
                onChange={e => setGeneralNotes(e.target.value)}
              />
            </div>

            {/* Price Overview and Send Button */}
            <div className="bg-[#141414] border border-white/10 rounded-2xl p-4 space-y-3">
              <div className="flex justify-between text-xs text-gray-400 font-mono">
                <span>Total de Conceptos:</span>
                <span className="text-white font-bold">{totalItems} unidades</span>
              </div>
              
              <div className="flex justify-between items-center text-sm pt-2 border-t border-white/5 font-mono">
                <span className="text-gray-300 font-medium font-sans">Total de Comanda:</span>
                <span className="text-lg font-black text-amber-500">
                  ${totalCost.toFixed(2)}
                </span>
              </div>

              <div className="flex gap-2.5 pt-1">
                <button
                  onClick={onClose}
                  className="flex-1 py-3 border border-white/10 text-white rounded-xl text-xs hover:bg-white/5 font-bold transition-all"
                >
                  Cancelar
                </button>
                <button
                  disabled={orderItems.length === 0}
                  onClick={handleSubmit}
                  className="flex-1 py-3 bg-amber-500 hover:bg-amber-600 disabled:opacity-45 disabled:hover:bg-amber-500 text-black font-black rounded-xl text-xs flex items-center justify-center gap-1 transition-all uppercase shadow-lg shadow-amber-500/10"
                >
                  <Send size={12} />
                  Enviar a Cocina
                </button>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};

// COMPONENT 2: THE COCINA / CHEF PANEL
export interface KitchenItem {
  comandaId: string;
  mesaId: string;
  itemId: string;
  platilloNombre: string;
  categoria: string;
  cantidad: number;
  estado: EstadoComandaItem;
  notas?: string;
  timestamp: string;
}

interface ChefBoardProps {
  orders: Comanda[];
  menu: Platillo[];
  staff: Personal[];
  onUpdateItemStatus: (comandaId: string, itemId: string, newStatus: EstadoComandaItem) => void;
  onUpdateComandaState: (comandaId: string, state: any) => void;
}

export const ChefBoard: React.FC<ChefBoardProps> = ({
  orders,
  menu,
  staff,
  onUpdateItemStatus,
  onUpdateComandaState,
}) => {
  const [selectedChefId, setSelectedChefId] = React.useState('');
  const activeChefs = staff.filter(s => s.rol === 'Chef' && s.estado === 'Activo');

  // Load first active chef by default
  React.useEffect(() => {
    if (activeChefs.length > 0 && !selectedChefId) {
      setSelectedChefId(activeChefs[0].id);
    }
  }, [activeChefs]);

  // Extract all individual items currently cooking or pending in cuisine
  const kitchenQueue: KitchenItem[] = [];
  orders.forEach(order => {
    if (order.estado === 'Cocina' || order.estado === 'Pendiente') {
      order.items.forEach(item => {
        if (item.estado !== 'Servido') {
          const platillo = menu.find(p => p.id === item.platilloId);
          kitchenQueue.push({
            comandaId: order.id,
            mesaId: order.mesaId,
            itemId: item.id,
            platilloNombre: platillo?.nombre || 'Platillo desconocido',
            categoria: platillo?.categoria || 'Fuertes',
            cantidad: item.cantidad,
            estado: item.estado,
            notas: item.notas,
            timestamp: order.timestamp
          });
        }
      });
    }
  });

  // Sort queue: items that are 'Preparando' first, then 'Pendiente' items, then 'Listo' (or oldest first)
  const sortedQueue = [...kitchenQueue].sort((a, b) => {
    const timeA = new Date(a.timestamp).getTime();
    const timeB = new Date(b.timestamp).getTime();
    
    // Status order priority: Preparando > Pendiente > Listo
    const statusPriority = (s: EstadoComandaItem) => {
      if (s === 'Preparando') return 1;
      if (s === 'Pendiente') return 2;
      return 3;
    };

    if (statusPriority(a.estado) !== statusPriority(b.estado)) {
      return statusPriority(a.estado) - statusPriority(b.estado);
    }
    return timeA - timeB; // oldest first
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-4">
        <div>
          <h2 className="text-md font-bold text-white flex items-center gap-2">
            <ChefHat className="text-amber-500" /> Tablero de Control de Cocina
          </h2>
          <p className="text-xs text-gray-500">Monitor en tiempo real para chefs. Prepare platillos y notifique a meseros.</p>
        </div>

        {/* Chef Selection selector */}
        <div className="flex items-center gap-3">
          <span className="text-xs text-gray-400">Chef activo en este monitor:</span>
          <select
            className="bg-[#141414] border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-amber-500"
            value={selectedChefId}
            onChange={e => setSelectedChefId(e.target.value)}
          >
            {activeChefs.map(chef => (
              <option key={chef.id} value={chef.id}>
                {chef.nombre}
              </option>
            ))}
          </select>
        </div>
      </div>

      {sortedQueue.length === 0 ? (
        <div className="bg-[#141414] border border-white/5 rounded-2xl p-12 text-center text-gray-500">
          <Check className="mx-auto text-emerald-500 bg-emerald-950/20 p-3 rounded-full mb-4" size={48} />
          <h3 className="text-white font-bold text-sm">¡Cocina al día!</h3>
          <p className="text-xs text-gray-400 mt-1">No hay tickets pendientes de preparación actualmente.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sortedQueue.map((item, idx) => {
            const minutesSinceCreated = Math.round((Date.now() - new Date(item.timestamp).getTime()) / 60000);
            
            let statusBadge = '';
            let cardBorder = 'border-white/5';
            
            if (item.estado === 'Preparando') {
              statusBadge = 'bg-amber-950/20 text-amber-400 border border-amber-500/20';
              cardBorder = 'border-amber-500/30 ring-1 ring-amber-500/10 bg-[#161411]';
            } else if (item.estado === 'Listo') {
              statusBadge = 'bg-emerald-950/20 text-emerald-400 border border-emerald-500/20';
            } else {
              statusBadge = 'bg-gray-800 text-gray-400 border border-white/5';
            }

            return (
              <div 
                key={`${item.comandaId}-${item.itemId}`}
                className={`bg-[#141414] border ${cardBorder} rounded-2xl p-5 flex flex-col justify-between transition-all duration-200 hover:scale-[1.01]`}
              >
                <div>
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black bg-white/5 border border-white/10 px-2.5 py-1 rounded text-white font-mono">
                        Mesa {item.mesaId}
                      </span>
                      <span className="text-[10px] text-gray-500 font-mono">#{item.comandaId}</span>
                    </div>

                    <span className={`text-[9px] px-2 py-0.5 rounded uppercase font-bold tracking-wider ${statusBadge}`}>
                      {item.estado}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <h4 className="text-sm font-semibold text-white leading-tight">
                      {item.cantidad}x {item.platilloNombre}
                    </h4>
                    <span className="text-[10px] uppercase font-bold text-gray-600 font-mono">
                      {item.categoria}
                    </span>
                  </div>

                  {item.notas && (
                    <div className="mt-3 bg-amber-500/5 border border-amber-500/10 p-3 rounded-lg flex items-start gap-1.5 text-xs text-amber-500">
                      <AlertCircle size={13} className="mt-0.5 flex-shrink-0" />
                      <span><strong>Nota de comanda:</strong> {item.notas}</span>
                    </div>
                  )}
                </div>

                <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 text-gray-500 font-mono text-[11px]">
                    <Clock size={12} />
                    <span className={minutesSinceCreated > 15 ? 'text-red-400 font-bold' : ''}>
                      {minutesSinceCreated}m
                    </span>
                  </div>

                  <div className="flex gap-1.5">
                    {item.estado === 'Pendiente' && (
                      <button
                        onClick={() => onUpdateItemStatus(item.comandaId, item.itemId, 'Preparando')}
                        className="p-2 px-3 bg-amber-500 hover:bg-amber-600 text-black font-extrabold text-[10px] uppercase tracking-wider rounded-xl transition-all"
                      >
                        Iniciar Preparación
                      </button>
                    )}
                    
                    {item.estado === 'Preparando' && (
                      <button
                        onClick={() => onUpdateItemStatus(item.comandaId, item.itemId, 'Listo')}
                        className="p-2 px-3 bg-emerald-500 hover:bg-emerald-600 text-black font-extrabold text-[10px] uppercase tracking-wider rounded-xl transition-all"
                      >
                        Marcar Listo
                      </button>
                    )}

                    {item.estado === 'Listo' && (
                      <span className="text-[10px] text-emerald-400 font-medium italic flex items-center gap-1">
                        <Check size={11} /> Listo para servir
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
