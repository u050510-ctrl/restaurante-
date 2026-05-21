import React from 'react';
import { Cobro, Mesa, Personal } from '../types';
import { DollarSign, Percent, HeartHandshake, TrendingUp, CreditCard, Landmark, Wallet, Plus, Trash2, CheckCircle2 } from 'lucide-react';

interface VentasSectionProps {
  cobros: Cobro[];
  tables: Mesa[];
  staff: Personal[];
  onAddManualPayment: (payment: Omit<Cobro, 'id' | 'timestamp'>) => void;
  onClearTransactions: () => void;
}

export const VentasSection: React.FC<VentasSectionProps> = ({
  cobros,
  tables,
  staff,
  onAddManualPayment,
  onClearTransactions,
}) => {
  const [showAddForm, setShowAddForm] = React.useState(false);
  const [clienteNombre, setClienteNombre] = React.useState('');
  const [newSubtotal, setNewSubtotal] = React.useState('');
  const [newPropina, setNewPropina] = React.useState('');
  const [newMetodo, setNewMetodo] = React.useState<'Efectivo' | 'Tarjeta' | 'Transferencia'>('Tarjeta');
  const [newMesaId, setNewMesaId] = React.useState('M01');

  // Calculating overall analytics
  const totalSubtotal = cobros.reduce((acc, curr) => acc + curr.subtotal, 0);
  const totalTips = cobros.reduce((acc, curr) => acc + curr.propina, 0);
  const totalRevenue = cobros.reduce((acc, curr) => acc + curr.total, 0);
  const averageTicket = cobros.length ? (totalRevenue / cobros.length) : 0;

  // Compute payment method counts
  const countEfectivo = cobros.filter(c => c.metodoId === 'Efectivo').length;
  const countTarjeta = cobros.filter(c => c.metodoId === 'Tarjeta').length;
  const countTransfer = cobros.filter(c => c.metodoId === 'Transferencia').length;
  const totalCount = cobros.length || 1;

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clienteNombre.trim()) return alert('Ingrese el nombre del pagador');
    const sub = parseFloat(newSubtotal);
    if (isNaN(sub) || sub <= 0) return alert('Ingrese un subtotal válido');
    const prop = parseFloat(newPropina) || 0;

    onAddManualPayment({
      comandaId: 'MANUAL-' + Math.floor(Math.random() * 900 + 100),
      mesaId: newMesaId,
      clienteNombre,
      subtotal: sub,
      propina: prop,
      total: sub + prop,
      metodoId: newMetodo
    });

    setClienteNombre('');
    setNewSubtotal('');
    setNewPropina('');
    setShowAddForm(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xs uppercase font-bold tracking-widest text-gray-500">
            Libro de Ventas, Caja y Cobros Activos
          </h2>
          <p className="text-xs text-gray-400 font-medium">
            Supervise los flujos financieros, propinas de los meseros y la distribución de métodos de pago en tiempo real.
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="bg-amber-500 hover:bg-amber-600 text-black text-xs font-bold p-2.5 px-4 rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer self-start sm:self-auto uppercase tracking-wide"
          >
            <Plus size={14} /> {showAddForm ? 'Ocultar Caja' : 'Registrar Venta Directa'}
          </button>

          <button
            onClick={() => {
              if (confirm('¿Está seguro de reiniciar la caja registradora? Se borrarán todos los cobros de la sesión actual.')) {
                onClearTransactions();
              }
            }}
            className="border border-red-500/20 hover:bg-red-950/20 text-red-400 text-xs font-bold p-2.5 px-4 rounded-xl transition-colors cursor-pointer"
          >
            Reiniciar Turno
          </button>
        </div>
      </div>

      {/* Analytics Bento Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="bg-[#141414] border border-white/5 rounded-2xl p-5 flex items-center justify-between shadow-lg">
          <div>
            <span className="text-[10px] text-gray-500 block uppercase font-mono tracking-wider">Total de Caja (Bruto)</span>
            <span className="text-xl font-black text-amber-500 font-mono block mt-0.5">${totalRevenue.toFixed(2)}</span>
            <span className="text-[10px] text-blue-400 block font-mono mt-1">Sin propinas: ${totalSubtotal.toFixed(2)}</span>
          </div>
          <div className="p-3 bg-amber-500/10 text-amber-400 rounded-2xl">
            <DollarSign size={20} />
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-[#141414] border border-white/5 rounded-2xl p-5 flex items-center justify-between shadow-lg">
          <div>
            <span className="text-[10px] text-gray-500 block uppercase font-mono tracking-wider">Fondo de Propinas</span>
            <span className="text-xl font-black text-emerald-400 font-mono block mt-0.5">${totalTips.toFixed(2)}</span>
            <span className="text-[10px] text-gray-400 block font-sans mt-1">
              ~{totalRevenue > 0 ? Math.round((totalTips / totalSubtotal) * 100) : 0}% sobre subtotal
            </span>
          </div>
          <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-2xl">
            <HeartHandshake size={20} />
          </div>
        </div>

        {/* Metric 3 */}
        <div className="bg-[#141414] border border-white/5 rounded-2xl p-5 flex items-center justify-between shadow-lg">
          <div>
            <span className="text-[10px] text-gray-500 block uppercase font-mono tracking-wider">Ticket Promedio</span>
            <span className="text-xl font-black text-sky-400 font-mono block mt-0.5">${averageTicket.toFixed(2)}</span>
            <span className="text-[10px] text-gray-400 block font-sans mt-1">{cobros.length} órdenes finalizadas</span>
          </div>
          <div className="p-3 bg-sky-500/10 text-sky-400 rounded-2xl">
            <TrendingUp size={20} />
          </div>
        </div>

        {/* Metric 4 */}
        <div className="bg-[#141414] border border-white/5 rounded-2xl p-5 flex flex-col justify-between shadow-lg min-h-[96px]">
          <span className="text-[10px] text-gray-500 uppercase font-mono tracking-wider">Métodos de Pago</span>
          
          <div className="space-y-1.5 mt-2">
            <div className="flex justify-between items-center text-[10px] text-gray-400">
              <span className="flex items-center gap-1"><CreditCard size={10} className="text-amber-500" /> Tarjeta:</span>
              <span className="font-mono text-white font-bold">{Math.round((countTarjeta / totalCount) * 100)}%</span>
            </div>
            <div className="flex justify-between items-center text-[10px] text-gray-400">
              <span className="flex items-center gap-1"><Wallet size={10} className="text-emerald-550 text-emerald-400" /> Efectivo:</span>
              <span className="font-mono text-white font-bold">{Math.round((countEfectivo / totalCount) * 100)}%</span>
            </div>
          </div>
        </div>
      </div>

      {showAddForm && (
        <form 
          onSubmit={handleManualSubmit}
          className="bg-[#141414] rounded-2xl border border-white/10 p-5 space-y-4"
        >
          <h3 className="text-xs uppercase font-black tracking-wider text-amber-500">
            Registrar Factura Manual Directa
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs text-gray-400 mb-1">Nombre Comercial Cliente:</label>
              <input
                type="text"
                placeholder="Ej. Sr. Juan Pérez"
                className="w-full bg-[#1c1c1c] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                value={clienteNombre}
                onChange={e => setClienteNombre(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-xs text-gray-400 mb-1">Subtotal de Platillos ($):</label>
              <input
                type="text"
                placeholder="150.00"
                className="w-full bg-[#1c1c1c] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                value={newSubtotal}
                onChange={e => setNewSubtotal(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-xs text-gray-400 mb-1">Propina Estimada ($):</label>
              <input
                type="text"
                placeholder="15.00"
                className="w-full bg-[#1c1c1c] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                value={newPropina}
                onChange={e => setNewPropina(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-xs text-gray-400 mb-1">Método de Cobro:</label>
              <select
                className="w-full bg-[#1c1c1c] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                value={newMetodo}
                onChange={e => setNewMetodo(e.target.value as any)}
              >
                <option value="Tarjeta">Tarjeta de Crédito / Débito</option>
                <option value="Efectivo">Efectivo Físico</option>
                <option value="Transferencia">Transferencia de Banco</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            className="bg-amber-500 hover:bg-amber-600 text-black font-bold text-xs p-2.5 px-4 rounded-xl uppercase tracking-wider"
          >
            Guardar Venta Directa
          </button>
        </form>
      )}

      {/* Detailed Transaction Ledger Table */}
      <div className="bg-[#141414] border border-white/5 rounded-2xl overflow-hidden">
        <div className="p-5 border-b border-white/5 flex justify-between items-center">
          <h3 className="text-xs uppercase font-bold tracking-wider text-gray-400">
            Libro Diario de Transacciones ({cobros.length})
          </h3>
          <span className="text-[10px] text-gray-500 italic">Precios expresados en USD ($)</span>
        </div>

        {cobros.length === 0 ? (
          <div className="p-12 text-center text-xs text-gray-500">
            No se han registrado cobros en el turno actual de caja.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs whitespace-no-wrap">
              <thead>
                <tr className="bg-[#1a1a1a] border-b border-white/5 text-gray-400 uppercase tracking-widest text-[9px] font-mono">
                  <th className="p-4">Folio Transacción</th>
                  <th className="p-4">Cliente / Mesa</th>
                  <th className="p-4">Método</th>
                  <th className="p-4">Subtotal</th>
                  <th className="p-4">Propina (Prop)</th>
                  <th className="p-4 text-amber-500 font-bold">Total Facturado</th>
                  <th className="p-4 text-right">Fecha y Hora</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {cobros.map(cob => (
                  <tr key={cob.id} className="hover:bg-white/[2%] transition-colors">
                    <td className="p-4 font-mono font-bold text-blue-400">#{cob.id}</td>
                    <td className="p-4">
                      <span className="block font-bold text-white leading-tight">{cob.clienteNombre}</span>
                      <span className="text-[10px] text-gray-500 font-mono">Mesa {cob.mesaId}</span>
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        cob.metodoId === 'Tarjeta' ? 'bg-amber-950/20 text-amber-400' :
                        cob.metodoId === 'Efectivo' ? 'bg-emerald-950/20 text-emerald-400' :
                        'bg-sky-950/20 text-sky-400'
                      }`}>
                        {cob.metodoId}
                      </span>
                    </td>
                    <td className="p-4 font-mono">${cob.subtotal.toFixed(2)}</td>
                    <td className="p-4 font-mono text-emerald-400 font-medium">+${cob.propina.toFixed(2)}</td>
                    <td className="p-4 font-mono text-amber-500 font-bold text-sm">${cob.total.toFixed(2)}</td>
                    <td className="p-4 text-right text-gray-500 font-mono">
                      {new Date(cob.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
};
