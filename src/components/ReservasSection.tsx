import React from 'react';
import { ReservaCliente, Mesa } from '../types';
import { Users, Calendar, Phone, Plus, CheckCircle, XCircle, Trash2, CalendarPlus } from 'lucide-react';

interface ReservasSectionProps {
  reservations: ReservaCliente[];
  tables: Mesa[];
  onAddReservation: (newRes: Omit<ReservaCliente, 'id'>) => void;
  onSeatReserver: (id: string, mesaId: string) => void;
  onCancelReserver: (id: string) => void;
  onRemoveReserver: (id: string) => void;
}

export const ReservasSection: React.FC<ReservasSectionProps> = ({
  reservations,
  tables,
  onAddReservation,
  onSeatReserver,
  onCancelReserver,
  onRemoveReserver,
}) => {
  const [showForm, setShowForm] = React.useState(false);
  const [newNombre, setNewNombre] = React.useState('');
  const [newCantidad, setNewCantidad] = React.useState(2);
  const [newTelefono, setNewTelefono] = React.useState('');
  const [newHora, setNewHora] = React.useState('20:00 PM');
  const [newMesaId, setNewMesaId] = React.useState<string>('');

  const freeTables = tables.filter(t => t.estado === 'Libre');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNombre.trim()) return alert('Ingrese el nombre de la reserva');
    if (!newTelefono.trim()) return alert('Ingrese el teléfono del cliente principal');

    onAddReservation({
      nombre: newNombre,
      cantidadPersonas: Number(newCantidad) || 2,
      telefono: newTelefono,
      hora: newHora,
      mesaAsignada: newMesaId || null,
      estado: 'Pendiente'
    });

    setNewNombre('');
    setNewCantidad(2);
    setNewTelefono('');
    setNewHora('20:00 PM');
    setNewMesaId('');
    setShowForm(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xs uppercase font-bold tracking-widest text-gray-500">
            Libro de Reservas y Clientes
          </h2>
          <p className="text-xs text-gray-400 font-medium">
            Registre reservas anticipadas, asigne mesas libres y siente a los huéspedes apenas arriben a la sucursal.
          </p>
        </div>

        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-amber-500 hover:bg-amber-600 text-black text-xs font-bold p-2.5 px-4 rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer self-start sm:self-auto uppercase tracking-wide"
        >
          <CalendarPlus size={14} /> {showForm ? 'Esconder Libro' : 'Nueva Reserva de Mesa'}
        </button>
      </div>

      {showForm && (
        <form 
          onSubmit={handleSubmit}
          className="bg-[#141414] rounded-2xl border border-white/10 p-5 space-y-4"
        >
          <h3 className="text-xs uppercase font-bold tracking-wider text-amber-500">
            Reservar Mesa para Huéspedes
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            <div className="md:col-span-4">
              <label className="block text-xs text-gray-400 mb-1">Nombre Completo del Cliente:</label>
              <input
                type="text"
                placeholder="Ej. Sra. Vanessa Valadez"
                className="w-full bg-[#1c1c1c] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                value={newNombre}
                onChange={e => setNewNombre(e.target.value)}
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs text-gray-400 mb-1">Personas:</label>
              <input
                type="number"
                min="1"
                className="w-full bg-[#1c1c1c] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                value={newCantidad}
                onChange={e => setNewCantidad(parseInt(e.target.value) || 2)}
              />
            </div>

            <div className="md:col-span-3">
              <label className="block text-xs text-gray-400 mb-1">Teléfono:</label>
              <input
                type="text"
                placeholder="+52 55..."
                className="w-full bg-[#1c1c1c] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                value={newTelefono}
                onChange={e => setNewTelefono(e.target.value)}
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs text-gray-400 mb-1">Hora de Llegada:</label>
              <input
                type="text"
                placeholder="Eg. 21:30 PM"
                className="w-full bg-[#1c1c1c] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                value={newHora}
                onChange={e => setNewHora(e.target.value)}
              />
            </div>

            <div className="md:col-span-1">
              <label className="block text-xs text-gray-400 mb-1">Mesa P.:</label>
              <select
                className="w-full bg-[#1c1c1c] border border-white/10 rounded-xl px-2 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                value={newMesaId}
                onChange={e => setNewMesaId(e.target.value)}
              >
                <option value="">Nula</option>
                {tables.map(t => (
                  <option key={t.id} value={t.id}>
                    {t.id} ({t.capacidad}p)
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              type="submit"
              className="bg-amber-500 hover:bg-amber-600 text-black font-bold text-xs p-2.5 px-5 rounded-xl uppercase tracking-wider"
            >
              Confirmar Reserva
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="border border-white/10 hover:bg-white/5 text-xs text-gray-400 p-2.5 px-4 rounded-xl"
            >
              Cancelar
            </button>
          </div>
        </form>
      )}

      {/* reservations list layout */}
      <div className="space-y-3">
        {reservations.length === 0 ? (
          <div className="bg-[#141414] border border-white/5 rounded-2xl p-10 text-center text-gray-500 text-xs">
            No hay reservaciones agendadas para el turno.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {reservations.map(res => {
              const assignedTable = res.mesaAsignada 
                ? tables.find(t => t.id === res.mesaAsignada)
                : null;

              return (
                <div 
                  key={res.id}
                  className={`bg-[#141414] border border-white/5 rounded-2xl p-5 flex flex-col justify-between transition-all duration-250 ${
                    res.estado === 'Sentado' ? 'opacity-55' : ''
                  }`}
                >
                  <div className="space-y-4">
                    {/* Header line info */}
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="text-sm font-bold text-white tracking-snug">{res.nombre}</h4>
                        <div className="flex items-center gap-1.5 mt-1 text-[11px] text-gray-400">
                          <Users size={11} className="text-amber-500" />
                          <span>{res.cantidadPersonas} Comensales</span>
                        </div>
                      </div>

                      <span className={`text-[10px] uppercase font-bold py-0.5 px-2 rounded-full font-mono ${
                        res.estado === 'Sentado' ? 'bg-emerald-950/20 text-emerald-400 border border-emerald-500/10' :
                        res.estado === 'Cancelada' ? 'bg-red-955/20 text-red-400' :
                        'bg-amber-950/20 text-amber-400 border border-amber-500/10 animate-pulse'
                      }`}>
                        {res.estado}
                      </span>
                    </div>

                    {/* Meta data parameters */}
                    <div className="text-xs bg-[#181818] p-3 rounded-xl border border-white/5 space-y-1.5 font-mono">
                      <div className="flex justify-between text-gray-400">
                        <span className="flex items-center gap-1"><Calendar size={11} /> Agenda:</span>
                        <span className="text-white font-medium">{res.hora}</span>
                      </div>
                      <div className="flex justify-between text-gray-400">
                        <span className="flex items-center gap-1"><Phone size={11} /> Teléfono:</span>
                        <span className="text-white">{res.telefono}</span>
                      </div>
                      <div className="flex justify-between text-gray-400">
                        <span>Asignación:</span>
                        <span className="text-amber-400 font-bold">
                          {res.mesaAsignada ? `Mesa ${res.mesaAsignada}` : 'Pendiente Asignar'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions line layout */}
                  <div className="mt-4 pt-3 border-t border-white/5 flex justify-between items-center text-xs">
                    <button
                      onClick={() => {
                        if (confirm(`¿Eliminar reserva de ${res.nombre}?`)) {
                          onRemoveReserver(res.id);
                        }
                      }}
                      className="text-gray-500 hover:text-red-400 text-[10px] flex items-center gap-0.5"
                    >
                      <Trash2 size={11} /> Eliminar
                    </button>

                    {res.estado === 'Pendiente' && (
                      <div className="flex gap-1.5">
                        <button
                          onClick={() => onCancelReserver(res.id)}
                          className="p-1 px-2.5 bg-red-955/20 text-red-400 rounded-lg text-[10px] font-bold"
                        >
                          Cancelar R.
                        </button>
                        
                        <button
                          onClick={() => {
                            // Check available mesas
                            const targets = tables.filter(t => t.estado === 'Libre');
                            if (targets.length === 0) {
                              alert('No hay mesas físicas libres para sentar comensales en este momento.');
                              return;
                            }
                            // Ask which mesa to assign
                            const preferred = res.mesaAsignada && tables.find(t => t.id === res.mesaAsignada)?.estado === 'Libre'
                              ? res.mesaAsignada
                              : targets[0].id;

                            const finalMesaId = prompt(`Asigne mesa para sentar al cliente (Disponibles: ${targets.map(t => t.id).join(', ')}):`, preferred);
                            if (!finalMesaId) return;

                            const chosenMesa = tables.find(t => t.id.toUpperCase() === finalMesaId.toUpperCase());
                            if (!chosenMesa || chosenMesa.estado !== 'Libre') {
                              alert(`La mesa ${finalMesaId} no existe o no se encuentra libre.`);
                              return;
                            }

                            onSeatReserver(res.id, chosenMesa.id);
                          }}
                          className="p-1 px-2.5 bg-amber-500 hover:bg-amber-600 text-black rounded-lg text-[10px] font-black uppercase"
                        >
                          Sentar a Mesa
                        </button>
                      </div>
                    )}
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
