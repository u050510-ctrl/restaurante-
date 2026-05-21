import { Personal, Mesa, Platillo, Comanda, Cobro, ReservaCliente } from './types';

export const INITIAL_STAFF: Personal[] = [
  { id: 'S01', nombre: 'Chef Marco Rossi', rol: 'Chef', estado: 'Activo', avatarColor: 'from-amber-600 to-amber-800', eficiencia: 98, completados: 142, usuario: 'marco', contrasena: 'chef123', pin: '1111' },
  { id: 'S02', nombre: 'Chef Elena Rostova', rol: 'Chef', estado: 'Activo', avatarColor: 'from-orange-500 to-amber-700', eficiencia: 94, completados: 89, usuario: 'elena', contrasena: 'chef123', pin: '2222' },
  { id: 'S03', nombre: 'Julian Diaz', rol: 'Mesero', estado: 'Activo', avatarColor: 'from-blue-600 to-indigo-800', eficiencia: 92, completados: 65, usuario: 'julian', contrasena: 'waiter123', pin: '3333' },
  { id: 'S04', nombre: 'Carla Herrera', rol: 'Mesero', estado: 'Activo', avatarColor: 'from-teal-600 to-emerald-800', eficiencia: 96, completados: 110, usuario: 'carla', contrasena: 'waiter123', pin: '4444' },
  { id: 'S05', nombre: 'Martin Avila', rol: 'Host', estado: 'Activo', avatarColor: 'from-violet-600 to-purple-800', eficiencia: 88, completados: 40, usuario: 'martin', contrasena: 'host123', pin: '5555' },
  { id: 'S06', nombre: 'Sofía Mendez', rol: 'Mesero', estado: 'Descanso', avatarColor: 'from-pink-600 to-rose-800', eficiencia: 90, completados: 54, usuario: 'sofia', contrasena: 'waiter123', pin: '6666' }
];

export const INITIAL_TABLES: Mesa[] = [
  { id: 'M01', capacidad: 4, estado: 'Ocupada', meseroId: 'S03', clienteNombre: 'Sr. Altamirano', comandaId: 'C01' },
  { id: 'M02', capacidad: 2, estado: 'Libre' },
  { id: 'M03', capacidad: 6, estado: 'Reservada', clienteNombre: 'Familia Mendoza' },
  { id: 'M04', capacidad: 4, estado: 'Ocupada', meseroId: 'S04', clienteNombre: 'Dra. Sandra Solis', comandaId: 'C02' },
  { id: 'M05', capacidad: 2, estado: 'Libre' },
  { id: 'M06', capacidad: 8, estado: 'Ocupada', meseroId: 'S03', clienteNombre: 'Empresa Alpha', comandaId: 'C03' },
  { id: 'M07', capacidad: 4, estado: 'Libre' },
  { id: 'M08', capacidad: 4, estado: 'Atención', meseroId: 'S04', clienteNombre: 'Marta Gomez', comandaId: 'C04' }
];

export const INITIAL_MENU: Platillo[] = [
  // Entradas
  { id: 'P01', nombre: 'Carpaccio de Res con Trufado', categoria: 'Entradas', precio: 18.5, descripcion: 'Finas láminas de res de libre pastoreo, emulsión de trufa negra, alcaparras baby y queso Grana Padano curado de 24 meses.', tiempoMin: 12, disponible: true, estrellas: 5, ordenesCount: 84 },
  { id: 'P02', nombre: 'Pulpo al Olivo de la Casa', categoria: 'Entradas', precio: 22.0, descripcion: 'Pulpo tierno a la brasa, aceitunas botija maceradas, aceite extra virgen prensado en frío y chips de camote.', tiempoMin: 15, disponible: true, estrellas: 5, ordenesCount: 112 },
  { id: 'P03', nombre: 'Tacos de Langosta Ahumada', categoria: 'Entradas', precio: 26.50, descripcion: 'Tres tacos en tortillas de maíz morado criollo con langosta ahumada en madera de manzano, alioli de chipotle silvestre y caviar de salmón.', tiempoMin: 10, disponible: true, estrellas: 4, ordenesCount: 45 },

  // Fuertes
  { id: 'P04', nombre: 'Risotto de Trufa Negra & Oro', categoria: 'Fuertes', precio: 32.0, descripcion: 'Arroz Acquerello premium, emulsión de trufas de Alba, setas silvestres y laminilla fina de oro comestible de 24K.', tiempoMin: 20, disponible: true, estrellas: 5, ordenesCount: 168 },
  { id: 'P05', nombre: 'Filet Mignon en Reducción de Cabernet', categoria: 'Fuertes', precio: 48.5, descripcion: '250g de solomillo de res Wagyu con costra de cardamomo, puré de papas con mantequilla noisette y reducción orgánica de Cabernet Sauvignon.', tiempoMin: 18, disponible: true, estrellas: 5, ordenesCount: 204 },
  { id: 'P06', nombre: 'Salmón Glaseado al Miso Imperial', categoria: 'Fuertes', precio: 38.0, descripcion: 'Salmón salvaje de Alaska con costra de ajonjolí negro, bok choy salteado al jengibre y reducción de sake-miso imperial.', tiempoMin: 15, disponible: true, estrellas: 4, ordenesCount: 95 },
  { id: 'P07', nombre: 'Ravioli de Langosta y Ricotta', categoria: 'Fuertes', precio: 29.5, descripcion: 'Ravioli hechos a mano rellenos de carne de langosta caribeña fresca y queso ricotta artesanal en suave salsa bisque.', tiempoMin: 14, disponible: true, estrellas: 5, ordenesCount: 118 },

  // Postres
  { id: 'P08', nombre: 'Tiramisú de la Casa con Espresso', categoria: 'Postres', precio: 12.0, descripcion: 'Sponge cake embebido en espresso de origen chiapaneco, crema mascarpone de doble filtración y lluvia de cacao purísimo de Oaxaca.', tiempoMin: 7, disponible: true, estrellas: 5, ordenesCount: 132 },
  { id: 'P09', nombre: 'Esfera de Chocolate con Oro', categoria: 'Postres', precio: 15.5, descripcion: 'Esfera de chocolate belga al 70%, mousse de frambuesa silvestre en su interior y caramelo salado ardiente vertido al servir.', tiempoMin: 8, disponible: true, estrellas: 5, ordenesCount: 76 },

  // Bebidas
  { id: 'P10', nombre: 'Cocktail STARS Premium', categoria: 'Bebidas', precio: 16.0, descripcion: 'Ginebra artesanal infusionada con té de jazmín, tónica premium, esferas de frutos del bosque moleculares y brillo dorado estelar.', tiempoMin: 5, disponible: true, estrellas: 4, ordenesCount: 152 },
  { id: 'P11', nombre: 'Vino Tinto Reserva Botella', categoria: 'Bebidas', precio: 75.0, descripcion: 'Excelente vino tinto de autor premium de la bodega Valle de Guadalupe con notas maderosas perfectas para carnes rojas.', tiempoMin: 3, disponible: true, estrellas: 5, ordenesCount: 41 },
  { id: 'P12', nombre: 'Agua Artesanal Artesiana', categoria: 'Bebidas', precio: 6.5, descripcion: 'Agua purificada naturalmente extraída de acuíferos volcánicos, servida en copa de cristal fría con rodaja de piña e hinojo.', tiempoMin: 2, disponible: true, estrellas: 4, ordenesCount: 215 }
];

export const INITIAL_ORDERS: Comanda[] = [
  {
    id: 'C01',
    mesaId: 'M01',
    meseroId: 'S03',
    chefId: 'S01',
    estado: 'Cocina',
    timestamp: new Date(Date.now() - 14 * 60000).toISOString(),
    items: [
      { id: 'CI01', platilloId: 'P02', cantidad: 1, estado: 'Listo', notas: 'Bien cocido el pulpo' },
      { id: 'CI02', platilloId: 'P07', cantidad: 1, estado: 'Preparando', notas: 'Poco picante' },
      { id: 'CI03', platilloId: 'P11', cantidad: 1, estado: 'Servido' }
    ],
    notas: 'Servir entraderas primero.'
  },
  {
    id: 'C02',
    mesaId: 'M04',
    meseroId: 'S04',
    chefId: 'S02',
    estado: 'Cocina',
    timestamp: new Date(Date.now() - 8 * 60000).toISOString(),
    items: [
      { id: 'CI04', platilloId: 'P02', cantidad: 1, estado: 'Preparando' },
      { id: 'CI05', platilloId: 'P10', cantidad: 2, estado: 'Listo' }
    ]
  },
  {
    id: 'C03',
    mesaId: 'M06',
    meseroId: 'S03',
    chefId: 'S01',
    estado: 'Listo',
    timestamp: new Date(Date.now() - 22 * 60000).toISOString(),
    items: [
      { id: 'CI06', platilloId: 'P04', cantidad: 2, estado: 'Listo' },
      { id: 'CI07', platilloId: 'P08', cantidad: 1, estado: 'Listo' }
    ]
  },
  {
    id: 'C04',
    mesaId: 'M08',
    meseroId: 'S04',
    chefId: 'S01',
    estado: 'Cocina',
    timestamp: new Date(Date.now() - 3 * 60000).toISOString(),
    items: [
      { id: 'CI08', platilloId: 'P05', cantidad: 1, estado: 'Pendiente', notas: 'Término medio tirando a azul' }
    ],
    notas: 'El cliente pidió cambio de mesa pero prefirió quedarse allí.'
  }
];

export const INITIAL_RESERVATIONS: ReservaCliente[] = [
  { id: 'R01', nombre: 'Familia Mendoza', cantidadPersonas: 6, telefono: '+52 55 4321 8765', hora: '20:30 PM', mesaAsignada: 'M03', estado: 'Pendiente' },
  { id: 'R02', nombre: 'Ing. Carlos Slim', cantidadPersonas: 2, telefono: '+52 55 9876 5432', hora: '21:00 PM', mesaAsignada: null, estado: 'Pendiente' },
  { id: 'R03', nombre: 'Margarita Ortiz', cantidadPersonas: 4, telefono: '+52 55 1234 5678', hora: '19:00 PM', mesaAsignada: 'M08', estado: 'Sentado' }
];

export const INITIAL_COBROS: Cobro[] = [
  { id: 'TX01', comandaId: 'CX90', mesaId: 'M02', clienteNombre: 'Dante Alighieri', subtotal: 105.00, propina: 15.75, total: 120.75, metodoId: 'Tarjeta', timestamp: new Date(Date.now() - 120 * 60000).toISOString() },
  { id: 'TX02', comandaId: 'CX91', mesaId: 'M05', clienteNombre: 'Beatriz Portinari', subtotal: 48.00, propina: 5.00, total: 53.00, metodoId: 'Efectivo', timestamp: new Date(Date.now() - 60 * 60000).toISOString() },
  { id: 'TX03', comandaId: 'CX92', mesaId: 'M07', clienteNombre: 'Virgilio Romano', subtotal: 132.50, propina: 20.00, total: 152.50, metodoId: 'Transferencia', timestamp: new Date(Date.now() - 30 * 60000).toISOString() }
];
