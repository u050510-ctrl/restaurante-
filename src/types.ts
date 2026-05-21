export type RolPersonal = 'Admin' | 'Chef' | 'Mesero' | 'Host';
export type EstadoPersonal = 'Activo' | 'Descanso' | 'Inactivo';

export interface Personal {
  id: string;
  nombre: string;
  rol: RolPersonal;
  estado: EstadoPersonal;
  avatarColor: string;
  eficiencia: number; // Porcentaje de rapidez o calificación
  completados: number; // Comandas servidas o platillos cocinados
  usuario?: string;
  contrasena?: string;
  pin?: string;
}

export type EstadoMesa = 'Libre' | 'Ocupada' | 'Reservada' | 'Atención';

export interface Mesa {
  id: string; // Ej: "M01"
  capacidad: number;
  estado: EstadoMesa;
  meseroId?: string;
  comandaId?: string;
  clienteNombre?: string;
  x?: number; // Para una distribución visual de mesas
  y?: number;
}

export type CategoriaPlatillo = 'Entradas' | 'Fuertes' | 'Postres' | 'Bebidas';

export interface Platillo {
  id: string;
  nombre: string;
  categoria: CategoriaPlatillo;
  precio: number;
  descripcion: string;
  tiempoMin: number;
  disponible: boolean;
  estrellas: number; // 1 a 5 estrellas de este platillo
  ordenesCount: number;
}

export type EstadoComandaItem = 'Pendiente' | 'Preparando' | 'Listo' | 'Servido';

export interface ComandaItem {
  id: string;
  platilloId: string;
  cantidad: number;
  estado: EstadoComandaItem;
  notas?: string;
}

export type EstadoComanda = 'Pendiente' | 'Cocina' | 'Listo' | 'Entregado' | 'Cobrado';

export interface Comanda {
  id: string;
  mesaId: string;
  items: ComandaItem[];
  meseroId: string;
  chefId?: string;
  estado: EstadoComanda;
  timestamp: string; // ISO String
  notas?: string;
}

export interface Cobro {
  id: string;
  comandaId: string;
  mesaId: string;
  clienteNombre: string;
  subtotal: number;
  propina: number;
  total: number;
  metodoId: 'Efectivo' | 'Tarjeta' | 'Transferencia';
  timestamp: string;
}

export interface ReservaCliente {
  id: string;
  nombre: string;
  cantidadPersonas: number;
  telefono: string;
  hora: string;
  mesaAsignada: string | null;
  estado: 'Pendiente' | 'Sentado' | 'Cancelada';
}
