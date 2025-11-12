import React, { useState, useEffect } from 'react';
import { Home, UtensilsCrossed, Package, Users, TrendingUp, Calendar, DollarSign, ShoppingCart, Plus, X, Check, AlertCircle } from 'lucide-react';

// ============= COMPONENTES UI =============

const Button = ({ children, onClick, variant = 'primary', size = 'md', disabled, className = '' }) => {
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
    <div className={`border-l-4 p-4 rounded ${types[type]} flex items-start gap-3`}>
      <AlertCircle size={20} className="mt-0.5 flex-shrink-0" />
      <div>{children}</div>
    </div>
  );
};

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
  return dias.map((dia, idx) => ({
    id: idx + 1,
    dia,
    platos: [
      { nombre: 'Bandeja Paisa', precio: 25000, disponible: true },
      { nombre: 'Pollo Asado', precio: 18000, disponible: true },
      { nombre: 'Pescado Frito', precio: 22000, disponible: true },
      { nombre: 'Cerdo BBQ', precio: 20000, disponible: true }
    ]
  }));
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
  const [platos] = useState(inicializarPlatos());
  const [personal] = useState(inicializarPersonal());
  const [ventas, setVentas] = useState([]);
  const [modalPedido, setModalPedido] = useState({ isOpen: false, mesa: null });

  const diaActual = new Date().getDay();
  const dias = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
  const menuHoy = platos.find(p => p.dia === dias[diaActual]);

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

  const actualizarInventario = (itemId, nuevaCantidad) => {
    const nuevoInventario = inventario.map(item =>
      item.id === itemId ? { ...item, cantidad: parseFloat(nuevaCantidad) || 0 } : item
    );
    setInventario(nuevoInventario);
  };

  const calcularEstadisticas = () => {
    const totalVentas = ventas.reduce((sum, v) => sum + v.total, 0);
    const nominaMensual = personal.reduce((sum, p) => sum + p.salario, 0);
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
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {mesas.map(mesa => (
                    <div
                      key={mesa.id}
                      className={`p-6 rounded-xl shadow-lg transition-all cursor-pointer ${
                        mesa.estado === 'libre'
                          ? 'bg-green-50 border-2 border-green-300 hover:shadow-xl'
                          : 'bg-red-50 border-2 border-red-300'
                      }`}
                    >
                      <div className="text-center">
                        <h3 className="text-xl font-bold text-gray-800">Mesa {mesa.numero}</h3>
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
                <h2 className="text-2xl font-bold mb-4 text-gray-800">Menú de la Semana</h2>
                <Alert type="info" className="mb-6">
                  <strong>Hoy es {dias[diaActual]}</strong> - Mostrando platos disponibles
                </Alert>

                <div className="space-y-6">
                  {platos.map(menuDia => {
                    const esHoy = menuDia.dia === dias[diaActual];
                    return (
                      <div
                        key={menuDia.id}
                        className={`p-6 rounded-xl shadow-lg ${
                          esHoy
                            ? 'bg-gradient-to-r from-orange-100 to-amber-100 border-2 border-orange-400'
                            : 'bg-white'
                        }`}
                      >
                        <h3 className="text-xl font-bold mb-4 text-gray-800 flex items-center gap-2">
                          <Calendar size={24} className="text-orange-600" />
                          {menuDia.dia} {esHoy && <span className="text-sm bg-orange-600 text-white px-2 py-1 rounded">HOY</span>}
                        </h3>
                        <div className="grid md:grid-cols-2 gap-3">
                          {menuDia.platos.map((plato, idx) => (
                            <div key={idx} className="bg-white p-4 rounded-lg shadow border border-gray-200">
                              <div className="flex justify-between items-center">
                                <span className="font-semibold text-gray-800">{plato.nombre}</span>
                                <span className="text-orange-600 font-bold">${plato.precio.toLocaleString()}</span>
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
                  <div className="bg-yellow-100 border border-yellow-300 px-4 py-2 rounded-lg">
                    <span className="font-semibold text-yellow-800">
                      Valor Total: ${stats.inventarioValor.toLocaleString()}
                    </span>
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
                                    <h4 className="font-bold text-gray-800">{item.nombre}</h4>
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
                  <div className="bg-blue-100 border border-blue-300 px-4 py-2 rounded-lg">
                    <span className="font-semibold text-blue-800">
                      Nómina Mensual: ${stats.gastosMes.toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  {personal.map(empleado => (
                    <div key={empleado.id} className="bg-white rounded-xl shadow-lg p-6">
                      <div className="flex items-start gap-4">
                        <div className="bg-orange-100 p-3 rounded-full">
                          <Users size={24} className="text-orange-600" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-bold text-gray-800">{empleado.nombre}</h3>
                          <p className="text-gray-600">{empleado.cargo}</p>
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
                    <p className="text-3xl font-bold">{personal.length}</p>
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

        {/* Modal: Tomar Pedido */}
        <Modal
          isOpen={modalPedido.isOpen}
          onClose={() => setModalPedido({ isOpen: false, mesa: null })}
          title={`Tomar Pedido - Mesa ${modalPedido.mesa?.numero}`}
        >
          <div className="space-y-4">
            <Alert type="info">
              Selecciona los platos del menú de hoy ({dias[diaActual]})
            </Alert>

            <div className="grid gap-3">
              {menuHoy?.platos.map((plato, idx) => (
                <button
                  key={idx}
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
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default RestaurantApp;