import React, { useState, useEffect } from 'react';
import { Home, UtensilsCrossed, Package, Users, TrendingUp, Calendar, DollarSign, ShoppingCart, Plus, X, Check, AlertCircle, Edit, Trash2, Save } from 'lucide-react';

// ============= COMPONENTES UI =============

const Button = ({ children, onClick, variant = 'primary', size = 'md', disabled, className = '', type = 'button' }) => {
  const baseClasses = 'font-semibold rounded-lg transition-all duration-200 flex items-center justify-center gap-2';
  
  const variants = {
    primary: 'bg-orange-600 text-white hover:bg-orange-700 active:scale-95',
    secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300 active:scale-95',
    success: 'bg-green-600 text-white hover:bg-green-700 active:scale-95',
    danger: 'bg-red-600 text-white hover:bg-red-700 active:scale-95',
    outline: 'border-2 border-orange-600 text-orange-600 hover:bg-orange-50 active:scale-95'
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
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
    >
      {children}
    </button>
  );
};

const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        <div className="bg-gradient-to-r from-orange-600 to-amber-600 p-4 flex justify-between items-center">
          <h3 className="text-xl font-bold text-white">{title}</h3>
          <button onClick={onClose} className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-colors">
            <X size={24} />
          </button>
        </div>
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
          {children}
        </div>
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
      <AlertCircle size={20} className="mt-0.5 flex-shrink-0" />
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
      {options.map(opt => (
        <option key={opt.value} value={opt.value}>{opt.label}</option>
      ))}
    </select>
  </div>
);

// ============= DATOS INICIALES =============

const inicializarMesas = () => {
  return Array.from({ length: 12 }, (_, i) => ({
    id: i + 1,
    numero: i + 1,
    capacidad: i % 3 === 0 ? 6 : i % 2 === 0 ? 2 : 4,
    estado: 'libre',
    pedidos: [],
    total: 0
  }));
};

const inicializarInventario = () => {
  return [
    { id: 1, nombre: 'Pollo', categoria: 'proteina', cantidad: 50, unidad: 'kg', precio_unitario: 8000, stock_minimo: 10 },
    { id: 2, nombre: 'Carne de Res', categoria: 'proteina', cantidad: 30, unidad: 'kg', precio_unitario: 15000, stock_minimo: 10 },
    { id: 3, nombre: 'Pescado', categoria: 'proteina', cantidad: 20, unidad: 'kg', precio_unitario: 12000, stock_minimo: 5 },
    { id: 4, nombre: 'Cerdo', categoria: 'proteina', cantidad: 25, unidad: 'kg', precio_unitario: 10000, stock_minimo: 8 },
    { id: 5, nombre: 'Arroz', categoria: 'acompañamiento', cantidad: 100, unidad: 'kg', precio_unitario: 2500, stock_minimo: 20 },
    { id: 6, nombre: 'Papa', categoria: 'acompañamiento', cantidad: 80, unidad: 'kg', precio_unitario: 1500, stock_minimo: 15 },
    { id: 7, nombre: 'Ensalada', categoria: 'acompañamiento', cantidad: 40, unidad: 'kg', precio_unitario: 3000, stock_minimo: 10 },
    { id: 8, nombre: 'Frijoles', categoria: 'acompañamiento', cantidad: 60, unidad: 'kg', precio_unitario: 4000, stock_minimo: 15 },
    { id: 9, nombre: 'Gaseosa', categoria: 'bebida', cantidad: 100, unidad: 'unidades', precio_unitario: 1500, stock_minimo: 20 },
    { id: 10, nombre: 'Jugo Natural', categoria: 'bebida', cantidad: 50, unidad: 'litros', precio_unitario: 3000, stock_minimo: 10 }
  ];
};

const inicializarPlatos = () => {
  const dias = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
  return dias.flatMap((dia, idx) => [
    { id: `${idx}-1`, nombre: 'Bandeja Paisa', precio: 25000, disponible: true, dia_semana: idx, dia },
    { id: `${idx}-2`, nombre: 'Pollo Asado', precio: 18000, disponible: true, dia_semana: idx, dia },
    { id: `${idx}-3`, nombre: 'Pescado Frito', precio: 22000, disponible: true, dia_semana: idx, dia },
    { id: `${idx}-4`, nombre: 'Cerdo BBQ', precio: 20000, disponible: true, dia_semana: idx, dia }
  ]);
};

const inicializarPersonal = () => {
  return [
    { id: 1, nombre: 'Juan Pérez', cargo: 'Mesero', salario: 1300000, telefono: '3001234567', activo: true },
    { id: 2, nombre: 'María López', cargo: 'Cocinera', salario: 1500000, telefono: '3009876543', activo: true },
    { id: 3, nombre: 'Carlos Ruiz', cargo: 'Cajero', salario: 1300000, telefono: '3012345678', activo: true },
    { id: 4, nombre: 'Ana García', cargo: 'Mesera', salario: 1300000, telefono: '3023456789', activo: true }
  ];
};

// ============= COMPONENTE PRINCIPAL =============

const RestaurantApp = () => {
  const [activeTab, setActiveTab] = useState('mesas');
  const [mesas, setMesas] = useState(inicializarMesas());
  const [inventario, setInventario] = useState(inicializarInventario());
  const [platos, setPlatos] = useState(inicializarPlatos());
  const [personal, setPersonal] = useState(inicializarPersonal());
  const [ventas, setVentas] = useState([]);
  
  // Modales
  const [modalPedido, setModalPedido] = useState({ isOpen: false, mesa: null });
  const [modalPersonal, setModalPersonal] = useState({ isOpen: false, empleado: null });
  const [modalPlato, setModalPlato] = useState({ isOpen: false, plato: null });
  const [modalInventario, setModalInventario] = useState({ isOpen: false, item: null });
  const [modalMesa, setModalMesa] = useState({ isOpen: false, mesa: null });

  // Formularios
  const [formPersonal, setFormPersonal] = useState({ nombre: '', cargo: 'Mesero', salario: '', telefono: '' });
  const [formPlato, setFormPlato] = useState({ nombre: '', precio: '', dia_semana: 1 });
  const [formInventario, setFormInventario] = useState({ nombre: '', categoria: 'proteina', cantidad: '', unidad: 'kg', precio_unitario: '', stock_minimo: '' });
  const [formMesa, setFormMesa] = useState({ numero: '', capacidad: 4 });

  const diaActual = new Date().getDay();
  const dias = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

  // ============= FUNCIONES MESAS =============
  
  const tomarPedido = (mesaId, plato) => {
    const nuevasMesas = mesas.map(mesa => {
      if (mesa.id === mesaId) {
        const nuevosPedidos = [...mesa.pedidos, { ...plato, cantidad: 1 }];
        return {
          ...mesa,
          estado: 'ocupada',
          pedidos: nuevosPedidos,
          total: nuevosPedidos.reduce((sum, p) => sum + p.precio, 0)
        };
      }
      return mesa;
    });
    setMesas(nuevasMesas);
    setModalPedido({ isOpen: false, mesa: null });
  };

  const cerrarMesa = (mesaId) => {
    const mesa = mesas.find(m => m.id === mesaId);
    if (mesa && mesa.total > 0) {
      if (window.confirm(`¿Cerrar mesa ${mesa.numero} con total de $${mesa.total.toLocaleString()}?`)) {
        const nuevaVenta = {
          id: Date.now(),
          mesaId,
          total: mesa.total,
          pedidos: mesa.pedidos,
          fecha: new Date()
        };
        setVentas([...ventas, nuevaVenta]);
        
        const nuevasMesas = mesas.map(m => 
          m.id === mesaId ? { ...m, estado: 'libre', pedidos: [], total: 0 } : m
        );
        setMesas(nuevasMesas);
      }
    }
  };

  const agregarMesa = (e) => {
    e.preventDefault();
    const nuevaMesa = {
      id: Date.now(),
      numero: parseInt(formMesa.numero),
      capacidad: parseInt(formMesa.capacidad),
      estado: 'libre',
      pedidos: [],
      total: 0
    };
    setMesas([...mesas, nuevaMesa]);
    setModalMesa({ isOpen: false, mesa: null });
    setFormMesa({ numero: '', capacidad: 4 });
  };

  const eliminarMesa = (mesaId) => {
    if (window.confirm('¿Eliminar esta mesa?')) {
      setMesas(mesas.filter(m => m.id !== mesaId));
    }
  };

  // ============= FUNCIONES INVENTARIO =============
  
  const actualizarInventario = (itemId, nuevaCantidad) => {
    const nuevoInventario = inventario.map(item =>
      item.id === itemId ? { ...item, cantidad: parseFloat(nuevaCantidad) || 0 } : item
    );
    setInventario(nuevoInventario);
  };

  const agregarInventario = (e) => {
    e.preventDefault();
    const nuevoItem = {
      id: Date.now(),
      ...formInventario,
      cantidad: parseFloat(formInventario.cantidad),
      precio_unitario: parseFloat(formInventario.precio_unitario),
      stock_minimo: parseFloat(formInventario.stock_minimo)
    };
    setInventario([...inventario, nuevoItem]);
    setModalInventario({ isOpen: false, item: null });
    setFormInventario({ nombre: '', categoria: 'proteina', cantidad: '', unidad: 'kg', precio_unitario: '', stock_minimo: '' });
  };

  const eliminarInventario = (itemId) => {
    if (window.confirm('¿Eliminar este item del inventario?')) {
      setInventario(inventario.filter(i => i.id !== itemId));
    }
  };

  // ============= FUNCIONES PLATOS =============
  
  const agregarPlato = (e) => {
    e.preventDefault();
    const nuevoPlato = {
      id: Date.now(),
      ...formPlato,
      precio: parseFloat(formPlato.precio),
      dia_semana: parseInt(formPlato.dia_semana),
      dia: dias[parseInt(formPlato.dia_semana)],
      disponible: true
    };
    setPlatos([...platos, nuevoPlato]);
    setModalPlato({ isOpen: false, plato: null });
    setFormPlato({ nombre: '', precio: '', dia_semana: 1 });
  };

  const eliminarPlato = (platoId) => {
    if (window.confirm('¿Eliminar este plato del menú?')) {
      setPlatos(platos.filter(p => p.id !== platoId));
    }
  };

  const toggleDisponibilidadPlato = (platoId) => {
    setPlatos(platos.map(p => 
      p.id === platoId ? { ...p, disponible: !p.disponible } : p
    ));
  };

  // ============= FUNCIONES PERSONAL =============
  
  const agregarPersonal = (e) => {
    e.preventDefault();
    const nuevoEmpleado = {
      id: Date.now(),
      ...formPersonal,
      salario: parseFloat(formPersonal.salario),
      activo: true
    };
    setPersonal([...personal, nuevoEmpleado]);
    setModalPersonal({ isOpen: false, empleado: null });
    setFormPersonal({ nombre: '', cargo: 'Mesero', salario: '', telefono: '' });
  };

  const eliminarPersonal = (empleadoId) => {
    if (window.confirm('¿Eliminar este empleado?')) {
      setPersonal(personal.filter(p => p.id !== empleadoId));
    }
  };

  const toggleActivoPersonal = (empleadoId) => {
    setPersonal(personal.map(p => 
      p.id === empleadoId ? { ...p, activo: !p.activo } : p
    ));
  };

  // ============= ESTADÍSTICAS =============
  
  const calcularEstadisticas = () => {
    const totalVentas = ventas.reduce((sum, v) => sum + v.total, 0);
    const nominaMensual = personal.filter(p => p.activo).reduce((sum, p) => sum + p.salario, 0);
    const valorInventario = inventario.reduce((sum, i) => sum + (i.cantidad * i.precio_unitario), 0);

    return {
      ventasMes: totalVentas,
      gastosMes: nominaMensual,
      gananciaMes: totalVentas - nominaMensual,
      inventarioValor: valorInventario,
      pedidosTotal: ventas.length,
      mesasOcupadas: mesas.filter(m => m.estado === 'ocupada').length
    };
  };

  const stats = calcularEstadisticas();
  const platosHoy = platos.filter(p => p.dia_semana === diaActual);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50">
      <div className="container mx-auto p-4 max-w-7xl">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-orange-600 to-amber-600 p-6">
            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
              <UtensilsCrossed size={36} />
              Sistema de Gestión - Mi Restaurante
            </h1>
            <p className="text-orange-100 mt-2">Control Total de tu Negocio</p>
          </div>

          {/* Tabs */}
          <div className="flex flex-wrap gap-2 p-4 bg-gray-50 border-b overflow-x-auto">
            {[
              { id: 'mesas', label: 'Mesas', icon: Home },
              { id: 'menu', label: 'Menú', icon: Calendar },
              { id: 'inventario', label: 'Inventario', icon: Package },
              { id: 'personal', label: 'Personal', icon: Users },
              { id: 'reportes', label: 'Reportes', icon: TrendingUp }
            ].map(tab => (
              <Button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                variant={activeTab === tab.id ? 'primary' : 'secondary'}
                size="md"
              >
                <tab.icon size={20} />
                {tab.label}
              </Button>
            ))}
          </div>

          {/* Content */}
          <div className="p-6">
            {/* TAB: MESAS */}
            {activeTab === 'mesas' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-800">Estado de las Mesas</h2>
                  <div className="flex gap-4 items-center">
                    <div className="flex gap-4 text-sm">
                      <span className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                        Libre: {mesas.filter(m => m.estado === 'libre').length}
                      </span>
                      <span className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                        Ocupada: {mesas.filter(m => m.estado === 'ocupada').length}
                      </span>
                    </div>
                    <Button onClick={() => { setFormMesa({ numero: mesas.length + 1, capacidad: 4 }); setModalMesa({ isOpen: true }); }} size="sm">
                      <Plus size={16} /> Agregar Mesa
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {mesas.map(mesa => (
                    <div
                      key={mesa.id}
                      className={`p-6 rounded-xl shadow-lg transition-all ${
                        mesa.estado === 'libre'
                          ? 'bg-green-50 border-2 border-green-300 hover:shadow-xl'
                          : 'bg-red-50 border-2 border-red-300'
                      }`}
                    >
                      <div className="text-center">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="text-xl font-bold text-gray-800">Mesa {mesa.numero}</h3>
                          <button onClick={() => eliminarMesa(mesa.id)} className="text-red-600 hover:text-red-800">
                            <Trash2 size={16} />
                          </button>
                        </div>
                        <p className="text-sm text-gray-600">Cap: {mesa.capacidad} personas</p>
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-sm font-semibold mt-2 ${
                            mesa.estado === 'libre'
                              ? 'bg-green-200 text-green-800'
                              : 'bg-red-200 text-red-800'
                          }`}
                        >
                          {mesa.estado.toUpperCase()}
                        </span>

                        {mesa.estado === 'ocupada' && (
                          <div className="mt-4 space-y-2">
                            <div className="text-sm text-gray-600">{mesa.pedidos.length} pedido(s)</div>
                            <div className="text-lg font-bold text-orange-600">${mesa.total.toLocaleString()}</div>
                            <Button onClick={() => cerrarMesa(mesa.id)} variant="success" size="sm" className="w-full">
                              <Check size={16} /> Cerrar Mesa
                            </Button>
                          </div>
                        )}

                        {mesa.estado === 'libre' && (
                          <Button onClick={() => setModalPedido({ isOpen: true, mesa })} variant="primary" size="sm" className="w-full mt-4">
                            <Plus size={16} /> Tomar Pedido
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB: MENÚ */}
            {activeTab === 'menu' && (
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-bold text-gray-800">Menú de la Semana</h2>
                  <Button onClick={() => { setFormPlato({ nombre: '', precio: '', dia_semana: diaActual }); setModalPlato({ isOpen: true }); }} size="sm">
                    <Plus size={16} /> Agregar Plato
                  </Button>
                </div>
                
                <Alert type="info">
                  <strong>Hoy es {dias[diaActual]}</strong> - {platosHoy.length} platos disponibles
                </Alert>

                <div className="space-y-6">
                  {dias.map((dia, idx) => {
                    const platosDia = platos.filter(p => p.dia_semana === idx);
                    const esHoy = idx === diaActual;
                    return (
                      <div
                        key={idx}
                        className={`p-6 rounded-xl shadow-lg ${
                          esHoy
                            ? 'bg-gradient-to-r from-orange-100 to-amber-100 border-2 border-orange-400'
                            : 'bg-white'
                        }`}
                      >
                        <h3 className="text-xl font-bold mb-4 text-gray-800 flex items-center gap-2">
                          <Calendar size={24} className="text-orange-600" />
                          {dia} {esHoy && <span className="text-sm bg-orange-600 text-white px-2 py-1 rounded">HOY</span>}
                        </h3>
                        <div className="grid md:grid-cols-2 gap-3">
                          {platosDia.map((plato) => (
                            <div key={plato.id} className="bg-white p-4 rounded-lg shadow border border-gray-200">
                              <div className="flex justify-between items-start mb-2">
                                <div>
                                  <span className="font-semibold text-gray-800">{plato.nombre}</span>
                                  <p className="text-orange-600 font-bold">${plato.precio.toLocaleString()}</p>
                                </div>
                                <div className="flex gap-2">
                                  <button onClick={() => toggleDisponibilidadPlato(plato.id)} className={`px-2 py-1 text-xs rounded ${plato.disponible ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                                    {plato.disponible ? 'Disponible' : 'Agotado'}
                                  </button>
                                  <button onClick={() => eliminarPlato(plato.id)} className="text-red-600 hover:text-red-800">
                                    <Trash2 size={16} />
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* TAB: INVENTARIO */}
            {activeTab === 'inventario' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-800">Control de Inventario</h2>
                  <div className="flex gap-4 items-center">
                    <div className="bg-yellow-100 border border-yellow-300 px-4 py-2 rounded-lg">
                      <span className="font-semibold text-yellow-800">
                        Valor Total: ${stats.inventarioValor.toLocaleString()}
                      </span>
                    </div>
                    <Button onClick={() => { setFormInventario({ nombre: '', categoria: 'proteina', cantidad: '', unidad: 'kg', precio_unitario: '', stock_minimo: '' }); setModalInventario({ isOpen: true }); }} size="sm">
                      <Plus size={16} /> Agregar Item
                    </Button>
                  </div>
                </div>

                <div className="grid gap-4">
                  {['proteina', 'acompañamiento', 'bebida'].map(categoria => (
                    <div key={categoria} className="bg-white rounded-xl shadow-lg p-6">
                      <h3 className="text-xl font-bold mb-4 text-gray-800 capitalize flex items-center gap-2">
                        <Package size={24} className="text-orange-600" />
                        {categoria}s
                      </h3>
                      <div className="space-y-3">
                        {inventario
                          .filter(item => item.categoria === categoria)
                          .map(item => {
                            const bajStock = item.cantidad <= item.stock_minimo;
                            return (
                              <div
                                key={item.id}
                                className={`p-4 rounded-lg border-2 ${
                                  bajStock ? 'bg-red-50 border-red-300' : 'bg-gray-50 border-gray-200'
                                }`}
                              >
                                <div className="flex flex-wrap items-center justify-between gap-4">
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2">
                                      <h4 className="font-bold text-gray-800">{item.nombre}</h4>
                                      <button onClick={() => eliminarInventario(item.id)} className="text-red-600 hover:text-red-800">
                                        <Trash2 size={16} />
                                      </button>
                                    </div>
                                    <p className="text-sm text-gray-600">
                                      ${item.precio_unitario.toLocaleString()}/{item.unidad}
                                    </p>
                                    {bajStock && (
                                      <span className="text-red-600 text-sm font-semibold flex items-center gap-1 mt-1">
                                        <AlertCircle size={16} /> Stock bajo (mín: {item.stock_minimo})
                                      </span>
                                    )}
                                  </div>
                                  <div className="flex items-center gap-3">
                                    <input
                                      type="number"
                                      value={item.cantidad}
                                      onChange={(e) => actualizarInventario(item.id, e.target.value)}
                                      className="w-24 px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-orange-500 focus:outline-none"
                                      min="0"
                                      step="0.1"
                                    />
                                    <span className="text-gray-600 font-semibold">{item.unidad}</span>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB: PERSONAL */}
            {activeTab === 'personal' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-800">Gestión de Personal</h2>
                  <div className="flex gap-4 items-center">
                    <div className="bg-blue-100 border border-blue-300 px-4 py-2 rounded-lg">
                      <span className="font-semibold text-blue-800">
                        Nómina Mensual: ${stats.gastosMes.toLocaleString()}
                      </span>
                    </div>
                    <Button onClick={() => { setFormPersonal({ nombre: '', cargo: 'Mesero', salario: '', telefono: '' }); setModalPersonal({ isOpen: true }); }} size="sm">
                      <Plus size={16} /> Agregar Empleado
                    </Button>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  {personal.map(empleado => (
                    <div key={empleado.id} className={`bg-white rounded-xl shadow-lg p-6 ${!empleado.activo ? 'opacity-60' : ''}`}>
                      <div className="flex items-start gap-4">
                        <div className="bg-orange-100 p-3 rounded-full">
                          <Users size={24} className="text-orange-600" />
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="text-lg font-bold text-gray-800">{empleado.nombre}</h3>
                              <p className="text-gray-600">{empleado.cargo}</p>
                            </div>
                            <div className="flex gap-2">
                              <button onClick={() => toggleActivoPersonal(empleado.id)} className={`px-2 py-1 text-xs rounded ${empleado.activo ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                                {empleado.activo ? 'Activo' : 'Inactivo'}
                              </button>
                              <button onClick={() => eliminarPersonal(empleado.id)} className="text-red-600 hover:text-red-800">
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </div>
                          <div className="mt-3 space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600">Salario:</span>
                              <span className="font-bold text-orange-600">${empleado.salario.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600">Teléfono:</span>
                              <span className="font-semibold">{empleado.telefono}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB: REPORTES */}
            {activeTab === 'reportes' && (
              <div>
                <h2 className="text-2xl font-bold mb-6 text-gray-800">Reportes Financieros</h2>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                  <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg p-6 text-white">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-semibold">Ventas Totales</h3>
                      <DollarSign size={28} />
                    </div>
                    <p className="text-3xl font-bold">${stats.ventasMes.toLocaleString()}</p>
                    <p className="text-sm text-green-100 mt-1">{stats.pedidosTotal} pedidos</p>
                  </div>

                  <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl shadow-lg p-6 text-white">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-semibold">Ganancia</h3>
                      <TrendingUp size={28} />
                    </div>
                    <p className="text-3xl font-bold">${stats.gananciaMes.toLocaleString()}</p>
                    <p className="text-sm text-orange-100 mt-1">Después de gastos</p>
                  </div>

                  <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-xl shadow-lg p-6 text-white">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-semibold">Gastos</h3>
                      <ShoppingCart size={28} />
                    </div>
                    <p className="text-3xl font-bold">${stats.gastosMes.toLocaleString()}</p>
                    <p className="text-sm text-red-100 mt-1">Nómina del mes</p>
                  </div>

                  <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-semibold">Inventario</h3>
                      <Package size={28} />
                    </div>
                    <p className="text-3xl font-bold">${stats.inventarioValor.toLocaleString()}</p>
                    <p className="text-sm text-blue-100 mt-1">Valor total en stock</p>
                  </div>

                  <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg p-6 text-white">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-semibold">Mesas Activas</h3>
                      <Home size={28} />
                    </div>
                    <p className="text-3xl font-bold">{stats.mesasOcupadas}</p>
                    <p className="text-sm text-purple-100 mt-1">De {mesas.length} totales</p>
                  </div>

                  <div className="bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl shadow-lg p-6 text-white">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-semibold">Personal</h3>
                      <Users size={28} />
                    </div>
                    <p className="text-3xl font-bold">{personal.filter(p => p.activo).length}</p>
                    <p className="text-sm text-amber-100 mt-1">Empleados activos</p>
                  </div>
                </div>

                {/* Últimas Ventas */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h3 className="text-xl font-bold mb-4 text-gray-800">Últimas Ventas</h3>
                  <div className="space-y-3">
                    {ventas.slice(-10).reverse().map(venta => (
                      <div key={venta.id} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-semibold text-gray-800">Mesa {venta.mesaId}</p>
                          <p className="text-sm text-gray-600">
                            {venta.fecha.toLocaleString('es-CO')}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-xl font-bold text-orange-600">
                            ${venta.total.toLocaleString()}
                          </p>
                          <p className="text-sm text-gray-600">
                            {venta.pedidos.length} producto(s)
                          </p>
                        </div>
                      </div>
                    ))}
                    {ventas.length === 0 && (
                      <p className="text-center text-gray-500 py-8">No hay ventas registradas aún</p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* MODAL: Tomar Pedido */}
        <Modal
          isOpen={modalPedido.isOpen}
          onClose={() => setModalPedido({ isOpen: false, mesa: null })}
          title={`Tomar Pedido - Mesa ${modalPedido.mesa?.numero}`}
        >
          <Alert type="info">
            Selecciona los platos del menú de hoy ({dias[diaActual]})
          </Alert>

          <div className="grid gap-3">
            {platosHoy.filter(p => p.disponible).map((plato) => (
              <button
                key={plato.id}
                onClick={() => tomarPedido(modalPedido.mesa.id, plato)}
                className="flex justify-between items-center p-4 bg-white border-2 border-gray-200 rounded-lg hover:border-orange-500 hover:bg-orange-50 transition-all"
              >
                <div className="text-left">
                  <p className="font-semibold text-gray-800">{plato.nombre}</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-orange-600">${plato.precio.toLocaleString()}</p>
                </div>
              </button>
            ))}
            {platosHoy.filter(p => p.disponible).length === 0 && (
              <p className="text-center text-gray-500 py-8">No hay platos disponibles para hoy</p>
            )}
          </div>
        </Modal>

        {/* MODAL: Agregar Personal */}
        <Modal
          isOpen={modalPersonal.isOpen}
          onClose={() => setModalPersonal({ isOpen: false, empleado: null })}
          title="Agregar Empleado"
        >
          <form onSubmit={agregarPersonal}>
            <Input
              label="Nombre completo"
              value={formPersonal.nombre}
              onChange={(e) => setFormPersonal({ ...formPersonal, nombre: e.target.value })}
              required
              placeholder="Ej: Juan Pérez"
            />
            <Select
              label="Cargo"
              value={formPersonal.cargo}
              onChange={(e) => setFormPersonal({ ...formPersonal, cargo: e.target.value })}
              options={[
                { value: 'Mesero', label: 'Mesero' },
                { value: 'Cocinero', label: 'Cocinero' },
                { value: 'Cajero', label: 'Cajero' },
                { value: 'Administrador', label: 'Administrador' },
                { value: 'Ayudante', label: 'Ayudante' }
              ]}
              required
            />
            <Input
              label="Salario mensual"
              type="number"
              value={formPersonal.salario}
              onChange={(e) => setFormPersonal({ ...formPersonal, salario: e.target.value })}
              required
              min="0"
              placeholder="1300000"
            />
            <Input
              label="Teléfono"
              value={formPersonal.telefono}
              onChange={(e) => setFormPersonal({ ...formPersonal, telefono: e.target.value })}
              required
              placeholder="3001234567"
            />
            <div className="flex gap-3">
              <Button type="submit" variant="success" className="flex-1">
                <Save size={16} /> Guardar
              </Button>
              <Button type="button" variant="secondary" onClick={() => setModalPersonal({ isOpen: false })}>
                Cancelar
              </Button>
            </div>
          </form>
        </Modal>

        {/* MODAL: Agregar Plato */}
        <Modal
          isOpen={modalPlato.isOpen}
          onClose={() => setModalPlato({ isOpen: false, plato: null })}
          title="Agregar Plato al Menú"
        >
          <form onSubmit={agregarPlato}>
            <Input
              label="Nombre del plato"
              value={formPlato.nombre}
              onChange={(e) => setFormPlato({ ...formPlato, nombre: e.target.value })}
              required
              placeholder="Ej: Bandeja Paisa"
            />
            <Input
              label="Precio"
              type="number"
              value={formPlato.precio}
              onChange={(e) => setFormPlato({ ...formPlato, precio: e.target.value })}
              required
              min="0"
              placeholder="25000"
            />
            <Select
              label="Día de la semana"
              value={formPlato.dia_semana}
              onChange={(e) => setFormPlato({ ...formPlato, dia_semana: e.target.value })}
              options={dias.map((dia, idx) => ({ value: idx, label: dia }))}
              required
            />
            <div className="flex gap-3">
              <Button type="submit" variant="success" className="flex-1">
                <Save size={16} /> Guardar
              </Button>
              <Button type="button" variant="secondary" onClick={() => setModalPlato({ isOpen: false })}>
                Cancelar
              </Button>
            </div>
          </form>
        </Modal>

        {/* MODAL: Agregar Inventario */}
        <Modal
          isOpen={modalInventario.isOpen}
          onClose={() => setModalInventario({ isOpen: false, item: null })}
          title="Agregar Item al Inventario"
        >
          <form onSubmit={agregarInventario}>
            <Input
              label="Nombre del producto"
              value={formInventario.nombre}
              onChange={(e) => setFormInventario({ ...formInventario, nombre: e.target.value })}
              required
              placeholder="Ej: Pollo"
            />
            <Select
              label="Categoría"
              value={formInventario.categoria}
              onChange={(e) => setFormInventario({ ...formInventario, categoria: e.target.value })}
              options={[
                { value: 'proteina', label: 'Proteína' },
                { value: 'acompañamiento', label: 'Acompañamiento' },
                { value: 'bebida', label: 'Bebida' },
                { value: 'ingrediente', label: 'Ingrediente' }
              ]}
              required
            />
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Cantidad"
                type="number"
                value={formInventario.cantidad}
                onChange={(e) => setFormInventario({ ...formInventario, cantidad: e.target.value })}
                required
                min="0"
                step="0.1"
                placeholder="50"
              />
              <Select
                label="Unidad"
                value={formInventario.unidad}
                onChange={(e) => setFormInventario({ ...formInventario, unidad: e.target.value })}
                options={[
                  { value: 'kg', label: 'Kilogramos' },
                  { value: 'g', label: 'Gramos' },
                  { value: 'l', label: 'Litros' },
                  { value: 'ml', label: 'Mililitros' },
                  { value: 'unidades', label: 'Unidades' }
                ]}
                required
              />
            </div>
            <Input
              label="Precio unitario"
              type="number"
              value={formInventario.precio_unitario}
              onChange={(e) => setFormInventario({ ...formInventario, precio_unitario: e.target.value })}
              required
              min="0"
              placeholder="8000"
            />
            <Input
              label="Stock mínimo"
              type="number"
              value={formInventario.stock_minimo}
              onChange={(e) => setFormInventario({ ...formInventario, stock_minimo: e.target.value })}
              required
              min="0"
              step="0.1"
              placeholder="10"
            />
            <div className="flex gap-3">
              <Button type="submit" variant="success" className="flex-1">
                <Save size={16} /> Guardar
              </Button>
              <Button type="button" variant="secondary" onClick={() => setModalInventario({ isOpen: false })}>
                Cancelar
              </Button>
            </div>
          </form>
        </Modal>

        {/* MODAL: Agregar Mesa */}
        <Modal
          isOpen={modalMesa.isOpen}
          onClose={() => setModalMesa({ isOpen: false, mesa: null })}
          title="Agregar Nueva Mesa"
        >
          <form onSubmit={agregarMesa}>
            <Input
              label="Número de mesa"
              type="number"
              value={formMesa.numero}
              onChange={(e) => setFormMesa({ ...formMesa, numero: e.target.value })}
              required
              min="1"
              placeholder={mesas.length + 1}
            />
            <Input
              label="Capacidad (personas)"
              type="number"
              value={formMesa.capacidad}
              onChange={(e) => setFormMesa({ ...formMesa, capacidad: e.target.value })}
              required
              min="1"
              placeholder="4"
            />
            <div className="flex gap-3">
              <Button type="submit" variant="success" className="flex-1">
                <Save size={16} /> Guardar
              </Button>
              <Button type="button" variant="secondary" onClick={() => setModalMesa({ isOpen: false })}>
                Cancelar
              </Button>
            </div>
          </form>
        </Modal>
      </div>
    </div>
  );
};

export default RestaurantApp;