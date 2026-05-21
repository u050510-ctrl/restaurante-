import React from 'react';
import { 
  INITIAL_STAFF, 
  INITIAL_TABLES, 
  INITIAL_MENU, 
  INITIAL_ORDERS, 
  INITIAL_RESERVATIONS, 
  INITIAL_COBROS 
} from './mockData';
import { Personal, Mesa, Platillo, Comanda, Cobro, ReservaCliente, EstadoPersonal, EstadoMesa, EstadoComandaItem, ComandaItem } from './types';
import { MesaGrid } from './components/MesaGrid';
import { ComandaEditor, ChefBoard } from './components/ComandaEditor';
import { PersonalSection } from './components/PersonalSection';
import { MenuSection } from './components/MenuSection';
import { ReservasSection } from './components/ReservasSection';
import { VentasSection } from './components/VentasSection';

// Icons
import { 
  ChefHat, 
  TableProperties, 
  BookOpen, 
  Users, 
  CalendarDays, 
  DollarSign, 
  Sparkles, 
  Clock, 
  Settings, 
  Coffee,
  X,
  CreditCard,
  UserCheck,
  Check
} from 'lucide-react';

export default function App() {
  // Current user session (Admin or staff credentials)
  const [currentUser, setCurrentUser] = React.useState<Personal | { id: string; nombre: string; rol: 'Admin'; avatarColor?: string; eficiencia?: number; completados?: number } | null>(() => {
    const saved = localStorage.getItem('estrellas_current_user');
    return saved ? JSON.parse(saved) : { id: 'ADMIN', nombre: 'Administrador de Estrellas', rol: 'Admin', avatarColor: 'from-amber-600 to-amber-800' };
  });

  const [usernameInput, setUsernameInput] = React.useState('');
  const [passwordInput, setPasswordInput] = React.useState('');
  const [pinInput, setPinInput] = React.useState('');
  const [loginMethod, setLoginMethod] = React.useState<'pin' | 'credentials'>('pin');
  const [loginError, setLoginError] = React.useState('');

  const [activeTab, setActiveTab] = React.useState<'tables' | 'kitchen' | 'menu' | 'staff' | 'reservations' | 'sales'>('tables');

  const [staff, setStaff] = React.useState<Personal[]>(() => {
    const saved = localStorage.getItem('estrellas_staff');
    return saved ? JSON.parse(saved) : INITIAL_STAFF;
  });

  const [tables, setTables] = React.useState<Mesa[]>(() => {
    const saved = localStorage.getItem('estrellas_tables');
    return saved ? JSON.parse(saved) : INITIAL_TABLES;
  });

  const [menu, setMenu] = React.useState<Platillo[]>(() => {
    const saved = localStorage.getItem('estrellas_menu');
    return saved ? JSON.parse(saved) : INITIAL_MENU;
  });

  const [orders, setOrders] = React.useState<Comanda[]>(() => {
    const saved = localStorage.getItem('estrellas_orders');
    return saved ? JSON.parse(saved) : INITIAL_ORDERS;
  });

  const [reservations, setReservations] = React.useState<ReservaCliente[]>(() => {
    const saved = localStorage.getItem('estrellas_reservations');
    return saved ? JSON.parse(saved) : INITIAL_RESERVATIONS;
  });

  const [cobros, setCobros] = React.useState<Cobro[]>(() => {
    const saved = localStorage.getItem('estrellas_cobros');
    return saved ? JSON.parse(saved) : INITIAL_COBROS;
  });

  // Selected state for active detail view
  const [selectedTable, setSelectedTable] = React.useState<Mesa | null>(null);
  
  // Modals
  const [comandaEditorMesaId, setComandaEditorMesaId] = React.useState<string | null>(null);
  const [checkoutMesaId, setCheckoutMesaId] = React.useState<string | null>(null);

  // Manual payment inputs
  const [checkoutTipPercent, setCheckoutTipPercent] = React.useState<number>(15);
  const [checkoutPaymentMethod, setCheckoutPaymentMethod] = React.useState<'Efectivo' | 'Tarjeta' | 'Transferencia'>('Tarjeta');

  // Sync with LocalStorage
  React.useEffect(() => {
    localStorage.setItem('estrellas_staff', JSON.stringify(staff));
  }, [staff]);

  React.useEffect(() => {
    localStorage.setItem('estrellas_tables', JSON.stringify(tables));
  }, [tables]);

  React.useEffect(() => {
    localStorage.setItem('estrellas_menu', JSON.stringify(menu));
  }, [menu]);

  React.useEffect(() => {
    localStorage.setItem('estrellas_orders', JSON.stringify(orders));
  }, [orders]);

  React.useEffect(() => {
    localStorage.setItem('estrellas_reservations', JSON.stringify(reservations));
  }, [reservations]);

  React.useEffect(() => {
    localStorage.setItem('estrellas_cobros', JSON.stringify(cobros));
  }, [cobros]);

  React.useEffect(() => {
    if (loginMethod !== 'pin' || pinInput.length !== 4) return;
    
    setLoginError('');
    
    // Check Admin PIN: '0000'
    if (pinInput === '0000') {
      setCurrentUser({
        id: 'ADMIN',
        nombre: 'Administrador de Estrellas',
        rol: 'Admin',
        avatarColor: 'from-amber-600 to-amber-800'
      });
      setPinInput('');
      return;
    }

    // Find personal with matching PIN
    const found = staff.find(s => s.pin === pinInput);
    if (found) {
      if (found.estado !== 'Activo') {
        setLoginError(`El empleado ${found.nombre} está registrado como "${found.estado}" y no puede iniciar turno.`);
        setPinInput('');
      } else {
        setCurrentUser(found);
        setPinInput('');
      }
    } else {
      setLoginError('PIN inválido. Ingrese un código registrado.');
      const timer = setTimeout(() => {
        setPinInput('');
      }, 1200);
      return () => clearTimeout(timer);
    }
  }, [pinInput, loginMethod, staff]);

  React.useEffect(() => {
    if (currentUser) {
      localStorage.setItem('estrellas_current_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('estrellas_current_user');
    }
  }, [currentUser]);

  // Handle staff credentials editing
  const handleUpdateStaffCredentials = (id: string, usuario: string, contrasena: string, pin: string) => {
    setStaff(prev => prev.map(s => s.id === id ? { ...s, usuario, contrasena, pin } : s));
  };

  // Safe navigation lock based on login role
  React.useEffect(() => {
    if (!currentUser) return;
    if (currentUser.rol === 'Mesero' && activeTab !== 'tables') {
      setActiveTab('tables');
    } else if (currentUser.rol === 'Chef' && activeTab !== 'kitchen') {
      setActiveTab('kitchen');
    } else if (currentUser.rol === 'Host' && activeTab !== 'tables' && activeTab !== 'reservations') {
      setActiveTab('tables');
    }
  }, [currentUser, activeTab]);

  // Real-time time display formatted
  const [currentTime, setCurrentTime] = React.useState(() => new Date());
  React.useEffect(() => {
    const interval = setInterval(() => setCurrentTime(new Date()), 15000);
    return () => clearInterval(interval);
  }, []);

  const formatServiceTime = (date: Date) => {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const period = date.getHours() >= 12 ? 'PM' : 'AM';
    return `Servicio de Cena - ${hours}:${minutes} ${period}`;
  };

  // HANDLERS FOR TABLES
  const handleSelectTable = (mesa: Mesa) => {
    setSelectedTable(mesa);
  };

  const handleSeatCustomer = (mesaId: string, clienteNombre: string, meseroId: string, personas: number) => {
    setTables(prev => prev.map(t => t.id === mesaId ? {
      ...t,
      estado: 'Ocupada',
      clienteNombre,
      meseroId,
      capacidad: personas
    } : t));

    // Update selected details if open
    setSelectedTable(prev => prev && prev.id === mesaId ? {
      ...prev,
      estado: 'Ocupada',
      clienteNombre,
      meseroId,
      capacidad: personas
    } : prev);
  };

  const handleFreeTable = (mesaId: string) => {
    setTables(prev => prev.map(t => t.id === mesaId ? {
      ...t,
      estado: 'Libre',
      clienteNombre: undefined,
      meseroId: undefined,
      comandaId: undefined
    } : t));

    // Mark current order as Cobrado just in case
    setOrders(prev => prev.map(o => o.mesaId === mesaId && o.estado !== 'Cobrado' ? {
      ...o,
      estado: 'Cobrado'
    } : o));

    if (selectedTable?.id === mesaId) {
      setSelectedTable(null);
    }
  };

  // HANDLERS FOR STAFF / HR
  const handleAddStaff = (newStaff: Omit<Personal, 'id' | 'completados'>) => {
    const newId = 'S' + (staff.length + 1).toString().padStart(2, '0');
    setStaff(prev => [...prev, {
      ...newStaff,
      id: newId,
      completados: 0
    }]);
  };

  const handleUpdateStaffStatus = (id: string, newStatus: EstadoPersonal) => {
    setStaff(prev => prev.map(s => s.id === id ? { ...s, estado: newStatus } : s));
  };

  const handleRemoveStaff = (id: string) => {
    setStaff(prev => prev.filter(s => s.id !== id));
  };

  // HANDLERS FOR MENU / DISHES
  const handleAddDish = (newDish: Omit<Platillo, 'id' | 'ordenesCount'>) => {
    const newId = 'P' + (menu.length + 1).toString().padStart(2, '0');
    setMenu(prev => [...prev, {
      ...newDish,
      id: newId,
      ordenesCount: 0
    }]);
  };

  const handleUpdateDishAvailability = (id: string, available: boolean) => {
    setMenu(prev => prev.map(p => p.id === id ? { ...p, disponible: available } : p));
  };

  const handleUpdateDishPrice = (id: string, price: number) => {
    setMenu(prev => prev.map(p => p.id === id ? { ...p, precio: price } : p));
  };

  const handleRemoveDish = (id: string) => {
    setMenu(prev => prev.filter(p => p.id !== id));
  };

  const handleUpdateDishStars = (id: string, stars: number) => {
    setMenu(prev => prev.map(p => p.id === id ? { ...p, estrellas: stars } : p));
  };

  // HANDLERS FOR COMANDAS / ORDERS
  const handleOpenNewOrderModal = (mesaId: string) => {
    setComandaEditorMesaId(mesaId);
  };

  const handleSaveOrder = (
    mesaId: string, 
    items: { platilloId: string; cantidad: number; notas?: string }[], 
    notasPrincipal?: string
  ) => {
    const tableAssigned = tables.find(t => t.id === mesaId);
    if (!tableAssigned || !tableAssigned.meseroId) return alert('La mesa no tiene mesero asignado.');

    const newComandaId = 'C' + (orders.length + Math.floor(Math.random() * 100) + 1).toString().padStart(2, '0');

    // Create unique ids for items
    const formattedItems: ComandaItem[] = items.map((it, idx) => ({
      id: `CI-${newComandaId}-${idx + 1}`,
      platilloId: it.platilloId,
      cantidad: it.cantidad,
      estado: 'Pendiente',
      notas: it.notas
    }));

    const newComanda: Comanda = {
      id: newComandaId,
      mesaId,
      items: formattedItems,
      meseroId: tableAssigned.meseroId,
      estado: 'Cocina',
      timestamp: new Date().toISOString(),
      notas: notasPrincipal
    };

    setOrders(prev => [...prev, newComanda]);

    // Update physical table to point to this comanda
    setTables(prev => prev.map(t => t.id === mesaId ? {
      ...t,
      comandaId: newComandaId
    } : t));

    // Update menu counts for popularity
    setMenu(prev => prev.map(p => {
      const orderItem = items.find(it => it.platilloId === p.id);
      return orderItem ? { ...p, ordenesCount: p.ordenesCount + orderItem.cantidad } : p;
    }));

    // Update selectedTable cache
    setSelectedTable(prev => prev && prev.id === mesaId ? {
      ...prev,
      comandaId: newComandaId
    } : prev);
  };

  // Update item status in cuisine
  const handleUpdateItemStatus = (comandaId: string, itemId: string, newStatus: EstadoComandaItem) => {
    setOrders(prev => prev.map(order => {
      if (order.id !== comandaId) return order;

      const updatedItems = order.items.map(it => it.id === itemId ? { ...it, estado: newStatus } : it);
      
      // Determine overall comanda state
      let nextComandaState = order.estado;
      const allDone = updatedItems.every(i => i.estado === 'Listo' || i.estado === 'Servido');
      const allPending = updatedItems.every(i => i.estado === 'Pendiente');

      if (allDone) {
        nextComandaState = 'Listo';
      } else if (!allPending) {
        nextComandaState = 'Cocina';
      }

      return {
        ...order,
        items: updatedItems,
        estado: nextComandaState
      };
    }));
  };

  const handleUpdateComandaState = (comandaId: string, state: any) => {
    setOrders(prev => prev.map(o => o.id === comandaId ? { ...o, estado: state } : o));
  };

  // CHECKOUTS / PAYMENTS
  const handleTriggerCheckout = (mesaId: string) => {
    setCheckoutMesaId(mesaId);
  };

  const handleSaveCheckout = () => {
    if (!checkoutMesaId) return;

    const table = tables.find(t => t.id === checkoutMesaId);
    const activeOrder = orders.find(o => o.mesaId === checkoutMesaId && o.estado !== 'Cobrado');
    
    if (!activeOrder || !table) {
      alert('Error: No hay comandas habilitadas para ser cobradas.');
      return;
    }

    // Calculating subtotal
    let subtotal = 0;
    activeOrder.items.forEach(it => {
      const plat = menu.find(p => p.id === it.platilloId);
      subtotal += plat ? plat.precio * it.cantidad : 0;
    });

    const tip = subtotal * (checkoutTipPercent / 100);
    const finalTotal = subtotal + tip;

    const invoice: Cobro = {
      id: 'TX' + (cobros.length + 1).toString().padStart(2, '0'),
      comandaId: activeOrder.id,
      mesaId: checkoutMesaId,
      clienteNombre: table.clienteNombre || 'Cliente anónimo',
      subtotal,
      propina: tip,
      total: finalTotal,
      metodoId: checkoutPaymentMethod,
      timestamp: new Date().toISOString()
    };

    // Save
    setCobros(prev => [...prev, invoice]);

    // Track statistics for waiter and chef
    setStaff(prev => prev.map(s => {
      if (s.id === activeOrder.meseroId) {
        return { ...s, completados: s.completados + 1, eficiencia: Math.min(100, s.eficiencia + 1) };
      }
      return s;
    }));

    // Release table
    setTables(prev => prev.map(t => t.id === checkoutMesaId ? {
      ...t,
      estado: 'Libre',
      clienteNombre: undefined,
      meseroId: undefined,
      comandaId: undefined
    } : t));

    // Mark comanda as billing completed
    setOrders(prev => prev.map(o => o.id === activeOrder.id ? {
      ...o,
      estado: 'Cobrado'
    } : o));

    // Reset selection caches
    if (selectedTable?.id === checkoutMesaId) {
      setSelectedTable(null);
    }
    setCheckoutMesaId(null);
  };

  // HANDLERS FOR RESERVACIONES
  const handleAddReservation = (newRes: Omit<ReservaCliente, 'id'>) => {
    const newId = 'R' + (reservations.length + 1).toString().padStart(2, '0');
    setReservations(prev => [...prev, {
      ...newRes,
      id: newId
    }]);

    // If pre-assigned table is free, make it Reservada
    if (newRes.mesaAsignada && newRes.mesaAsignada !== '') {
      setTables(prev => prev.map(t => t.id === newRes.mesaAsignada ? {
        ...t,
        estado: 'Reservada',
        clienteNombre: newRes.nombre
      } : t));
    }
  };

  const handleSeatReserver = (id: string, mesaId: string) => {
    const reservation = reservations.find(r => r.id === id);
    if (!reservation) return;

    // Change reservation status
    setReservations(prev => prev.map(r => r.id === id ? { ...r, estado: 'Sentado', mesaAsignada: mesaId } : r));

    // Open active table
    // Prompt for waiter
    const waiters = staff.filter(s => s.rol === 'Mesero' && s.estado === 'Activo');
    const defaultWaiterId = waiters[0]?.id || 'S03';

    handleSeatCustomer(mesaId, reservation.nombre, defaultWaiterId, reservation.cantidadPersonas);
  };

  const handleCancelReserver = (id: string) => {
    const res = reservations.find(r => r.id === id);
    setReservations(prev => prev.map(r => r.id === id ? { ...r, estado: 'Cancelada' } : r));

    // Free pre-assigned table if any
    if (res && res.mesaAsignada) {
      setTables(prev => prev.map(t => t.id === res.mesaAsignada ? {
        ...t,
        estado: 'Libre',
        clienteNombre: undefined
      } : t));
    }
  };

  const handleRemoveReserver = (id: string) => {
    setReservations(prev => prev.filter(r => r.id !== id));
  };

  const handleAddManualPayment = (payment: Omit<Cobro, 'id' | 'timestamp'>) => {
    setCobros(prev => [...prev, {
      ...payment,
      id: 'TX-M' + (cobros.length + 1).toString().padStart(2, '0'),
      timestamp: new Date().toISOString()
    }]);
  };

  const handleClearTransactions = () => {
    setCobros([]);
  };

  // Sales Today Calculation
  const totalSalesToday = cobros.reduce((acc, curr) => acc + curr.total, 0);

  // Authentication Submission Handler
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    const u = usernameInput.trim().toLowerCase();
    const p = passwordInput;

    if (!u || !p) {
      setLoginError('Por favor complete todos los campos.');
      return;
    }

    if (u === 'admin' && p === 'admin') {
      setCurrentUser({
        id: 'ADMIN',
        nombre: 'Administrador de Estrellas',
        rol: 'Admin',
        avatarColor: 'from-amber-600 to-amber-800'
      });
      setUsernameInput('');
      setPasswordInput('');
      return;
    }

    const found = staff.find(s => s.usuario?.toLowerCase() === u && s.contrasena === p);
    if (found) {
      setCurrentUser(found);
      setUsernameInput('');
      setPasswordInput('');
    } else {
      setLoginError('Usuario o contraseña incorrectos. Verifique sus claves.');
    }
  };

  const handleQuickLogin = (user: string, pass: string, pin?: string) => {
    setLoginError('');
    if (pin) {
      setLoginMethod('pin');
      setPinInput(pin);
      return;
    }

    setLoginMethod('credentials');
    setUsernameInput(user);
    setPasswordInput(pass);
    
    // Auto-login instantly for convenience
    if (user === 'admin' && pass === 'admin') {
      setCurrentUser({
        id: 'ADMIN',
        nombre: 'Administrador de Estrellas',
        rol: 'Admin',
        avatarColor: 'from-amber-600 to-amber-800'
      });
      setUsernameInput('');
      setPasswordInput('');
      return;
    }

    const found = staff.find(s => s.usuario?.toLowerCase() === user.toLowerCase() && s.contrasena === pass);
    if (found) {
      setCurrentUser(found);
      setUsernameInput('');
      setPasswordInput('');
    } else {
      setLoginError('Error de QuickLogin: Credenciales no registradas en personal.');
    }
  };

  // PIN pad helper handlers
  const handlePinAction = (num: string) => {
    setLoginError('');
    if (pinInput.length < 4) {
      setPinInput(prev => prev + num);
    }
  };

  const handlePinDelete = () => {
    setPinInput(prev => prev.slice(0, -1));
  };

  const handlePinClear = () => {
    setPinInput('');
  };

  // Keyboard interceptor for PIN mode
  React.useEffect(() => {
    if (currentUser || loginMethod !== 'pin') return;
    const handleKeyDown = (e: KeyboardEvent) => {
      // Avoid intercepting if an input element has focus
      const activeEl = document.activeElement;
      if (activeEl && (activeEl.tagName === 'INPUT' || activeEl.tagName === 'TEXTAREA')) {
        return;
      }
      
      if (e.key >= '0' && e.key <= '9') {
        if (pinInput.length < 4) {
          setPinInput(p => p + e.key);
        }
      } else if (e.key === 'Backspace') {
        setPinInput(p => p.slice(0, -1));
      } else if (e.key === 'Escape' || e.key === 'Delete') {
        setPinInput('');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [pinInput, currentUser, loginMethod]);

  if (!currentUser) {
    return (
      <div className="w-full min-h-screen bg-[#070707] text-gray-300 flex flex-col items-center justify-center p-4 font-sans selection:bg-amber-500 selection:text-black">
        {/* Glow backdrop decorative */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] sm:w-[500px] h-[350px] bg-amber-500/10 rounded-full blur-[120px] pointer-events-none"></div>

        <div className="w-full max-w-md bg-[#101010] border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl relative z-10 space-y-5">
          
          {/* Header Identity */}
          <div className="text-center space-y-2">
            <div className="mx-auto w-12 h-12 bg-gradient-to-tr from-amber-500 to-yellow-400 rounded-xl flex items-center justify-center text-black font-black text-2xl shadow-[0_0_30px_rgba(245,158,11,0.3)]">
              ★
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-widest uppercase">
              Estrellas
            </h1>
            <p className="text-[11px] text-amber-500 font-mono tracking-widest uppercase font-bold">
              Premium Portal de Acceso
            </p>
          </div>

          {/* Toggle Login Method */}
          <div className="grid grid-cols-2 bg-[#161616] border border-white/5 p-1 rounded-2xl">
            <button
              onClick={() => {
                setLoginMethod('pin');
                setLoginError('');
                setPinInput('');
              }}
              className={`py-2 text-xs font-bold tracking-wider rounded-xl transition-all cursor-pointer ${
                loginMethod === 'pin' 
                  ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/10' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              🔑 PIN RÁPIDO
            </button>
            <button
              onClick={() => {
                setLoginMethod('credentials');
                setLoginError('');
              }}
              className={`py-2 text-xs font-bold tracking-wider rounded-xl transition-all cursor-pointer ${
                loginMethod === 'credentials' 
                  ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/10' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              👥 USUARIO / CLAVE
            </button>
          </div>

          {/* Error Alert Box */}
          {loginError && (
            <div className="bg-red-500/10 border border-red-500/25 rounded-2xl p-3 text-xs text-red-400 text-center font-medium animate-pulse">
              ⚠️ {loginError}
            </div>
          )}

          {/* Login Renderings */}
          {loginMethod === 'pin' ? (
            <div className="space-y-5">
              {/* Visual PIN indicators */}
              <div className="flex justify-center gap-4 py-2">
                {[0, 1, 2, 3].map(idx => (
                  <div
                    key={idx}
                    className={`h-4 w-4 rounded-full border-2 transition-all duration-150 ${
                      pinInput.length > idx
                        ? 'bg-amber-500 border-amber-500 scale-110 shadow-[0_0_10px_rgba(245,158,11,0.5)]'
                        : 'border-white/20 bg-transparent'
                    }`}
                  ></div>
                ))}
              </div>

              {/* Virtual Number Pad for POS Touch terminals */}
              <div className="grid grid-cols-3 gap-3 w-full max-w-[280px] mx-auto">
                {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map(num => (
                  <button
                    key={num}
                    onClick={() => handlePinAction(num)}
                    className="h-12 rounded-2xl bg-[#161616] hover:bg-amber-500/10 active:bg-amber-500/20 border border-white/5 hover:border-amber-500/30 text-white font-bold text-lg flex items-center justify-center transition-all cursor-pointer active:scale-95"
                  >
                    {num}
                  </button>
                ))}
                
                {/* Clear Button */}
                <button
                  type="button"
                  onClick={handlePinClear}
                  className="h-12 rounded-2xl bg-[#161616] hover:bg-red-500/10 active:bg-red-500/20 border border-white/5 text-xs text-red-400 hover:text-red-300 font-bold tracking-wider flex items-center justify-center transition-all cursor-pointer"
                  title="Limpiar código"
                >
                  Clear
                </button>

                {/* Zero Button */}
                <button
                  key="0"
                  onClick={() => handlePinAction('0')}
                  className="h-12 rounded-2xl bg-[#161616] hover:bg-amber-500/10 active:bg-amber-500/20 border border-white/5 hover:border-amber-500/30 text-white font-bold text-lg flex items-center justify-center transition-all cursor-pointer active:scale-95"
                >
                  0
                </button>

                {/* Backspace Button */}
                <button
                  type="button"
                  onClick={handlePinDelete}
                  className="h-12 rounded-2xl bg-[#161616] hover:bg-amber-500/10 active:bg-amber-500/20 border border-white/5 text-xs text-amber-500 font-bold flex items-center justify-center transition-all cursor-pointer"
                  title="Borrar dígito"
                >
                  ←
                </button>
              </div>

              <p className="text-[10px] text-gray-500 text-center font-mono leading-tight">
                * Puede usar la pantalla táctil o el teclado físico de su dispositivo para presionar su PIN.
              </p>
            </div>
          ) : (
            /* Form / Credentials method */
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="block text-[10px] text-gray-400 uppercase font-bold tracking-wider font-mono">
                  Usuario de Empleado:
                </label>
                <input
                  type="text"
                  value={usernameInput}
                  onChange={e => setUsernameInput(e.target.value)}
                  className="w-full bg-[#181818] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-500 transition-colors placeholder:text-gray-600 font-mono"
                  placeholder="Ej: julian"
                  id="login-username"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-[10px] text-gray-400 uppercase font-bold tracking-wider font-mono">
                  Contraseña / Clave:
                </label>
                <input
                  type="password"
                  value={passwordInput}
                  onChange={e => setPasswordInput(e.target.value)}
                  className="w-full bg-[#181818] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-500 transition-colors placeholder:text-gray-600 font-mono"
                  placeholder="••••••••"
                  id="login-password"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-amber-500 hover:bg-amber-600 active:scale-[0.98] text-black font-black tracking-wider text-xs uppercase rounded-xl transition-all shadow-lg shadow-amber-500/10 cursor-pointer"
              >
                Iniciar Sesión
              </button>
            </form>
          )}

          {/* Divider */}
          <div className="relative flex py-1 items-center">
            <div className="flex-grow border-t border-white/5"></div>
            <span className="flex-shrink mx-4 text-[9px] text-gray-500 font-mono uppercase bg-[#101010] px-1.5 whitespace-nowrap">
              Acceso Rápido (Prueba Demo)
            </span>
            <div className="flex-grow border-t border-white/5"></div>
          </div>

          {/* Quick Logins with the PIN specified as requested */}
          <div className="grid grid-cols-2 gap-2 text-left">
            <button
              onClick={() => handleQuickLogin('admin', 'admin', '0000')}
              className="bg-[#141414] hover:bg-amber-500/5 hover:border-amber-500/30 border border-white/5 p-2.5 rounded-xl transition-all cursor-pointer group text-left"
            >
              <div className="flex justify-between items-center">
                <span className="text-[9px] text-gray-500 font-bold leading-none font-mono">ROOT / GENERAL</span>
                <span className="px-1 text-[8px] bg-amber-500/10 text-amber-500 border border-amber-500/20 font-mono rounded">PIN: 0000</span>
              </div>
              <span className="block text-[11px] text-white font-bold tracking-tight mt-1">Administrador</span>
              <span className="block text-[9px] text-gray-500 font-mono leading-none mt-1">admin / admin</span>
            </button>

            <button
              onClick={() => handleQuickLogin('julian', 'waiter123', '3333')}
              className="bg-[#141414] hover:bg-amber-500/5 hover:border-amber-500/30 border border-white/5 p-2.5 rounded-xl transition-all cursor-pointer group text-left"
            >
              <div className="flex justify-between items-center">
                <span className="text-[9px] text-sky-400 font-bold leading-none font-mono">MESERO (S03)</span>
                <span className="px-1 text-[8px] bg-amber-500/10 text-amber-500 border border-amber-500/20 font-mono rounded">PIN: 3333</span>
              </div>
              <span className="block text-[11px] text-white font-bold tracking-tight mt-1">Julian Diaz</span>
              <span className="block text-[9px] text-gray-500 font-mono leading-none mt-1">julian / waiter123</span>
            </button>

            <button
              onClick={() => handleQuickLogin('carla', 'waiter123', '4444')}
              className="bg-[#141414] hover:bg-amber-500/5 hover:border-amber-500/30 border border-white/5 p-2.5 rounded-xl transition-all cursor-pointer group text-left"
            >
              <div className="flex justify-between items-center">
                <span className="text-[9px] text-teal-400 font-bold leading-none font-mono">MESERO (S04)</span>
                <span className="px-1 text-[8px] bg-amber-500/10 text-amber-500 border border-amber-500/20 font-mono rounded">PIN: 4444</span>
              </div>
              <span className="block text-[11px] text-white font-bold tracking-tight mt-1">Carla Herrera</span>
              <span className="block text-[9px] text-gray-500 font-mono leading-none mt-1">carla / waiter123</span>
            </button>

            <button
              onClick={() => handleQuickLogin('marco', 'chef123', '1111')}
              className="bg-[#141414] hover:bg-amber-500/5 hover:border-amber-500/30 border border-white/5 p-2.5 rounded-xl transition-all cursor-pointer group text-left"
            >
              <div className="flex justify-between items-center">
                <span className="text-[9px] text-orange-400 font-bold leading-none font-mono">CHEF (S01)</span>
                <span className="px-1 text-[8px] bg-amber-500/10 text-amber-500 border border-amber-500/20 font-mono rounded">PIN: 1111</span>
              </div>
              <span className="block text-[11px] text-white font-bold tracking-tight mt-1">Marco Rossi</span>
              <span className="block text-[9px] text-gray-500 font-mono leading-none mt-1">marco / chef123</span>
            </button>
          </div>

          <p className="text-[10px] text-gray-500 text-center font-mono leading-tight">
            * Las cuentas creadas por el Administrador en la pestaña <span className="text-amber-500">"Personal"</span> también se validan instantáneamente aquí.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-[#0A0A0A] text-gray-300 flex flex-col md:flex-row font-sans select-none overflow-x-hidden">
      
      {/* Sidebar navigation */}
      <aside className="w-full md:w-24 bg-[#111111] border-b md:border-b-0 md:border-r border-white/5 flex flex-row md:flex-col items-center justify-between p-4 md:py-8 gap-4 md:gap-10 shrink-0">
        
        {/* Logo */}
        <div className="w-10 h-10 md:w-12 md:h-12 bg-amber-500 rounded-xl flex items-center justify-center text-black font-black text-xl shadow-[0_0_20px_rgba(245,158,11,0.25)]">
          ★
        </div>

        {/* Icons navigation list */}
        <nav className="flex flex-row md:flex-col gap-2 md:gap-6 flex-1 justify-center">
          {/* Tables Tab: Available for Admin, Mesero, Host */}
          {(currentUser?.rol === 'Admin' || currentUser?.rol === 'Mesero' || currentUser?.rol === 'Host') && (
            <button
              onClick={() => setActiveTab('tables')}
              className={`p-3 rounded-xl transition-all cursor-pointer ${
                activeTab === 'tables' ? 'bg-white/5 text-amber-500' : 'text-gray-500 hover:text-white'
              }`}
              title="Distribución Mesas"
            >
              <TableProperties size={20} />
            </button>
          )}

          {/* Kitchen Tab: Available for Admin, Chef */}
          {(currentUser?.rol === 'Admin' || currentUser?.rol === 'Chef') && (
            <button
              onClick={() => setActiveTab('kitchen')}
              className={`p-3 rounded-xl transition-all cursor-pointer relative ${
                activeTab === 'kitchen' ? 'bg-white/5 text-amber-500' : 'text-gray-500 hover:text-white'
              }`}
              title="Cocina / Pedidos"
            >
              <ChefHat size={20} />
              {orders.filter(o => o.estado === 'Cocina' || o.estado === 'Pendiente').length > 0 && (
                <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-amber-500 border border-[#111111] rounded-full"></span>
              )}
            </button>
          )}

          {/* Menu Tab: Available for Admin, Chef */}
          {(currentUser?.rol === 'Admin' || currentUser?.rol === 'Chef') && (
            <button
              onClick={() => setActiveTab('menu')}
              className={`p-3 rounded-xl transition-all cursor-pointer ${
                activeTab === 'menu' ? 'bg-white/5 text-amber-500' : 'text-gray-500 hover:text-white'
              }`}
              title="Carta Gourmet"
            >
              <BookOpen size={20} />
            </button>
          )}

          {/* Staff Tab: Available for Admin only */}
          {currentUser?.rol === 'Admin' && (
            <button
              onClick={() => setActiveTab('staff')}
              className={`p-3 rounded-xl transition-all cursor-pointer ${
                activeTab === 'staff' ? 'bg-white/5 text-amber-500' : 'text-gray-500 hover:text-white'
              }`}
              title="Personal & Staff"
            >
              <Users size={20} />
            </button>
          )}

          {/* Reservations Tab: Available for Admin, Host */}
          {(currentUser?.rol === 'Admin' || currentUser?.rol === 'Host') && (
            <button
              onClick={() => setActiveTab('reservations')}
              className={`p-3 rounded-xl transition-all cursor-pointer relative ${
                activeTab === 'reservations' ? 'bg-white/5 text-amber-500' : 'text-gray-500 hover:text-white'
              }`}
              title="Huéspedes"
            >
              <CalendarDays size={20} />
              {reservations.filter(r => r.estado === 'Pendiente').length > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-sky-500 rounded-full"></span>
              )}
            </button>
          )}

          {/* Sales Tab: Available for Admin only */}
          {currentUser?.rol === 'Admin' && (
            <button
              onClick={() => setActiveTab('sales')}
              className={`p-3 rounded-xl transition-all cursor-pointer ${
                activeTab === 'sales' ? 'bg-white/5 text-amber-500' : 'text-gray-500 hover:text-white'
              }`}
              title="Ventas y Caja"
            >
              <DollarSign size={20} />
            </button>
          )}
        </nav>

        {/* Mini version indicator or profile */}
        <div className="hidden md:flex flex-col items-center text-[10px] text-gray-600 gap-1 mt-auto font-mono">
          <span>v1.0</span>
          <div className="w-8 h-8 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 font-bold font-sans">
            ER
          </div>
        </div>
      </aside>

      {/* Main Container Section */}
      <main className="flex-1 flex flex-col h-full bg-[#0F0F0F] overflow-y-auto min-h-screen">
        
        {/* Header Block bar */}
        <header className="h-20 border-b border-white/5 flex items-center px-6 md:px-8 justify-between shrink-0 bg-[#0F0F0F]">
          <div>
            <h1 className="text-md md:text-lg font-bold tracking-tight text-white flex items-center gap-2">
              {activeTab === 'tables' && 'Distribución de Mesas'}
              {activeTab === 'kitchen' && 'Tablier de Cocina Real-Time'}
              {activeTab === 'menu' && 'Carta de Alimentos de Autor'}
              {activeTab === 'staff' && 'Administración de personal'}
              {activeTab === 'reservations' && 'Reserva de Clientes'}
              {activeTab === 'sales' && 'Módulo Financiero / Caja'}
              
              <span className="hidden sm:inline-flex items-center gap-0.5 bg-amber-500/10 text-amber-500 px-2.5 py-0.5 rounded text-[10px] font-bold tracking-widest font-mono">
                SISTEMA PREMIUM 5★
              </span>
            </h1>
            <p className="text-xs text-gray-500 font-semibold">{formatServiceTime(currentTime)}</p>
          </div>

          <div className="flex items-center gap-6">
            <div className="text-right hidden sm:block">
              <span className="block text-[10px] uppercase font-mono tracking-wider text-gray-500">Caja Hoy (USD)</span>
              <span className="text-[#F59E0B] font-black text-sm md:text-md font-mono">${totalSalesToday.toFixed(2)}</span>
            </div>
            
            {/* Dynamic User Profile info and Logout button */}
            <div className="flex items-center gap-3 bg-[#161616] border border-white/5 pl-3 pr-2 py-1.5 rounded-2xl shadow-lg">
              <div className="text-right hidden md:block">
                <span className="block text-xs font-bold text-white max-w-[130px] truncate">
                  {currentUser?.nombre}
                </span>
                <span className="block text-[10px] text-amber-500 font-mono tracking-wider uppercase leading-none mt-1">
                  Rol: {currentUser?.rol}
                </span>
              </div>

              <button
                onClick={() => {
                  if (confirm('¿Cerrar sesión del sistema?')) {
                    setCurrentUser(null);
                  }
                }}
                className="h-9 px-3 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 border border-red-500/20 text-[10px] font-bold tracking-widest uppercase transition-all duration-150 cursor-pointer"
                title="Cerrar Sesión (Cerrar turno)"
              >
                Salir
              </button>
            </div>
          </div>
        </header>

        {/* Nested Contents body based on active tab state */}
        <div className="flex-1 p-6 md:p-8 space-y-8 max-w-7xl w-full mx-auto">
          {activeTab === 'tables' && (
            <MesaGrid
              tables={tables}
              staff={staff}
              orders={orders}
              menu={menu}
              onSelectTable={handleSelectTable}
              selectedTable={selectedTable}
              onSeatCustomer={handleSeatCustomer}
              onFreeTable={handleFreeTable}
              onTriggerCheckout={handleTriggerCheckout}
              onOpenNewOrderModal={handleOpenNewOrderModal}
              currentUser={currentUser}
            />
          )}

          {activeTab === 'kitchen' && (
            <ChefBoard
              orders={orders}
              menu={menu}
              staff={staff}
              onUpdateItemStatus={handleUpdateItemStatus}
              onUpdateComandaState={handleUpdateComandaState}
            />
          )}

          {activeTab === 'menu' && (
            <MenuSection
              menu={menu}
              onAddDish={handleAddDish}
              onUpdateDishAvailability={handleUpdateDishAvailability}
              onUpdateDishPrice={handleUpdateDishPrice}
              onRemoveDish={handleRemoveDish}
              onUpdateDishStars={handleUpdateDishStars}
            />
          )}

          {activeTab === 'staff' && (
            <PersonalSection
              staff={staff}
              onAddStaff={handleAddStaff}
              onUpdateStaffStatus={handleUpdateStaffStatus}
              onRemoveStaff={handleRemoveStaff}
              onUpdateStaffCredentials={handleUpdateStaffCredentials}
            />
          )}

          {activeTab === 'reservations' && (
            <ReservasSection
              reservations={reservations}
              tables={tables}
              onAddReservation={handleAddReservation}
              onSeatReserver={handleSeatReserver}
              onCancelReserver={handleCancelReserver}
              onRemoveReserver={handleRemoveReserver}
            />
          )}

          {activeTab === 'sales' && (
            <VentasSection
              cobros={cobros}
              tables={tables}
              staff={staff}
              onAddManualPayment={handleAddManualPayment}
              onClearTransactions={handleClearTransactions}
            />
          )}
        </div>

      </main>

      {/* COMPONENT MODALS AT TOP LEVEL */}

      {/* 1. COMANDA EDITOR MODAL */}
      {comandaEditorMesaId && (
        <ComandaEditor
          mesaId={comandaEditorMesaId}
          menu={menu}
          staff={staff}
          onClose={() => setComandaEditorMesaId(null)}
          onSaveOrder={handleSaveOrder}
        />
      )}

      {/* 2. PREMIUM BILL CHECKOUT / PAYMENT MODAL */}
      {checkoutMesaId && (() => {
        const table = tables.find(t => t.id === checkoutMesaId);
        const activeOrder = orders.find(o => o.mesaId === checkoutMesaId && o.estado !== 'Cobrado');
        
        let subtotal = 0;
        const orderedFood = activeOrder?.items.map(it => {
          const plat = menu.find(p => p.id === it.platilloId);
          const price = plat ? plat.precio * it.cantidad : 0;
          subtotal += price;
          return { ...it, platillo: plat, totalPrice: price };
        }) || [];

        const tipAmount = subtotal * (checkoutTipPercent / 100);
        const finalTotal = subtotal + tipAmount;

        return (
          <div className="fixed inset-0 bg-[#000000]/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-[#0F0F0F] border border-white/10 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl text-gray-300">
              
              <div className="border-b border-white/5 p-5 flex justify-between items-center bg-[#141414]">
                <div className="flex items-center gap-2">
                  <CreditCard className="text-amber-500" size={18} />
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">Checkout Cuenta - Mesa {checkoutMesaId}</h3>
                </div>
                <button 
                  onClick={() => setCheckoutMesaId(null)}
                  className="p-1 px-2 hover:bg-white/5 text-gray-400 rounded-lg text-xs"
                >
                  <X size={15} />
                </button>
              </div>

              <div className="p-6 space-y-4">
                <div className="text-xs text-gray-400 font-mono flex justify-between">
                  <span>Anfitrión: {table?.clienteNombre || 'Comensales'}</span>
                  <span>Cmd: {activeOrder?.id}</span>
                </div>

                {/* Receipts list */}
                <div className="bg-[#141414] border border-white/5 rounded-xl p-4 space-y-2 max-h-[160px] overflow-y-auto custom-scrollbar">
                  {orderedFood.length === 0 ? (
                    <span className="text-xs text-gray-500 font-sans block text-center">No hay productos registrados en el ticket.</span>
                  ) : (
                    orderedFood.map((food, i) => (
                      <div key={i} className="flex justify-between text-xs font-mono">
                        <span className="text-gray-300">{food.cantidad}x {food.platillo?.nombre}</span>
                        <span className="text-gray-400">${food.totalPrice.toFixed(2)}</span>
                      </div>
                    ))
                  )}
                </div>

                {/* Subtotal line */}
                <div className="flex justify-between items-center text-xs font-mono border-t border-white/5 pt-3">
                  <span className="text-gray-400">Subtotal de Platillos:</span>
                  <span className="text-white font-bold">${subtotal.toFixed(2)}</span>
                </div>

                {/* Tip selector 10%, 15%, 20%, 0% */}
                <div className="space-y-1.5">
                  <label className="block text-[10px] text-gray-400 uppercase font-bold tracking-wider font-mono">
                    Añadir Propina (%):
                  </label>
                  <div className="flex gap-1 bg-[#141414] rounded-xl p-1 border border-white/5">
                    {[0, 10, 15, 18, 20].map(tipPct => (
                      <button
                        key={tipPct}
                        onClick={() => setCheckoutTipPercent(tipPct)}
                        className={`flex-1 py-1.5 text-xs font-bold rounded-lg ${
                          checkoutTipPercent === tipPct ? 'bg-amber-500 text-black' : 'text-gray-400 hover:text-white'
                        }`}
                      >
                        {tipPct}%
                      </button>
                    ))}
                  </div>
                  <div className="flex justify-between text-xs text-gray-500 font-mono">
                    <span>Monto de propina sugerido:</span>
                    <span className="text-emerald-400">+${tipAmount.toFixed(2)}</span>
                  </div>
                </div>

                {/* Payment Method picker */}
                <div className="space-y-1.5">
                  <label className="block text-[10px] text-gray-400 uppercase font-bold tracking-wider font-mono">
                    Método de Pago:
                  </label>
                  <div className="flex gap-2">
                    {(['Efectivo', 'Tarjeta', 'Transferencia'] as const).map(met => (
                      <button
                        key={met}
                        onClick={() => setCheckoutPaymentMethod(met)}
                        className={`flex-1 py-2 text-xs font-semibold rounded-xl border ${
                          checkoutPaymentMethod === met 
                            ? 'border-amber-500/50 bg-amber-500/5 text-amber-500 font-bold' 
                            : 'border-white/5 bg-[#141414] text-gray-400 hover:text-white'
                        }`}
                      >
                        {met}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Final receipt grand total */}
                <div className="bg-[#181818] rounded-xl border border-white/5 p-4 flex justify-between items-center">
                  <div className="font-sans">
                    <span className="text-[10px] text-gray-500 block uppercase font-mono tracking-widest leading-none">Total Neto a Cobrar</span>
                    <span className="text-md text-gray-400 text-xs font-medium">Incluye propina sugerida</span>
                  </div>
                  <span className="text-lg font-black text-amber-500 font-mono">
                    ${finalTotal.toFixed(2)}
                  </span>
                </div>

                {/* Save button and cancel */}
                <div className="grid grid-cols-2 gap-2 pt-2">
                  <button
                    onClick={() => setCheckoutMesaId(null)}
                    className="py-3 border border-white/10 hover:bg-white/5 rounded-xl text-xs text-gray-400 font-bold transition-all"
                  >
                    Regresar
                  </button>
                  <button
                    onClick={handleSaveCheckout}
                    className="py-3 bg-amber-500 hover:bg-amber-600 text-black font-black text-xs rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-lg uppercase tracking-wide"
                  >
                    <Check size={14} /> Registrar Transacción
                  </button>
                </div>

              </div>

            </div>
          </div>
        );
      })()}

    </div>
  );
}
