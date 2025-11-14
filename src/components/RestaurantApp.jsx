import React, { useState, useEffect } from 'react';
import { Home, UtensilsCrossed, Package, Users, TrendingUp, Calendar, DollarSign, ShoppingCart, Plus, X, Check, AlertCircle, Trash2, Save, Minus, Search, Moon, Sun, Printer, Share2, Award, Clock } from 'lucide-react';

// ============= UTILIDADES =============

const formatearMoneda = (valor) => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0
  }).format(valor);
};

const cargarDesdeStorage = (key, initializer) => {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : initializer();
  } catch {
    return initializer();
  }
};

const guardarEnStorage = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error('Error guardando:', error);
  }
};

// ============= COMPONENTES UI =============

const Button = ({ children, onClick, variant = 'primary', size = 'md', disabled, className = '', type = 'button' }) => {
  const variants = {
    primary: 'bg-orange-600 text-white hover:bg-orange-700',
    secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300',
    success: 'bg-green-600 text-white hover:bg-green-700',
    danger: 'bg-red-600 text-white hover:bg-red-700',
    outline: 'border-2 border-orange-600 text-orange-600 hover:bg-orange-50'
  };
  
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2',
    lg: 'px-6 py-3 text-lg'
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`font-semibold rounded-lg transition-all flex items-center justify-center gap-2 ${variants[variant]} ${sizes[size]} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
    >
      {children}
    </button>
  );
};

const Modal = ({ isOpen, onClose, title, children, size = 'md' }) => {
  if (!isOpen) return null;
  const sizes = { sm: 'max-w-md', md: 'max-w-2xl', lg: 'max-w-4xl' };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div className={`bg-white rounded-2xl shadow-2xl ${sizes[size]} w-full max-h-[90vh] overflow-hidden`}>
        <div className="bg-gradient-to-r from-orange-600 to-amber-600 p-4 flex justify-between items-center">
          <h3 className="text-xl font-bold text-white">{title}</h3>
          <button onClick={onClose} className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2">
            <X size={24} />
          </button>
        </div>
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">{children}</div>
      </div>
    </div>
  );
};

const Alert = ({ type = 'info', children }) => {
  const types = {
    success: 'bg-green-50 border-green-300 text-green-800',
    error: 'bg-red-50 border-red-300 text-red-800',
    warning: 'bg-yellow-50 border-yellow-300 text-yellow-800',
    info: 'bg-blue-50 border-blue-300 text-blue-800'
  };

  return (
    <div className={`border-l-4 p-4 rounded ${types[type]} flex items-start gap-3 mb-4`}>
      <AlertCircle size={20} className="flex-shrink-0" />
      <div>{children}</div>
    </div>
  );
};

const Input = ({ label, type = 'text', value, onChange, required, placeholder, min, step }) => (
  <div className="mb-4">
    <label className="block text-sm font-semibold text-gray-700 mb-2">
      {label} {required && <span className="text-red-600">*</span>}
    </label>
    <input
      type={type}
      value={value}
      onChange={onChange}
      required={required}
      placeholder={placeholder}
      min={min}
      step={step}
      className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-orange-500 focus:outline-none"
    />
  </div>
);

const Select = ({ label, value, onChange, options, required }) => (
  <div className="mb-4">
    <label className="block text-sm font-semibold text-gray-700 mb-2">
      {label} {required && <span className="text-red-600">*</span>}
    </label>
    <select
      value={value}
      onChange={onChange}
      required={required}
      className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-orange-500 focus:outline-none"
    >
      {options.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
    </select>
  </div>
);

const TextArea = ({ label, value, onChange, placeholder, rows = 2 }) => (
  <div className="mb-2">
    {label && <label className="block text-xs font-semibold text-gray-600 mb-1">{label}</label>}
    <textarea
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      rows={rows}
      className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:border-orange-500 focus:outline-none resize-none"
    />
  </div>
);

// ============= DATOS INICIALES =============

const inicializarMesas = () => Array.from({ length: 12 }, (_, i) => ({
  id: `mesa-${i + 1}`,
  numero: i + 1,
  capacidad: i % 3 === 0 ? 6 : i % 2 === 0 ? 2 : 4,
  estado: 'libre',
  pedidos: [],
  total: 0
}));

const inicializarInventario = () => [
  { id: 'inv-1', nombre: 'Pollo', categoria: 'proteina', cantidad: 50, unidad: 'kg', precio_unitario: 8000, stock_minimo: 10 },
  { id: 'inv-2', nombre: 'Carne de Res', categoria: 'proteina', cantidad: 30, unidad: 'kg', precio_unitario: 15000, stock_minimo: 10 },
  { id: 'inv-3', nombre: 'Pescado', categoria: 'proteina', cantidad: 20, unidad: 'kg', precio_unitario: 12000, stock_minimo: 5 },
  { id: 'inv-4', nombre: 'Arroz', categoria: 'acompañamiento', cantidad: 100, unidad: 'kg', precio_unitario: 2500, stock_minimo: 20 },
  { id: 'inv-5', nombre: 'Papa', categoria: 'acompañamiento', cantidad: 80, unidad: 'kg', precio_unitario: 1500, stock_minimo: 15 },
  { id: 'inv-6', nombre: 'Gaseosa', categoria: 'bebida', cantidad: 100, unidad: 'unidades', precio_unitario: 1500, stock_minimo: 20 }
];

const inicializarPlatos = () => {
  const dias = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
  return dias.flatMap((dia, idx) => [
    { id: `plato-${idx}-1`, nombre: 'Bandeja Paisa', precio: 25000, disponible: true, dia_semana: idx, dia },
    { id: `plato-${idx}-2`, nombre: 'Pollo Asado', precio: 18000, disponible: true, dia_semana: idx, dia },
    { id: `plato-${idx}-3`, nombre: 'Pescado Frito', precio: 22000, disponible: true, dia_semana: idx, dia }
  ]);
};

const inicializarPersonal = () => [
  { id: 'emp-1', nombre: 'Juan Pérez', cargo: 'Mesero', salario: 1300000, telefono: '3001234567', activo: true },
  { id: 'emp-2', nombre: 'María López', cargo: 'Cocinera', salario: 1500000, telefono: '3009876543', activo: true },
  { id: 'emp-3', nombre: 'Carlos Ruiz', cargo: 'Cajero', salario: 1300000, telefono: '3012345678', activo: true }
];

// ============= COMPONENTE PRINCIPAL =============

const RestaurantApp = () => {
  const [activeTab, setActiveTab] = useState('mesas');
  const [mesas, setMesas] = useState(() => cargarDesdeStorage('mesas', inicializarMesas));
  const [inventario, setInventario] = useState(() => cargarDesdeStorage('inventario', inicializarInventario));
  const [platos, setPlatos] = useState(() => cargarDesdeStorage('platos', inicializarPlatos));
  const [personal, setPersonal] = useState(() => cargarDesdeStorage('personal', inicializarPersonal));
  const [ventas, setVentas] = useState(() => cargarDesdeStorage('ventas', () => []));
  const [darkMode, setDarkMode] = useState(false);
  const [busqueda, setBusqueda] = useState('');
  
  const [modalPedido, setModalPedido] = useState({ isOpen: false, mesa: null, carrito: [] });
  const [modalCerrarMesa, setModalCerrarMesa] = useState({ isOpen: false, mesa: null, propina: 10, metodoPago: 'efectivo', dividirEntre: 1 });
  const [modalPersonal, setModalPersonal] = useState({ isOpen: false });
  const [modalPlato, setModalPlato] = useState({ isOpen: false });
  const [modalInventario, setModalInventario] = useState({ isOpen: false });
  const [modalMesa, setModalMesa] = useState({ isOpen: false });

  const [formPersonal, setFormPersonal] = useState({ nombre: '', cargo: 'Mesero', salario: '', telefono: '' });
  const [formPlato, setFormPlato] = useState({ nombre: '', precio: '', dia_semana: 1 });
  const [formInventario, setFormInventario] = useState({ nombre: '', categoria: 'proteina', cantidad: '', unidad: 'kg', precio_unitario: '', stock_minimo: '' });
  const [formMesa, setFormMesa] = useState({ numero: '', capacidad: 4 });

  const dias = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
  const diaActual = new Date().getDay();

  useEffect(() => { guardarEnStorage('mesas', mesas); }, [mesas]);
  useEffect(() => { guardarEnStorage('inventario', inventario); }, [inventario]);
  useEffect(() => { guardarEnStorage('platos', platos); }, [platos]);
  useEffect(() => { guardarEnStorage('personal', personal); }, [personal]);
  useEffect(() => { guardarEnStorage('ventas', ventas); }, [ventas]);

  // CARRITO
  const agregarAlCarrito = (plato) => {
    setModalPedido(prev => ({
      ...prev,
      carrito: [...prev.carrito, { ...plato, cantidad: 1, notas: '', id_carrito: Date.now() }]
    }));
  };

  const actualizarCantidad = (id_carrito, cambio) => {
    setModalPedido(prev => ({
      ...prev,
      carrito: prev.carrito.map(item => 
        item.id_carrito === id_carrito 
          ? { ...item, cantidad: Math.max(1, item.cantidad + cambio) }
          : item
      )
    }));
  };

  const removerDelCarrito = (id_carrito) => {
    setModalPedido(prev => ({
      ...prev,
      carrito: prev.carrito.filter(item => item.id_carrito !== id_carrito)
    }));
  };

  const actualizarNotas = (id_carrito, notas) => {
    setModalPedido(prev => ({
      ...prev,
      carrito: prev.carrito.map(item =>
        item.id_carrito === id_carrito ? { ...item, notas } : item
      )
    }));
  };

  const calcularTotal = () => modalPedido.carrito.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);

  const confirmarPedido = () => {
    if (modalPedido.carrito.length === 0) return alert('Carrito vacío');
    
    setMesas(mesas.map(mesa => {
      if (mesa.id === modalPedido.mesa.id) {
        const nuevosPedidos = [...mesa.pedidos, ...modalPedido.carrito];
        return {
          ...mesa,
          estado: 'ocupada',
          pedidos: nuevosPedidos,
          total: nuevosPedidos.reduce((sum, p) => sum + (p.precio * p.cantidad), 0)
        };
      }
      return mesa;
    }));
    
    setModalPedido({ isOpen: false, mesa: null, carrito: [] });
  };

  // CERRAR MESA
  const abrirModalCerrarMesa = (mesa) => {
    setModalCerrarMesa({ isOpen: true, mesa, propina: 10, metodoPago: 'efectivo', dividirEntre: 1 });
  };

  const cerrarMesa = () => {
    const { mesa, propina, metodoPago, dividirEntre } = modalCerrarMesa;
    const subtotal = mesa.total;
    const montoPropina = subtotal * (propina / 100);
    const total = subtotal + montoPropina;

    const nuevaVenta = {
      id: `venta-${Date.now()}`,
      numeroMesa: mesa.numero,
      subtotal,
      propina,
      montoPropina,
      total,
      metodoPago,
      dividirEntre,
      pedidos: mesa.pedidos,
      fecha: new Date().toISOString()
    };

    setVentas([...ventas, nuevaVenta]);
    setMesas(mesas.map(m => m.id === mesa.id ? { ...m, estado: 'libre', pedidos: [], total: 0 } : m));
    setModalCerrarMesa({ isOpen: false, mesa: null, propina: 10, metodoPago: 'efectivo', dividirEntre: 1 });
  };

  const imprimirRecibo = () => {
    const { mesa, propina } = modalCerrarMesa;
    let recibo = `
═══════════════════════════════
    MI RESTAURANTE
═══════════════════════════════
Mesa ${mesa.numero} - ${new Date().toLocaleString('es-CO')}

PEDIDO:
`;
    mesa.pedidos.forEach((p, i) => {
      recibo += `\n${i+1}. ${p.nombre} x${p.cantidad} - ${formatearMoneda(p.precio * p.cantidad)}`;
      if (p.notas) recibo += `\n   Nota: ${p.notas}`;
    });
    
    const montoPropina = mesa.total * (propina / 100);
    recibo += `\n
───────────────────────────────
Subtotal: ${formatearMoneda(mesa.total)}
Propina ${propina}%: ${formatearMoneda(montoPropina)}
───────────────────────────────
TOTAL: ${formatearMoneda(mesa.total + montoPropina)}
═══════════════════════════════
    ¡GRACIAS!
═══════════════════════════════`;

    const ventana = window.open('', '_blank');
    ventana.document.write(`<pre style="font-family: monospace;">${recibo}</pre>`);
    ventana.print();
  };

  const compartirWhatsApp = () => {
    const { mesa, propina } = modalCerrarMesa;
    const montoPropina = mesa.total * (propina / 100);
    const texto = `*MI RESTAURANTE*\nMesa ${mesa.numero}\n\nTotal: ${formatearMoneda(mesa.total + montoPropina)}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(texto)}`);
  };

  // CRUD MESAS
  const agregarMesa = (e) => {
    e.preventDefault();
    setMesas([...mesas, {
      id: `mesa-${Date.now()}`,
      numero: parseInt(formMesa.numero),
      capacidad: parseInt(formMesa.capacidad),
      estado: 'libre',
      pedidos: [],
      total: 0
    }]);
    setModalMesa({ isOpen: false });
    setFormMesa({ numero: '', capacidad: 4 });
  };

  const eliminarMesa = (id) => {
    if (window.confirm('¿Eliminar mesa?')) setMesas(mesas.filter(m => m.id !== id));
  };

  // CRUD INVENTARIO
  const agregarInventario = (e) => {
    e.preventDefault();
    setInventario([...inventario, {
      id: `inv-${Date.now()}`,
      ...formInventario,
      cantidad: parseFloat(formInventario.cantidad),
      precio_unitario: parseFloat(formInventario.precio_unitario),
      stock_minimo: parseFloat(formInventario.stock_minimo)
    }]);
    setModalInventario({ isOpen: false });
    setFormInventario({ nombre: '', categoria: 'proteina', cantidad: '', unidad: 'kg', precio_unitario: '', stock_minimo: '' });
  };

  const actualizarInventario = (id, nuevaCantidad) => {
    setInventario(inventario.map(item => item.id === id ? { ...item, cantidad: parseFloat(nuevaCantidad) || 0 } : item));
  };

  const eliminarInventario = (id) => {
    if (window.confirm('¿Eliminar item?')) setInventario(inventario.filter(i => i.id !== id));
  };

  // CRUD PLATOS
  const agregarPlato = (e) => {
    e.preventDefault();
    setPlatos([...platos, {
      id: `plato-${Date.now()}`,
      ...formPlato,
      precio: parseFloat(formPlato.precio),
      dia_semana: parseInt(formPlato.dia_semana),
      dia: dias[parseInt(formPlato.dia_semana)],
      disponible: true
    }]);
    setModalPlato({ isOpen: false });
    setFormPlato({ nombre: '', precio: '', dia_semana: 1 });
  };

  const eliminarPlato = (id) => {
    if (window.confirm('¿Eliminar plato?')) setPlatos(platos.filter(p => p.id !== id));
  };

  const toggleDisponibilidad = (id) => {
    setPlatos(platos.map(p => p.id === id ? { ...p, disponible: !p.disponible } : p));
  };

  // CRUD PERSONAL
  const agregarPersonal = (e) => {
    e.preventDefault();
    setPersonal([...personal, {
      id: `emp-${Date.now()}`,
      ...formPersonal,
      salario: parseFloat(formPersonal.salario),
      activo: true
    }]);
    setModalPersonal({ isOpen: false });
    setFormPersonal({ nombre: '', cargo: 'Mesero', salario: '', telefono: '' });
  };

  const eliminarPersonal = (id) => {
    if (window.confirm('¿Eliminar empleado?')) setPersonal(personal.filter(p => p.id !== id));
  };

  const toggleActivo = (id) => {
    setPersonal(personal.map(p => p.id === id ? { ...p, activo: !p.activo } : p));
  };

  // ESTADÍSTICAS
  const stats = {
    ventasMes: ventas.reduce((sum, v) => sum + v.total, 0),
    totalPropinas: ventas.reduce((sum, v) => sum + v.montoPropina, 0),
    gastosMes: personal.filter(p => p.activo).reduce((sum, p) => sum + p.salario, 0),
    inventarioValor: inventario.reduce((sum, i) => sum + (i.cantidad * i.precio_unitario), 0),
    pedidosTotal: ventas.length,
    mesasOcupadas: mesas.filter(m => m.estado === 'ocupada').length
  };

  const platosHoy = platos.filter(p => p.dia_semana === diaActual && p.disponible);
  const platosFiltrados = platosHoy.filter(p => p.nombre.toLowerCase().includes(busqueda.toLowerCase()));

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-orange-50 to-amber-50'}`}>
      <div className="container mx-auto p-4 max-w-7xl">
        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-2xl overflow-hidden`}>
          
          {/* HEADER */}
          <div className="bg-gradient-to-r from-orange-600 to-amber-600 p-6 flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                <UtensilsCrossed size={36} />
                Mi Restaurante PRO
              </h1>
              <p className="text-orange-100 mt-1">Sistema Completo de Gestión</p>
            </div>
            <button onClick={() => setDarkMode(!darkMode)} className="bg-white bg-opacity-20 p-3 rounded-full hover:bg-opacity-30">
              {darkMode ? <Sun size={24} className="text-white" /> : <Moon size={24} className="text-white" />}
            </button>
          </div>

          {/* TABS */}
          <div className={`flex flex-wrap gap-2 p-4 ${darkMode ? 'bg-gray-700' : 'bg-gray-50'} border-b`}>
            {[
              { id: 'mesas', label: 'Mesas', icon: Home },
              { id: 'menu', label: 'Menú', icon: Calendar },
              { id: 'inventario', label: 'Inventario', icon: Package },
              { id: 'personal', label: 'Personal', icon: Users },
              { id: 'reportes', label: 'Reportes', icon: TrendingUp }
            ].map(tab => (
              <Button key={tab.id} onClick={() => setActiveTab(tab.id)} variant={activeTab === tab.id ? 'primary' : 'secondary'} size="md">
                <tab.icon size={20} />
                {tab.label}
              </Button>
            ))}
          </div>

          {/* CONTENT */}
          <div className="p-6">
            
            {/* TAB MESAS */}
            {activeTab === 'mesas' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>Mesas</h2>
                  <div className="flex gap-4 items-center">
                    <span className="text-sm">Libre: {mesas.filter(m => m.estado === 'libre').length} | Ocupada: {mesas.filter(m => m.estado === 'ocupada').length}</span>
                    <Button onClick={() => { setFormMesa({ numero: Math.max(...mesas.map(m => m.numero)) + 1, capacidad: 4 }); setModalMesa({ isOpen: true }); }} size="sm">
                      <Plus size={16} /> Agregar
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {mesas.sort((a, b) => a.numero - b.numero).map(mesa => (
                    <div key={mesa.id} className={`p-6 rounded-xl shadow-lg ${mesa.estado === 'libre' ? 'bg-green-50 border-2 border-green-300' : 'bg-red-50 border-2 border-red-300'}`}>
                      <div className="text-center">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="text-xl font-bold">Mesa {mesa.numero}</h3>
                          {mesa.estado === 'libre' && (
                            <button onClick={() => eliminarMesa(mesa.id)} className="text-red-600">
                              <Trash2 size={16} />
                            </button>
                          )}
                        </div>
                        <p className="text-sm text-gray-600">Cap: {mesa.capacidad}</p>
                        <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold mt-2 ${mesa.estado === 'libre' ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'}`}>
                          {mesa.estado.toUpperCase()}
                        </span>

                        {mesa.estado === 'ocupada' && (
                          <div className="mt-4 space-y-2">
                            <div className="bg-white p-2 rounded max-h-24 overflow-y-auto text-left">
                              {mesa.pedidos.map((p, i) => (
                                <div key={i} className="text-xs flex justify-between border-b py-1">
                                  <span>{p.cantidad}x {p.nombre}</span>
                                  <span className="font-bold">{formatearMoneda(p.precio * p.cantidad)}</span>
                                </div>
                              ))}
                            </div>
                            <div className="text-lg font-bold text-orange-600">{formatearMoneda(mesa.total)}</div>
                            <Button onClick={() => abrirModalCerrarMesa(mesa)} variant="success" size="sm" className="w-full">
                              <Check size={16} /> Cobrar
                            </Button>
                          </div>
                        )}

                        {mesa.estado === 'libre' && (
                          <Button onClick={() => setModalPedido({ isOpen: true, mesa, carrito: [] })} variant="primary" size="sm" className="w-full mt-4">
                            <Plus size={16} /> Tomar Pedido
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB MENÚ */}
            {activeTab === 'menu' && (
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>Menú Semanal</h2>
                  <Button onClick={() => { setFormPlato({ nombre: '', precio: '', dia_semana: diaActual }); setModalPlato({ isOpen: true }); }} size="sm">
                    <Plus size={16} /> Agregar Plato
                  </Button>
                </div>

                <Alert type="info">Hoy es {dias[diaActual]} - {platosHoy.length} platos disponibles</Alert>

                {dias.map((dia, idx) => {
                  const platosDia = platos.filter(p => p.dia_semana === idx);
                  const esHoy = idx === diaActual;
                  return (
                    <div key={idx} className={`p-6 rounded-xl shadow-lg mb-4 ${esHoy ? 'bg-gradient-to-r from-orange-100 to-amber-100 border-2 border-orange-400' : darkMode ? 'bg-gray-700' : 'bg-white'}`}>
                      <h3 className={`text-xl font-bold mb-4 ${darkMode && !esHoy ? 'text-white' : 'text-gray-800'}`}>
                        {dia} {esHoy && <span className="text-sm bg-orange-600 text-white px-2 py-1 rounded ml-2">HOY</span>}
                      </h3>
                      <div className="grid md:grid-cols-2 gap-3">
                        {platosDia.map(plato => (
                          <div key={plato.id} className="bg-white p-4 rounded-lg shadow flex justify-between items-start">
                            <div>
                              <p className="font-semibold">{plato.nombre}</p>
                              <p className="text-orange-600 font-bold">{formatearMoneda(plato.precio)}</p>
                            </div>
                            <div className="flex gap-2">
                              <button onClick={() => toggleDisponibilidad(plato.id)} className={`px-2 py-1 text-xs rounded ${plato.disponible ? 'bg-green-100 text-green-800' : 'bg-gray-100'}`}>
                                {plato.disponible ? '✓' : '✗'}
                              </button>
                              <button onClick={() => eliminarPlato(plato.id)} className="text-red-600">
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* TAB INVENTARIO */}
            {activeTab === 'inventario' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>Inventario</h2>
                  <div className="flex gap-4 items-center">
                    <span className="bg-yellow-100 px-4 py-2 rounded font-semibold">Total: {formatearMoneda(stats.inventarioValor)}</span>
                    <Button onClick={() => setModalInventario({ isOpen: true })} size="sm">
                      <Plus size={16} /> Agregar
                    </Button>
                  </div>
                </div>

                {['proteina', 'acompañamiento', 'bebida'].map(categoria => (
                  <div key={categoria} className={`${darkMode ? 'bg-gray-700' : 'bg-white'} rounded-xl shadow-lg p-6 mb-4`}>
                    <h3 className={`text-xl font-bold mb-4 capitalize ${darkMode ? 'text-white' : 'text-gray-800'}`}>{categoria}s</h3>
                    <div className="space-y-3">
                      {inventario.filter(item => item.categoria === categoria).map(item => {
                        const bajStock = item.cantidad <= item.stock_minimo;
                        return (
                          <div key={item.id} className={`p-4 rounded-lg border-2 ${bajStock ? 'bg-red-50 border-red-300' : 'bg-gray-50 border-gray-200'}`}>
                            <div className="flex justify-between items-center">
                              <div className="flex-1">
                                <div className="flex items-center gap-2">
                                  <h4 className="font-bold">{item.nombre}</h4>
                                  <button onClick={() => eliminarInventario(item.id)} className="text-red-600">
                                    <Trash2 size={16} />
                                  </button>
                                </div>
                                <p className="text-sm text-gray-600">{formatearMoneda(item.precio_unitario)}/{item.unidad}</p>
                                {bajStock && <span className="text-red-600 text-sm font-semibold">⚠️ Stock bajo</span>}
                              </div>
                              <div className="flex items-center gap-3">
                                <input
                                  type="number"
                                  value={item.cantidad}
                                  onChange={(e) => actualizarInventario(item.id, e.target.value)}
                                  className="w-24 px-3 py-2 border-2 rounded-lg"
                                  min="0"
                                  step="0.1"
                                />
                                <span className="font-semibold">{item.unidad}</span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* TAB PERSONAL */}
            {activeTab === 'personal' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>Personal</h2>
                  <div className="flex gap-4 items-center">
                    <span className="bg-blue-100 px-4 py-2 rounded font-semibold">Nómina: {formatearMoneda(stats.gastosMes)}</span>
                    <Button onClick={() => setModalPersonal({ isOpen: true })} size="sm">
                      <Plus size={16} /> Agregar
                    </Button>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  {personal.map(emp => (
                    <div key={emp.id} className={`${darkMode ? 'bg-gray-700' : 'bg-white'} rounded-xl shadow-lg p-6 ${!emp.activo ? 'opacity-60' : ''}`}>
                      <div className="flex items-start gap-4">
                        <div className="bg-orange-100 p-3 rounded-full">
                          <Users size={24} className="text-orange-600" />
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between">
                            <div>
                              <h3 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>{emp.nombre}</h3>
                              <p className={darkMode ? 'text-gray-300' : 'text-gray-600'}>{emp.cargo}</p>
                            </div>
                            <div className="flex gap-2">
                              <button onClick={() => toggleActivo(emp.id)} className={`px-2 py-1 text-xs rounded ${emp.activo ? 'bg-green-100 text-green-800' : 'bg-gray-100'}`}>
                                {emp.activo ? 'Activo' : 'Inactivo'}
                              </button>
                              <button onClick={() => eliminarPersonal(emp.id)} className="text-red-600">
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </div>
                          <div className="mt-3 space-y-1">
                            <div className="flex justify-between text-sm">
                              <span>Salario:</span>
                              <span className="font-bold text-orange-600">{formatearMoneda(emp.salario)}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span>Teléfono:</span>
                              <span className="font-semibold">{emp.telefono}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB REPORTES */}
            {activeTab === 'reportes' && (
              <div>
                <h2 className={`text-2xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-800'}`}>Reportes</h2>

                <div className="grid md:grid-cols-3 gap-4 mb-6">
                  <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg p-6 text-white">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="text-lg font-semibold">Ventas</h3>
                      <DollarSign size={28} />
                    </div>
                    <p className="text-3xl font-bold">{formatearMoneda(stats.ventasMes)}</p>
                    <p className="text-sm text-green-100">{stats.pedidosTotal} pedidos</p>
                  </div>

                  <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg p-6 text-white">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="text-lg font-semibold">Propinas</h3>
                      <Award size={28} />
                    </div>
                    <p className="text-3xl font-bold">{formatearMoneda(stats.totalPropinas)}</p>
                    <p className="text-sm text-purple-100">Recaudadas</p>
                  </div>

                  <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl shadow-lg p-6 text-white">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="text-lg font-semibold">Ganancia</h3>
                      <TrendingUp size={28} />
                    </div>
                    <p className="text-3xl font-bold">{formatearMoneda(stats.ventasMes - stats.gastosMes)}</p>
                    <p className="text-sm text-orange-100">Neta</p>
                  </div>
                </div>

                <div className={`${darkMode ? 'bg-gray-700' : 'bg-white'} rounded-xl shadow-lg p-6`}>
                  <h3 className={`text-xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>Últimas Ventas</h3>
                  <div className="space-y-3">
                    {ventas.slice(-10).reverse().map(venta => (
                      <div key={venta.id} className={`flex justify-between items-center p-4 ${darkMode ? 'bg-gray-600' : 'bg-gray-50'} rounded-lg`}>
                        <div>
                          <p className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>Mesa {venta.numeroMesa}</p>
                          <p className="text-sm text-gray-500">{new Date(venta.fecha).toLocaleString('es-CO')}</p>
                          <p className="text-xs text-gray-500">Propina: {formatearMoneda(venta.montoPropina)} • {venta.metodoPago}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xl font-bold text-orange-600">{formatearMoneda(venta.total)}</p>
                          <p className="text-sm text-gray-500">{venta.pedidos.reduce((sum, p) => sum + p.cantidad, 0)} items</p>
                        </div>
                      </div>
                    ))}
                    {ventas.length === 0 && <p className="text-center text-gray-500 py-8">No hay ventas</p>}
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>

        {/* MODAL TOMAR PEDIDO */}
        <Modal isOpen={modalPedido.isOpen} onClose={() => setModalPedido({ isOpen: false, mesa: null, carrito: [] })} title={`Mesa ${modalPedido.mesa?.numero} (${modalPedido.mesa?.capacidad} personas)`} size="lg">
          <div className="mb-4">
            <Input label="Buscar plato" value={busqueda} onChange={(e) => setBusqueda(e.target.value)} placeholder="Buscar..." />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-bold mb-3">Menú de Hoy ({dias[diaActual]})</h4>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {platosFiltrados.map(plato => (
                  <button key={plato.id} onClick={() => agregarAlCarrito(plato)} className="w-full flex justify-between items-center p-3 bg-white border-2 rounded-lg hover:border-orange-500">
                    <div className="text-left">
                      <p className="font-semibold">{plato.nombre}</p>
                      <p className="text-sm text-gray-600">{formatearMoneda(plato.precio)}</p>
                    </div>
                    <Plus size={20} className="text-orange-600" />
                  </button>
                ))}
                {platosFiltrados.length === 0 && <p className="text-center text-gray-500 py-8">No hay platos</p>}
              </div>
            </div>

            <div>
              <h4 className="font-bold mb-3">Carrito</h4>
              <div className="bg-gray-50 rounded-lg p-4 min-h-[300px]">
                {modalPedido.carrito.length === 0 ? (
                  <p className="text-center text-gray-500 py-8">Carrito vacío</p>
                ) : (
                  <div className="space-y-3">
                    {modalPedido.carrito.map(item => (
                      <div key={item.id_carrito} className="bg-white p-3 rounded-lg border">
                        <div className="flex justify-between items-center mb-2">
                          <div className="flex-1">
                            <p className="font-semibold">{item.nombre}</p>
                            <p className="text-sm text-gray-600">{formatearMoneda(item.precio)} c/u</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <button onClick={() => actualizarCantidad(item.id_carrito, -1)} className="bg-red-100 text-red-600 p-1 rounded">
                              <Minus size={16} />
                            </button>
                            <span className="font-bold w-8 text-center">{item.cantidad}</span>
                            <button onClick={() => actualizarCantidad(item.id_carrito, 1)} className="bg-green-100 text-green-600 p-1 rounded">
                              <Plus size={16} />
                            </button>
                            <button onClick={() => removerDelCarrito(item.id_carrito)} className="text-red-600 ml-2">
                              <X size={16} />
                            </button>
                          </div>
                          <p className="font-bold text-orange-600 ml-4">{formatearMoneda(item.precio * item.cantidad)}</p>
                        </div>
                        <TextArea value={item.notas} onChange={(e) => actualizarNotas(item.id_carrito, e.target.value)} placeholder="Notas (sin cebolla, bien cocido...)" />
                      </div>
                    ))}
                  </div>
                )}

                {modalPedido.carrito.length > 0 && (
                  <div className="mt-4 pt-4 border-t-2">
                    <div className="flex justify-between items-center mb-4">
                      <span className="font-bold text-lg">Total:</span>
                      <span className="font-bold text-2xl text-orange-600">{formatearMoneda(calcularTotal())}</span>
                    </div>
                    <Button onClick={confirmarPedido} variant="success" className="w-full" size="lg">
                      <Check size={20} /> Confirmar ({modalPedido.carrito.reduce((sum, item) => sum + item.cantidad, 0)} items)
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </Modal>

        {/* MODAL CERRAR MESA */}
        <Modal isOpen={modalCerrarMesa.isOpen} onClose={() => setModalCerrarMesa({ isOpen: false, mesa: null, propina: 10, metodoPago: 'efectivo', dividirEntre: 1 })} title={`Cerrar Mesa ${modalCerrarMesa.mesa?.numero}`}>
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded">
              <h4 className="font-bold mb-2">Pedidos</h4>
              {modalCerrarMesa.mesa?.pedidos.map((p, i) => (
                <div key={i} className="flex justify-between text-sm">
                  <span>{p.cantidad}x {p.nombre}</span>
                  <span className="font-semibold">{formatearMoneda(p.precio * p.cantidad)}</span>
                </div>
              ))}
            </div>

            <div className="flex justify-between text-lg">
              <span>Subtotal:</span>
              <span className="font-bold">{formatearMoneda(modalCerrarMesa.mesa?.total || 0)}</span>
            </div>

            <Select label="Propina" value={modalCerrarMesa.propina} onChange={(e) => setModalCerrarMesa({ ...modalCerrarMesa, propina: parseInt(e.target.value) })} options={[
              { value: 0, label: '0%' },
              { value: 10, label: '10% - ' + formatearMoneda((modalCerrarMesa.mesa?.total || 0) * 0.10) },
              { value: 15, label: '15% - ' + formatearMoneda((modalCerrarMesa.mesa?.total || 0) * 0.15) },
              { value: 20, label: '20% - ' + formatearMoneda((modalCerrarMesa.mesa?.total || 0) * 0.20) }
            ]} />

            <Select label="Método de Pago" value={modalCerrarMesa.metodoPago} onChange={(e) => setModalCerrarMesa({ ...modalCerrarMesa, metodoPago: e.target.value })} options={[
              { value: 'efectivo', label: 'Efectivo' },
              { value: 'tarjeta', label: 'Tarjeta' },
              { value: 'transferencia', label: 'Transferencia' },
              { value: 'qr', label: 'QR' }
            ]} />

            <Input label="Dividir entre" type="number" value={modalCerrarMesa.dividirEntre} onChange={(e) => setModalCerrarMesa({ ...modalCerrarMesa, dividirEntre: parseInt(e.target.value) || 1 })} min="1" />

            {modalCerrarMesa.dividirEntre > 1 && (
              <div className="bg-blue-50 p-3 rounded">
                <p className="text-sm text-blue-800">Cada persona: <strong>{formatearMoneda(((modalCerrarMesa.mesa?.total || 0) * (1 + modalCerrarMesa.propina / 100)) / modalCerrarMesa.dividirEntre)}</strong></p>
              </div>
            )}

            <div className="flex justify-between text-xl font-bold text-orange-600 p-4 bg-orange-50 rounded">
              <span>TOTAL:</span>
              <span>{formatearMoneda((modalCerrarMesa.mesa?.total || 0) * (1 + modalCerrarMesa.propina / 100))}</span>
            </div>

            <div className="flex gap-3">
              <Button onClick={cerrarMesa} variant="success" className="flex-1">
                <Check size={20} /> Cobrar
              </Button>
              <Button onClick={imprimirRecibo} variant="secondary">
                <Printer size={20} />
              </Button>
              <Button onClick={compartirWhatsApp} variant="outline">
                <Share2 size={20} />
              </Button>
            </div>
          </div>
        </Modal>

        {/* MODAL AGREGAR PERSONAL */}
        <Modal isOpen={modalPersonal.isOpen} onClose={() => setModalPersonal({ isOpen: false })} title="Agregar Empleado">
          <form onSubmit={agregarPersonal}>
            <Input label="Nombre" value={formPersonal.nombre} onChange={(e) => setFormPersonal({ ...formPersonal, nombre: e.target.value })} required placeholder="Juan Pérez" />
            <Select label="Cargo" value={formPersonal.cargo} onChange={(e) => setFormPersonal({ ...formPersonal, cargo: e.target.value })} options={[
              { value: 'Mesero', label: 'Mesero' },
              { value: 'Cocinero', label: 'Cocinero' },
              { value: 'Cajero', label: 'Cajero' }
            ]} />
            <Input label="Salario" type="number" value={formPersonal.salario} onChange={(e) => setFormPersonal({ ...formPersonal, salario: e.target.value })} required min="0" placeholder="1300000" />
            <Input label="Teléfono" value={formPersonal.telefono} onChange={(e) => setFormPersonal({ ...formPersonal, telefono: e.target.value })} required placeholder="3001234567" />
            <div className="flex gap-3">
              <Button type="submit" variant="success" className="flex-1"><Save size={16} /> Guardar</Button>
              <Button type="button" variant="secondary" onClick={() => setModalPersonal({ isOpen: false })}>Cancelar</Button>
            </div>
          </form>
        </Modal>

        {/* MODAL AGREGAR PLATO */}
        <Modal isOpen={modalPlato.isOpen} onClose={() => setModalPlato({ isOpen: false })} title="Agregar Plato">
          <form onSubmit={agregarPlato}>
            <Input label="Nombre" value={formPlato.nombre} onChange={(e) => setFormPlato({ ...formPlato, nombre: e.target.value })} required placeholder="Bandeja Paisa" />
            <Input label="Precio" type="number" value={formPlato.precio} onChange={(e) => setFormPlato({ ...formPlato, precio: e.target.value })} required min="0" placeholder="25000" />
            <Select label="Día" value={formPlato.dia_semana} onChange={(e) => setFormPlato({ ...formPlato, dia_semana: e.target.value })} options={dias.map((dia, idx) => ({ value: idx, label: dia }))} />
            <div className="flex gap-3">
              <Button type="submit" variant="success" className="flex-1"><Save size={16} /> Guardar</Button>
              <Button type="button" variant="secondary" onClick={() => setModalPlato({ isOpen: false })}>Cancelar</Button>
            </div>
          </form>
        </Modal>

        {/* MODAL AGREGAR INVENTARIO */}
        <Modal isOpen={modalInventario.isOpen} onClose={() => setModalInventario({ isOpen: false })} title="Agregar Inventario">
          <form onSubmit={agregarInventario}>
            <Input label="Nombre" value={formInventario.nombre} onChange={(e) => setFormInventario({ ...formInventario, nombre: e.target.value })} required placeholder="Pollo" />
            <Select label="Categoría" value={formInventario.categoria} onChange={(e) => setFormInventario({ ...formInventario, categoria: e.target.value })} options={[
              { value: 'proteina', label: 'Proteína' },
              { value: 'acompañamiento', label: 'Acompañamiento' },
              { value: 'bebida', label: 'Bebida' }
            ]} />
            <div className="grid grid-cols-2 gap-4">
              <Input label="Cantidad" type="number" value={formInventario.cantidad} onChange={(e) => setFormInventario({ ...formInventario, cantidad: e.target.value })} required min="0" step="0.1" />
              <Select label="Unidad" value={formInventario.unidad} onChange={(e) => setFormInventario({ ...formInventario, unidad: e.target.value })} options={[
                { value: 'kg', label: 'kg' },
                { value: 'unidades', label: 'unidades' }
              ]} />
            </div>
            <Input label="Precio Unitario" type="number" value={formInventario.precio_unitario} onChange={(e) => setFormInventario({ ...formInventario, precio_unitario: e.target.value })} required min="0" />
            <Input label="Stock Mínimo" type="number" value={formInventario.stock_minimo} onChange={(e) => setFormInventario({ ...formInventario, stock_minimo: e.target.value })} required min="0" step="0.1" />
            <div className="flex gap-3">
              <Button type="submit" variant="success" className="flex-1"><Save size={16} /> Guardar</Button>
              <Button type="button" variant="secondary" onClick={() => setModalInventario({ isOpen: false })}>Cancelar</Button>
            </div>
          </form>
        </Modal>

        {/* MODAL AGREGAR MESA */}
        <Modal isOpen={modalMesa.isOpen} onClose={() => setModalMesa({ isOpen: false })} title="Agregar Mesa">
          <form onSubmit={agregarMesa}>
            <Input label="Número" type="number" value={formMesa.numero} onChange={(e) => setFormMesa({ ...formMesa, numero: e.target.value })} required min="1" />
            <Input label="Capacidad" type="number" value={formMesa.capacidad} onChange={(e) => setFormMesa({ ...formMesa, capacidad: e.target.value })} required min="1" />
            <div className="flex gap-3">
              <Button type="submit" variant="success" className="flex-1"><Save size={16} /> Guardar</Button>
              <Button type="button" variant="secondary" onClick={() => setModalMesa({ isOpen: false })}>Cancelar</Button>
            </div>
          </form>
        </Modal>
      </div>
    </div>
  );
};

export default RestaurantApp;