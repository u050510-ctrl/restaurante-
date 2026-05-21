import React from 'react';
import { Mesa, Personal, Comanda, Platillo } from '../types';
import { Users, User, ArrowRight, Check, AlertTriangle, Coffee, Plus, DollarSign, Utensils } from 'lucide-react';

interface MesaGridProps {
  tables: Mesa[];
  staff: Personal[];
  orders: Comanda[];
  menu: Platillo[];
  onSelectTable: (mesa: Mesa) => void;
  selectedTable: Mesa | null;
  onSeatCustomer: (mesaId: string, clienteNombre: string, meseroId: string, personas: number) => void;
  onFreeTable: (mesaId: string) => void;
  onTriggerCheckout: (mesaId: string) => void;
  onOpenNewOrderModal: (mesaId: string) => void;
  currentUser?: any;
}

export const MesaGrid: React.FC<MesaGridProps> = ({
  tables,
  staff,
  orders,
  menu,
  onSelectTable,
  selectedTable,
  onSeatCustomer,
  onFreeTable,
  onTriggerCheckout,
  onOpenNewOrderModal,
  currentUser,
}) => {
  const [guestName, setGuestName] = React.useState('');
  const [selectedStaffId, setSelectedStaffId] = React.useState('');
  const [capacitySelected, setCapacitySelected] = React.useState(2);

  const activeWaiters = staff.filter(s => s.rol === 'Mesero' && s.estado === 'Activo');

  // Load state when table selection changes
  React.useEffect(() => {
    if (selectedTable) {
      setGuestName(selectedTable.clienteNombre || '');
      if (currentUser?.rol === 'Mesero') {
        setSelectedStaffId(currentUser.id);
      } else {
        setSelectedStaffId(selectedTable.meseroId || (activeWaiters[0]?.id || ''));
      }
      setCapacitySelected(selectedTable.capacidad);
    }
  }, [selectedTable, currentUser]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xs uppercase font-bold tracking-widest text-[#F59E0B]/8s text-gray-500">
            Distribución de Mesas en Sala
          </h2>
          <p className="text-xs text-gray-400">Presiona una mesa para gestionar estado, comanda y pagos</p>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-3 text-xs">
          <div className="flex items-center gap-1.5 bg-[#181818] border border-white/5 py-1 px-2.5 rounded-full">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-gray-400">Libre (Verde)</span>
          </div>
          <div className="flex items-center gap-1.5 bg-[#181818] border border-[#F59E0B]/30 py-1 px-2.5 rounded-full">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
            <span className="text-gray-400">Ocupada</span>
          </div>
          <div className="flex items-center gap-1.5 bg-[#181818] border border-white/5 opacity-50 py-1 px-2.5 rounded-full">
            <span className="w-2.5 h-2.5 rounded-full bg-gray-400"></span>
            <span className="text-gray-400">Reservada</span>
          </div>
          <div className="flex items-center gap-1.5 bg-red-950/20 border border-red-500/50 py-1 px-2.5 rounded-full">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500"></span>
            <span className="text-red-400 font-medium">Atención</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {tables.map(mesa => {
          const isSelected = selectedTable?.id === mesa.id;
          const activeOrder = orders.find(o => o.mesaId === mesa.id && o.estado !== 'Cobrado');

          // Determine table styling based on state
          let borderStyle = 'border-white/5 hover:border-white/15';
          let stateLabelColor = 'text-emerald-500';
          let bgStyle = 'bg-[#181818]';
          let textStyle = 'text-white';

          if (mesa.estado === 'Ocupada') {
            borderStyle = 'border-amber-500/40 shadow-[0_0_15px_rgba(245,158,11,0.06)]';
            stateLabelColor = 'text-amber-500 font-semibold';
            textStyle = 'text-amber-500';
          } else if (mesa.estado === 'Reservada') {
            borderStyle = 'border-white/5 opacity-60';
            stateLabelColor = 'text-gray-400';
          } else if (mesa.estado === 'Atención') {
            borderStyle = 'border-red-500/50';
            bgStyle = 'bg-red-950/10';
            stateLabelColor = 'text-red-500 font-bold';
            textStyle = 'text-red-400';
          }

          if (isSelected) {
            borderStyle = 'border-amber-500 ring-2 ring-amber-500/20';
          }

          return (
            <button
              key={mesa.id}
              onClick={() => onSelectTable(mesa)}
              className={`${bgStyle} border ${borderStyle} rounded-2xl p-5 flex flex-col items-center justify-center text-center gap-2 transition-all duration-200 group relative overflow-hidden h-32 cursor-pointer`}
              id={`mesa-btn-${mesa.id}`}
            >
              <div className="absolute top-2 right-3 text-[10px] text-gray-500 flex items-center gap-0.5">
                <Users size={11} className="inline opacity-60" /> {mesa.capacidad}p
              </div>

              <span className={`text-2xl font-black ${textStyle} tracking-wider`}>
                {mesa.id}
              </span>

              <div className="flex flex-col items-center">
                <span className={`text-[10px] uppercase tracking-wider ${stateLabelColor}`}>
                  {mesa.estado === 'Atención' ? 'Requiere Atención' : mesa.estado}
                </span>
                {mesa.clienteNombre && (
                  <span className="text-[11px] text-gray-400 font-medium truncate max-w-[110px] mt-0.5">
                    {mesa.clienteNombre}
                  </span>
                )}
              </div>

              {activeOrder && (
                <div className="absolute bottom-1 px-2 py-0.5 rounded-full bg-white/5 border border-white/5 text-[9px] text-gray-400 font-mono flex items-center gap-1">
                  <Coffee size={9} className="text-amber-500" /> Cmd: {activeOrder.id}
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Detail Panel for Selected Table */}
      {selectedTable && (
        <div 
          className="bg-[#141414] rounded-2xl border border-white/10 p-6 transition-all-custom"
          id={`selected-table-editor-${selectedTable.id}`}
        >
          <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-5">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/5 rounded-xl border border-white/10 flex items-center justify-center font-black text-amber-500 text-lg">
                {selectedTable.id}
              </div>
              <div>
                <h3 className="text-md font-bold text-white flex items-center gap-2">
                  Gestión de Mesa {selectedTable.id}
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                    selectedTable.estado === 'Libre' ? 'bg-emerald-950/30 text-emerald-400 border border-emerald-500/20' :
                    selectedTable.estado === 'Ocupada' ? 'bg-amber-950/30 text-amber-400 border border-amber-500/20' :
                    selectedTable.estado === 'Atención' ? 'bg-red-950/30 text-red-400 border border-red-500/20' :
                    'bg-white/5 text-gray-400'
                  }`}>
                    {selectedTable.estado}
                  </span>
                </h3>
                <p className="text-xs text-gray-500">Mesa para hasta {selectedTable.capacidad} comensales</p>
              </div>
            </div>
            
            <button 
              onClick={() => onSelectTable(null as any)}
              className="p-1 px-2 bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white rounded-lg text-xs"
            >
              Cerrar Panel
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Seating Form or Active State Info */}
            {selectedTable.estado === 'Libre' || selectedTable.estado === 'Reservada' ? (
              <div className="space-y-4">
                <h4 className="text-xs uppercase font-bold tracking-wider text-amber-500/80">
                  Asignar y Ocupar Mesa
                </h4>
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">Nombre del Cliente / Reserva:</label>
                    <input
                      type="text"
                      className="w-full bg-[#1c1c1c] border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
                      placeholder="Ej. Sra. Rodriguez, Mesa Imperial"
                      value={guestName}
                      onChange={e => setGuestName(e.target.value)}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs text-gray-400 mb-1">Mesero Asignado:</label>
                      {currentUser?.rol === 'Mesero' ? (
                        <div className="w-full bg-amber-500/10 border border-amber-500/20 text-amber-500 px-3 py-2 text-sm rounded-xl font-bold font-mono">
                          {currentUser.nombre}
                        </div>
                      ) : (
                        <select
                          className="w-full bg-[#1c1c1c] border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
                          value={selectedStaffId}
                          onChange={e => setSelectedStaffId(e.target.value)}
                        >
                          <option value="">Seleccione personal...</option>
                          {activeWaiters.map(waiter => (
                            <option key={waiter.id} value={waiter.id}>
                              {waiter.nombre}
                            </option>
                          ))}
                        </select>
                      )}
                    </div>
                    <div>
                      <label className="block text-xs text-gray-400 mb-1">Comensales:</label>
                      <input
                        type="number"
                        min="1"
                        max="12"
                        className="w-full bg-[#1c1c1c] border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
                        value={capacitySelected}
                        onChange={e => setCapacitySelected(parseInt(e.target.value) || 2)}
                      />
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      if (!guestName.trim()) return alert('Por favor ingrese el nombre del cliente');
                      if (!selectedStaffId) return alert('Por favor seleccione un mesero');
                      onSeatCustomer(selectedTable.id, guestName, selectedStaffId, capacitySelected);
                    }}
                    className="w-full py-2.5 bg-amber-500 hover:bg-amber-600 text-black font-bold rounded-xl text-xs flex items-center justify-center gap-1 transition-colors uppercase tracking-wider"
                  >
                    <Check size={14} /> Abrir Cuenta y Sentar Comensales
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <h4 className="text-xs uppercase font-bold tracking-wider text-amber-500/80">
                  Mesa Activa
                </h4>
                
                <div className="bg-white/5 rounded-xl border border-white/5 p-4 space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-400">Anfitrión / Cliente:</span>
                    <span className="font-bold text-white">{selectedTable.clienteNombre}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-400">Atendido por:</span>
                    <span className="text-amber-400 font-medium">
                      {staff.find(s => s.id === selectedTable.meseroId)?.nombre || 'Mesero no asignado'}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-400">Capacidad en mesa:</span>
                    <span className="text-white">{selectedTable.capacidad} personas</span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-2">
                  <button
                    onClick={() => onOpenNewOrderModal(selectedTable.id)}
                    className="flex-1 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs text-white font-bold flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Plus size={14} className="text-amber-500" />
                    AGREGAR PLATILLOS / PEDIDO
                  </button>
                  
                  <button
                    onClick={() => onTriggerCheckout(selectedTable.id)}
                    className="flex-1 py-2.5 bg-amber-500 hover:bg-amber-600 rounded-xl text-xs text-black font-black flex items-center justify-center gap-1.5 transition-colors shadow-lg shadow-amber-500/10"
                  >
                    <DollarSign size={14} />
                    COBRAR TOTAL / CHEQUE
                  </button>
                </div>

                {currentUser?.rol !== 'Mesero' && (
                  <button
                    onClick={() => {
                      if (confirm('¿Está seguro de forzar la liberación de esta mesa sin cobrar? Esto cerrará la comanda.')) {
                        onFreeTable(selectedTable.id);
                      }
                    }}
                    className="w-full py-1 text-[10px] text-gray-500 hover:text-red-400 text-center uppercase tracking-widest mt-1"
                  >
                    Liberar Mesa Sin Marcar Pago
                  </button>
                )}
              </div>
            )}

            {/* Live Comanda Status overview */}
            <div className="space-y-4">
              <h4 className="text-xs uppercase font-bold tracking-wider text-gray-500">
                Comanda Activa
              </h4>

              {(() => {
                const activeOrder = orders.find(o => o.mesaId === selectedTable.id && o.estado !== 'Cobrado');
                if (!activeOrder) {
                  return (
                    <div className="h-32 border border-dashed border-white/10 rounded-xl flex flex-col items-center justify-center text-center p-4">
                      <Utensils size={20} className="text-gray-600 mb-2" />
                      <p className="text-xs text-gray-500">No hay pedidos registrados en la mesa.</p>
                      <button
                        disabled={selectedTable.estado === 'Libre' || selectedTable.estado === 'Reservada'}
                        onClick={() => onOpenNewOrderModal(selectedTable.id)}
                        className="mt-2 text-xs text-amber-500 hover:underline disabled:opacity-30"
                      >
                        Crear Comanda Inicial
                      </button>
                    </div>
                  );
                }

                // Calculate subtotal
                let subtotal = 0;
                const itemsDetails = activeOrder.items.map(item => {
                  const platillo = menu.find(p => p.id === item.platilloId);
                  const itemPrice = platillo ? platillo.precio * item.cantidad : 0;
                  subtotal += itemPrice;
                  return {
                    ...item,
                    platillo,
                    totalPrice: itemPrice
                  };
                });

                return (
                  <div className="bg-[#1c1c1c] rounded-xl border border-white/5 p-4 flex flex-col justify-between h-[180px]">
                    <div className="flex justify-between items-center text-xs pb-2 border-b border-white/5">
                      <span className="font-mono text-amber-500">Cmd: #{activeOrder.id}</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        activeOrder.estado === 'Cocina' ? 'bg-orange-950/50 text-orange-400' :
                        activeOrder.estado === 'Listo' ? 'bg-green-950/50 text-green-400' :
                        activeOrder.estado === 'Entregado' ? 'bg-blue-950/50 text-blue-400 font-bold' :
                        'bg-gray-800 text-gray-400'
                      }`}>
                        {activeOrder.estado}
                      </span>
                    </div>

                    <div className="flex-1 overflow-y-auto py-2 space-y-1 pr-1 custom-scrollbar">
                      {itemsDetails.map((item, idx) => (
                        <div key={idx} className="flex justify-between items-center text-[11px] text-gray-300">
                          <span>
                            {item.cantidad}x {item.platillo?.nombre || 'Platillo desconocido'}
                          </span>
                          <span className="font-mono text-gray-400">${item.totalPrice.toFixed(2)}</span>
                        </div>
                      ))}
                    </div>

                    <div className="pt-2 border-t border-white/5 flex justify-between items-center">
                      <div>
                        <span className="text-[10px] text-gray-500 block">Subtotal estimado</span>
                        <span className="text-sm font-bold text-amber-550 font-mono text-amber-500">
                          ${subtotal.toFixed(2)}
                        </span>
                      </div>
                      
                      <span className="text-[10px] text-gray-400">
                        {Math.round((Date.now() - new Date(activeOrder.timestamp).getTime()) / 60000)}m transcurridos
                      </span>
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
