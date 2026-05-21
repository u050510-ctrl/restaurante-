import React from 'react';
import { Personal, RolPersonal, EstadoPersonal } from '../types';
import { UserPlus, Star, Award, ShieldAlert, Trash2, CheckCircle, HelpCircle, Save, Plus } from 'lucide-react';

interface PersonalSectionProps {
  staff: Personal[];
  onAddStaff: (newStaff: Omit<Personal, 'id' | 'completados' | 'pin'> & { pin?: string }) => void;
  onUpdateStaffStatus: (id: string, newStatus: EstadoPersonal) => void;
  onRemoveStaff: (id: string) => void;
  onUpdateStaffCredentials: (id: string, usuario: string, contrasena: string, pin: string) => void;
}

export const PersonalSection: React.FC<PersonalSectionProps> = ({
  staff,
  onAddStaff,
  onUpdateStaffStatus,
  onRemoveStaff,
  onUpdateStaffCredentials,
}) => {
  const [showAddForm, setShowAddForm] = React.useState(false);
  const [newNombre, setNewNombre] = React.useState('');
  const [newRol, setNewRol] = React.useState<RolPersonal>('Mesero');
  const [newEficiencia, setNewEficiencia] = React.useState(90);
  const [newUsuario, setNewUsuario] = React.useState('');
  const [newContrasena, setNewContrasena] = React.useState('');
  const [newPin, setNewPin] = React.useState('');

  // Editing credentials of specific staff ID
  const [editingStaffId, setEditingStaffId] = React.useState<string | null>(null);
  const [editUsuario, setEditUsuario] = React.useState('');
  const [editContrasena, setEditContrasena] = React.useState('');
  const [editPin, setEditPin] = React.useState('');

  const colors = [
    'from-amber-600 to-amber-800',
    'from-orange-500 to-amber-700',
    'from-blue-600 to-indigo-800',
    'from-teal-600 to-emerald-800',
    'from-violet-600 to-purple-800',
    'from-pink-600 to-rose-800',
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNombre.trim()) return alert('Por favor escriba el nombre del colaborador');
    
    if (newPin && !/^\d{4}$/.test(newPin)) {
      return alert('El PIN debe tener exactamente 4 dígitos numéricos (ej: 1234).');
    }

    // Choose a random color gradient
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    
    onAddStaff({
      nombre: newNombre,
      rol: newRol,
      estado: 'Activo',
      avatarColor: randomColor,
      eficiencia: Number(newEficiencia) || 90,
      usuario: newUsuario.trim() || undefined,
      contrasena: newContrasena || undefined,
      pin: newPin.trim() || undefined,
    });

    setNewNombre('');
    setNewRol('Mesero');
    setNewEficiencia(90);
    setNewUsuario('');
    setNewContrasena('');
    setNewPin('');
    setShowAddForm(false);
  };

  const startEditCredentials = (person: Personal) => {
    setEditingStaffId(person.id);
    setEditUsuario(person.usuario || '');
    setEditContrasena(person.contrasena || '');
    setEditPin(person.pin || '');
  };

  const handleSaveEditCredentials = (id: string) => {
    if (!editUsuario.trim() || !editContrasena.trim()) {
      alert('Tanto el usuario como la contraseña son requeridos para activar el acceso.');
      return;
    }
    if (editPin.trim() && !/^\d{4}$/.test(editPin.trim())) {
      alert('El PIN debe tener exactamente 4 dígitos numéricos (ej. 1234). Deje vacío si no requiere PIN.');
      return;
    }
    onUpdateStaffCredentials(id, editUsuario.trim(), editContrasena, editPin.trim());
    setEditingStaffId(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xs uppercase font-bold tracking-widest text-gray-500">
            Gestión de Personal y Roles
          </h2>
          <p className="text-xs text-gray-400">
            Chefs, Meseros y Hostess del servicio. Asigne turnos y visualice rendimiento militarizado.
          </p>
        </div>

        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-amber-500 hover:bg-amber-600 text-black text-xs font-bold p-2.5 px-4 rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer self-start sm:self-auto"
        >
          <UserPlus size={14} /> {showAddForm ? 'Ocultar Formulario' : 'Dar de Alta Personal'}
        </button>
      </div>

      {showAddForm && (
        <form 
          onSubmit={handleSubmit}
          className="bg-[#141414] rounded-2xl border border-white/10 p-5 space-y-4"
        >
          <h3 className="text-xs uppercase font-bold tracking-wider text-amber-500">
            Registrar Nuevo Miembro de Staff
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs text-gray-400 mb-1">Nombre Completo:</label>
              <input
                type="text"
                placeholder="Ej. Marco Aurelio"
                className="w-full bg-[#1c1c1c] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                value={newNombre}
                onChange={e => setNewNombre(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-xs text-gray-400 mb-1">Rol / Cargo:</label>
              <select
                className="w-full bg-[#1c1c1c] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                value={newRol}
                onChange={e => setNewRol(e.target.value as RolPersonal)}
              >
                <option value="Chef">Chef Jefe de Cocina</option>
                <option value="Mesero">Mesero de Sala</option>
                <option value="Host">Host / Recepción</option>
                <option value="Admin">Administrador / Cajero</option>
              </select>
            </div>

            <div>
              <label className="block text-xs text-gray-400 mb-1">Rendimiento inicial (%):</label>
              <input
                type="number"
                min="50"
                max="100"
                className="w-full bg-[#1c1c1c] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                value={newEficiencia}
                onChange={e => setNewEficiencia(parseInt(e.target.value) || 90)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-t border-white/5 pt-3">
            <div>
              <label className="block text-xs text-amber-500 mb-1 font-semibold">Usuario de Acceso:</label>
              <input
                type="text"
                placeholder="Ej. julian"
                className="w-full bg-[#1c1c1c] border border-amber-500/20 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500 font-mono"
                value={newUsuario}
                onChange={e => setNewUsuario(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-xs text-amber-500 mb-1 font-semibold">Contraseña de Acceso:</label>
              <input
                type="text"
                placeholder="Ej. waiter123"
                className="w-full bg-[#1c1c1c] border border-amber-500/20 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500 font-mono"
                value={newContrasena}
                onChange={e => setNewContrasena(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-xs text-amber-500 mb-1 font-semibold">PIN Rápido (4 dígitos):</label>
              <input
                type="text"
                maxLength={4}
                placeholder="Ej. 3333"
                className="w-full bg-[#1c1c1c] border border-amber-500/20 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500 font-mono"
                value={newPin}
                onChange={e => setNewPin(e.target.value.replace(/\D/g, ''))}
              />
            </div>
          </div>

          <div className="flex gap-2">
            <button
              type="submit"
              className="bg-amber-500 hover:bg-amber-600 text-black font-bold text-xs p-2.5 px-5 rounded-xl flex items-center gap-1"
            >
              <Save size={13} /> Guardar Registro
            </button>
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="border border-white/10 hover:bg-white/5 text-xs text-gray-400 p-2.5 px-4 rounded-xl"
            >
              Cancelar
            </button>
          </div>
        </form>
      )}

      {/* Staff Grid Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {staff.map(person => {
          // Get initials
          const initials = person.nombre
            .split(' ')
            .filter(n => n.length > 0)
            .slice(0, 2)
            .map(n => n[0].toUpperCase())
            .join('');

          return (
            <div 
              key={person.id}
              className={`bg-[#141414] rounded-2xl border transition-all duration-200 p-5 flex flex-col justify-between ${
                person.estado === 'Activo' 
                  ? 'border-white/5 hover:border-white/15' 
                  : 'border-white/5 opacity-60 bg-[#0e0e0e]'
              }`}
            >
              <div className="flex items-start gap-4">
                {/* Custom Avatar Gradient */}
                <div className={`w-12 h-12 rounded-full bg-gradient-to-tr ${person.avatarColor} border border-white/10 flex items-center justify-center text-xs font-black text-white shrink-0 shadow-lg`}>
                  {initials}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <h4 className="text-sm font-bold text-white truncate leading-snug">{person.nombre}</h4>
                    <span className="text-[10px] text-gray-500 font-mono">#{person.id}</span>
                  </div>

                  <span className="text-xs font-semibold text-amber-500">{person.rol}</span>

                  <div className="flex items-center gap-1 mt-1">
                    <Star size={11} className="fill-amber-500 text-amber-500" />
                    <span className="text-xs font-medium text-gray-300">
                      Rendimiento: {person.eficiencia}%
                    </span>
                  </div>
                </div>
              </div>

              {/* Work Statistics */}
              <div className="bg-white/5 p-3 rounded-xl border border-white/5 mt-4 flex justify-between text-center">
                <div>
                  <span className="text-[9px] text-gray-500 block uppercase font-mono">Estado Actual</span>
                  <span className={`text-[10px] font-bold uppercase tracking-wider ${
                    person.estado === 'Activo' ? 'text-emerald-400' :
                    person.estado === 'Descanso' ? 'text-amber-400' :
                    'text-red-400'
                  }`}>
                    {person.estado}
                  </span>
                </div>

                <div className="border-r border-white/5 h-6 self-center"></div>

                <div>
                  <span className="text-[9px] text-gray-500 block uppercase font-mono">Servicios</span>
                  <span className="text-xs font-bold text-white font-mono">{person.completados}</span>
                </div>
              </div>

              {/* CREDENTIALS SECTION */}
              <div className="bg-amber-500/5 hover:bg-amber-500/10 border border-amber-500/10 p-3 rounded-xl mt-3 space-y-2 text-xs transition-colors">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] text-amber-500 font-bold uppercase tracking-wider font-mono">
                    Acceso al Sistema
                  </span>
                  {editingStaffId !== person.id && (
                    <button
                      onClick={() => startEditCredentials(person)}
                      className="text-[10px] text-amber-400 hover:text-amber-300 underline font-medium cursor-pointer"
                    >
                      {person.usuario ? 'Editar' : 'Activar Cuenta'}
                    </button>
                  )}
                </div>

                {editingStaffId === person.id ? (
                  <div className="space-y-2 pt-1">
                    <div className="grid grid-cols-3 gap-1">
                      <input
                        type="text"
                        placeholder="Usuario"
                        value={editUsuario}
                        onChange={e => setEditUsuario(e.target.value)}
                        className="bg-[#121212] text-xs text-white px-2 py-1.5 rounded border border-white/10 font-mono focus:outline-none focus:border-amber-500"
                        title="Nombre de usuario"
                      />
                      <input
                        type="text"
                        placeholder="Pass"
                        value={editContrasena}
                        onChange={e => setEditContrasena(e.target.value)}
                        className="bg-[#121212] text-xs text-white px-2 py-1.5 rounded border border-white/10 font-mono focus:outline-none focus:border-amber-500"
                        title="Contraseña"
                      />
                      <input
                        type="text"
                        maxLength={4}
                        placeholder="PIN"
                        value={editPin}
                        onChange={e => setEditPin(e.target.value.replace(/\D/g, ''))}
                        className="bg-[#121212] text-xs text-white px-2 py-1.5 rounded border border-white/10 font-mono focus:outline-none focus:border-amber-500"
                        title="PIN de 4 dígitos"
                      />
                    </div>
                    <div className="flex gap-1 justify-end">
                      <button
                        onClick={() => setEditingStaffId(null)}
                        className="text-[9px] bg-[#1a1a1a] text-gray-400 hover:text-white px-2 py-1 rounded"
                      >
                        Cancelar
                      </button>
                      <button
                        onClick={() => handleSaveEditCredentials(person.id)}
                        className="text-[9px] bg-amber-500 text-black font-bold px-2.5 py-1 rounded hover:bg-amber-600"
                      >
                        Guardar
                      </button>
                    </div>
                  </div>
                ) : (
                  <div>
                    {person.usuario ? (
                      <div className="flex flex-col gap-0.5 text-gray-400 text-[11px]">
                        <div className="flex justify-between font-mono">
                          <span className="text-gray-500">Usuario:</span>
                          <span className="text-gray-300 font-medium">{person.usuario}</span>
                        </div>
                        <div className="flex justify-between font-mono">
                          <span className="text-gray-500">Contraseña:</span>
                          <span className="text-gray-300 font-medium">{person.contrasena}</span>
                        </div>
                        {person.pin && (
                          <div className="flex justify-between font-mono border-t border-white/5 mt-0.5 pt-0.5">
                            <span className="text-amber-500/80 font-semibold">PIN Rápido:</span>
                            <span className="text-amber-400 font-bold tracking-widest">{person.pin}</span>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="text-[10px] text-gray-500 italic text-center py-1">
                        Sin credenciales de acceso asignadas.
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Interactive Status Changer and HR actions */}
              <div className="mt-4 pt-3 border-t border-white/5 flex gap-2 justify-between items-center">
                <div className="flex items-center gap-1">
                  <span className="text-[10px] text-gray-550 mr-1 text-gray-400 font-medium">Turno:</span>
                  {(['Activo', 'Descanso', 'Inactivo'] as EstadoPersonal[]).map(st => (
                    <button
                      key={st}
                      onClick={() => onUpdateStaffStatus(person.id, st)}
                      className={`text-[9px] p-1 px-2 rounded-lg font-bold transition-all ${
                        person.estado === st 
                          ? 'bg-amber-500 text-black' 
                          : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      {st.slice(0, 3)}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => {
                    if (confirm(`¿Dar de baja permanente a ${person.nombre}?`)) {
                      onRemoveStaff(person.id);
                    }
                  }}
                  className="p-1 px-2 bg-red-955/20 hover:bg-red-500/20 text-gray-500 hover:text-red-400 rounded-lg transition-colors text-[10px]"
                  title="Dar de baja"
                >
                  <Trash2 size={11} className="inline mr-1" /> Baja
                </button>
              </div>

            </div>
          );
        })}
      </div>
    </div>
  );
};
