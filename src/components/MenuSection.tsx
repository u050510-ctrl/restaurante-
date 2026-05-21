import React from 'react';
import { Platillo, CategoriaPlatillo } from '../types';
import { Sparkles, Star, Plus, Check, Edit2, Trash2, ShieldCheck, EyeOff, Save } from 'lucide-react';

interface MenuSectionProps {
  menu: Platillo[];
  onAddDish: (newDish: Omit<Platillo, 'id' | 'ordenesCount'>) => void;
  onUpdateDishAvailability: (id: string, available: boolean) => void;
  onUpdateDishPrice: (id: string, price: number) => void;
  onRemoveDish: (id: string) => void;
  onUpdateDishStars: (id: string, stars: number) => void;
}

export const MenuSection: React.FC<MenuSectionProps> = ({
  menu,
  onAddDish,
  onUpdateDishAvailability,
  onUpdateDishPrice,
  onRemoveDish,
  onUpdateDishStars,
}) => {
  const [activeCategory, setActiveCategory] = React.useState<CategoriaPlatillo | 'Todos'>('Todos');
  const [showAddForm, setShowAddForm] = React.useState(false);
  const [newNombre, setNewNombre] = React.useState('');
  const [newCategoria, setNewCategoria] = React.useState<CategoriaPlatillo>('Fuertes');
  const [newPrecio, setNewPrecio] = React.useState('');
  const [newDescripcion, setNewDescripcion] = React.useState('');
  const [newTiempo, setNewTiempo] = React.useState('15');
  const [newEstrellas, setNewEstrellas] = React.useState(5);

  const [editingDishId, setEditingDishId] = React.useState<string | null>(null);
  const [editingPrice, setEditingPrice] = React.useState<string>('');

  const filteredMenu = activeCategory === 'Todos' 
    ? menu 
    : menu.filter(item => item.categoria === activeCategory);

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNombre.trim()) return alert('Ingrese el nombre del platillo');
    if (!newPrecio || isNaN(Number(newPrecio))) return alert('Ingrese un precio numérico válido');
    if (!newDescripcion.trim()) return alert('Ingrese la descripción del platillo gourmet');

    onAddDish({
      nombre: newNombre,
      categoria: newCategoria,
      precio: Number(newPrecio),
      descripcion: newDescripcion,
      tiempoMin: Number(newTiempo) || 15,
      disponible: true,
      estrellas: newEstrellas,
    });

    setNewNombre('');
    setNewPrecio('');
    setNewDescripcion('');
    setNewTiempo('15');
    setNewEstrellas(5);
    setShowAddForm(false);
  };

  const handleStartEditPrice = (dish: Platillo) => {
    setEditingDishId(dish.id);
    setEditingPrice(dish.precio.toString());
  };

  const handleSavePrice = (id: string) => {
    const parsed = parseFloat(editingPrice);
    if (isNaN(parsed) || parsed <= 0) {
      alert('Por favor ingrese un precio mayor a $0');
      return;
    }
    onUpdateDishPrice(id, parsed);
    setEditingDishId(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xs uppercase font-bold tracking-widest text-gray-500">
            Carta Gourmet de Platillos y Estrellas
          </h2>
          <p className="text-xs text-gray-400 font-medium">
            Administre los platillos estrella de su menú, configure precios, nivel de estrellas y controle inventarios de cocina.
          </p>
        </div>

        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-amber-500 hover:bg-amber-600 text-black text-xs font-bold p-2.5 px-4 rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer self-start sm:self-auto uppercase tracking-wide"
        >
          <Plus size={14} /> {showAddForm ? 'Ocultar Creación' : 'Añadir Platillo Gourmet'}
        </button>
      </div>

      {showAddForm && (
        <form 
          onSubmit={handleAddSubmit}
          className="bg-[#141414] rounded-2xl border border-white/10 p-5 space-y-4"
        >
          <h3 className="text-xs uppercase font-bold tracking-wider text-amber-500 flex items-center gap-1">
            <Sparkles size={11} /> Nuevo Platillo de la Casa
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            <div className="md:col-span-4">
              <label className="block text-xs text-gray-400 mb-1">Nombre Comercial:</label>
              <input
                type="text"
                placeholder="Ej. Risotto de Trufa y Costillas de Cordero"
                className="w-full bg-[#1c1c1c] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                value={newNombre}
                onChange={e => setNewNombre(e.target.value)}
              />
            </div>

            <div className="md:col-span-3">
              <label className="block text-xs text-gray-400 mb-1">Categoría del Menú:</label>
              <select
                className="w-full bg-[#1c1c1c] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                value={newCategoria}
                onChange={e => setNewCategoria(e.target.value as CategoriaPlatillo)}
              >
                <option value="Entradas">Entradas / Entremeses</option>
                <option value="Fuertes">Platos Fuertes / Especialidad</option>
                <option value="Postres">Postres / Repostería</option>
                <option value="Bebidas">Bebidas y Coctelería de Autor</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs text-gray-400 mb-1">Precio ($ USD):</label>
              <input
                type="text"
                placeholder="45.50"
                className="w-full bg-[#1c1c1c] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                value={newPrecio}
                onChange={e => setNewPrecio(e.target.value)}
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs text-gray-400 mb-1">Demora (Minutos):</label>
              <input
                type="number"
                min="1"
                max="60"
                className="w-full bg-[#1c1c1c] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                value={newTiempo}
                onChange={e => setNewTiempo(e.target.value)}
              />
            </div>

            <div className="md:col-span-1">
              <label className="block text-xs text-gray-400 mb-1">Calificación:</label>
              <select
                className="w-full bg-[#1c1c1c] border border-white/10 rounded-xl px-2 py-2 text-xs text-white focus:outline-none focus:border-amber-500 font-mono"
                value={newEstrellas}
                onChange={e => setNewEstrellas(Number(e.target.value))}
              >
                <option value="5">★★★★★</option>
                <option value="4">★★★★</option>
                <option value="3">★★★</option>
                <option value="2">★★</option>
                <option value="1">★</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs text-gray-400 mb-1">Descripción Gourmet / Ingredientes primores:</label>
            <textarea
              rows={2}
              placeholder="Describa el origen de los ingredientes y el sabor. Ej: Wagyu curado en sales volcánicas, puré cremoso..."
              className="w-full bg-[#1c1c1c] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
              value={newDescripcion}
              onChange={e => setNewDescripcion(e.target.value)}
            />
          </div>

          <div className="flex gap-2.5">
            <button
              type="submit"
              className="bg-amber-500 hover:bg-amber-600 text-black font-bold text-xs p-2.5 px-5 rounded-xl uppercase tracking-wider"
            >
              Confirmar Registro de Platillo
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

      {/* Category Selection Filter Tabs */}
      <div className="flex flex-wrap gap-1 bg-[#141414] border border-white/5 p-1 rounded-2xl max-w-lg">
        {(['Todos', 'Entradas', 'Fuertes', 'Postres', 'Bebidas'] as const).map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`flex-1 py-2 text-xs font-semibold rounded-xl transition-all capitalize cursor-pointer ${
              activeCategory === cat 
                ? 'bg-amber-500 text-black font-extrabold shadow-md' 
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Dishes Listing Container */}
      <div className="space-y-4">
        {filteredMenu.length === 0 ? (
          <div className="bg-[#141414] border border-dashed border-white/5 rounded-2xl p-12 text-center text-gray-500 text-xs">
            No se encontraron elementos en la categoría seleccionada.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredMenu.map(platillo => {
              const isEditingPrice = editingDishId === platillo.id;

              return (
                <div 
                  key={platillo.id}
                  className={`bg-[#141414] border border-white/5 rounded-2xl p-5 flex flex-col justify-between transition-all duration-200 hover:border-white/15 ${
                    platillo.disponible ? '' : 'opacity-50 grayscale'
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex justify-between items-start gap-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-bold text-white tracking-tight">{platillo.nombre}</h4>
                          <span className="text-[9px] bg-white/5 text-gray-400 font-mono py-0.5 px-1.5 rounded uppercase">
                            {platillo.categoria}
                          </span>
                        </div>
                        
                        {/* Star Scoring Interactive */}
                        <div className="flex gap-0.5 mt-1 text-amber-500 text-xs" title="Modificar calificación">
                          {[1, 2, 3, 4, 5].map(stVal => (
                            <button
                              key={stVal}
                              onClick={() => onUpdateDishStars(platillo.id, stVal)}
                              className="hover:scale-125 transition-transform"
                            >
                              ★
                            </button>
                          ))}
                          <span className="text-[10px] text-gray-500 ml-1.5 font-mono">
                            {platillo.estrellas} Estrellas
                          </span>
                        </div>
                      </div>

                      {/* Displaying price edit form vs actual price */}
                      <div className="text-right shrink-0">
                        {isEditingPrice ? (
                          <div className="flex items-center gap-1.5">
                            <input
                              type="text"
                              className="bg-[#1c1c1c] border border-amber-500 rounded-lg px-1.5 py-0.5 text-xs text-white font-mono w-16 focus:outline-none"
                              value={editingPrice}
                              onChange={e => setEditingPrice(e.target.value)}
                            />
                            <button
                              onClick={() => handleSavePrice(platillo.id)}
                              className="p-1 bg-emerald-500 text-black rounded hover:bg-emerald-600"
                            >
                              <Save size={11} />
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1.5">
                            <span className="font-mono text-amber-500 font-bold text-sm">
                              ${platillo.precio.toFixed(2)}
                            </span>
                            <button
                              onClick={() => handleStartEditPrice(platillo)}
                              className="p-1 hover:bg-white/5 text-gray-500 hover:text-white rounded"
                              title="Editar precio"
                            >
                              <Edit2 size={11} />
                            </button>
                          </div>
                        )}
                        <span className="text-[9px] text-gray-500 font-mono uppercase tracking-wider block mt-0.5">
                          En cocina: {platillo.tiempoMin} min
                        </span>
                      </div>
                    </div>

                    <p className="text-xs text-gray-400 italic font-medium leading-relaxed">
                      {platillo.descripcion}
                    </p>
                  </div>

                  {/* Actions Bar */}
                  <div className="mt-4 pt-3 border-t border-white/5 flex justify-between items-center text-xs">
                    <span className="text-[10px] font-mono text-gray-500">
                      Popularidad: <strong>{platillo.ordenesCount}</strong> comensales
                    </span>

                    <div className="flex gap-2">
                      <button
                        onClick={() => onUpdateDishAvailability(platillo.id, !platillo.disponible)}
                        className={`text-[10px] p-1 px-2.5 rounded-lg font-bold transition-all ${
                          platillo.disponible 
                            ? 'bg-red-950/20 text-red-400 hover:bg-red-950/40 border border-red-550/10' 
                            : 'bg-emerald-950/30 text-emerald-400 border border-emerald-500/20'
                        }`}
                      >
                        {platillo.disponible ? 'Agotado' : 'Habilitar'}
                      </button>

                      <button
                        onClick={() => {
                          if (confirm(`¿Eliminar permanente el platillo ${platillo.nombre}?`)) {
                            onRemoveDish(platillo.id);
                          }
                        }}
                        className="p-1 px-2 bg-white/5 hover:bg-red-950/40 hover:text-red-400 border border-transparent rounded-lg text-gray-500 text-[10px] transition-all"
                      >
                        <Trash2 size={11} />
                      </button>
                    </div>
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
