import React, { useState, useEffect } from 'react';
import { Home, UtensilsCrossed, Package, Users, TrendingUp, Calendar, DollarSign, ShoppingCart, Plus, X, Check, AlertCircle } from 'lucide-react';

// ============= CONFIGURACIÓN SUPABASE =============
// IMPORTANTE: Necesitas crear un archivo .env.local con:
// VITE_SUPABASE_URL=tu-url-de-supabase
// VITE_SUPABASE_ANON_KEY=tu-key-de-supabase

// Para esta demo, usaremos almacenamiento local simulando Supabase
// En producción, reemplazar con las llamadas reales a Supabase

const useSupabase = () => {
  // Hook simulado - reemplazar con supabase real
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const query = async (table, operation = 'select', data = null) => {
    setLoading(true);
    setError(null);
    
    try {
      // Simular delay de red
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const storageKey = `supabase_${table}`;
      let tableData = JSON.parse(localStorage.getItem(storageKey) || '[]');
      
      switch(operation) {
        case 'select':
          return tableData;
        
        case 'insert':
          const newItem = { ...data, id: crypto.randomUUID(), created_at: new Date().toISOString() };
          tableData.push(newItem);
          localStorage.setItem(storageKey, JSON.stringify(tableData));
          return newItem;
        
        case 'update':
          tableData = tableData.map(item => 
            item.id === data.id ? { ...item, ...data, updated_at: new Date().toISOString() } : item
          );
          localStorage.setItem(storageKey, JSON.stringify(tableData));
          return data;
        
        case 'delete':
          tableData = tableData.filter(item => item.id !== data.id);
          localStorage.setItem(storageKey, JSON.stringify(tableData));
          return data;
        
        default:
          return tableData;
      }
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { query, loading, error };
};

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden animate-slideUp">
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

const LoadingSpinner = () => (
  <div className="flex items-center justify-center p-8">
    <div className="animate-spin rounded-full h-12 w-12 border-4 border-orange-600 border-t-transparent"></div>
  </div>
);

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

// ============= COMPONENTE PRINCIPAL =============

const RestaurantApp = () => {
  const [activeTab, setActiveTab] = useState('mesas');
  const [mesas, setMesas] = useState([]);
  const [inventario, setInventario] = useState([]);
  const [platos, setPlatos] = useState([]);
  const [personal, setPersonal] = useState([]);
  const [pedidos, setPedidos] = useState([]);
  const [modalPedido, setModalPedido] = useState({ isOpen: false, mesa: null });
  const [modalInventario, setModalInventario] = useState({ isOpen: false });
  
  const { query, loading, error } = useSupabase();

  // ============= INICIALIZACIÓN =============
  
  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      const [mesasData, inventarioData, platosData, personalData, pedidosData] = await Promise.all([
        query('mesas'),
        query('inventario'),
        query('platos'),
        query('personal'),
        query('pedidos')
      ]);

      if (mesasData.length === 0) await inicializarDatos();
      else {
        setMesas(mesasData);
        setInventario(inventarioData);
        setPlatos(platosData);
        setPersonal(personalData);
        setPedidos(pedidosData);
      }
    } catch (err) {
      console.error('Error cargando datos:', err);
    }
  };

  const inicializarDatos = async () => {
    const mesasIniciales = Array.from({ length: 12 }, (_, i) => ({
      numero: i + 1,
      capacidad: i % 3 === 0 ? 6 : i % 2 === 0 ? 2 : 4,
      estado: 'libre'
    }));

    const inventarioInicial = [
      { nombre: 'Pollo', categoria: 'proteina', cantidad: 50, unidad: 'kg', precio_unitario: 8000, stock_minimo: 10 },
      { nombre: 'Carne de Res', categoria: 'proteina', cantidad: 30, unidad: 'kg', precio_unitario: 15000, stock_minimo: 10 },
      { nombre: 'Pescado', categoria: 'proteina', cantidad: 20, unidad: 'kg', precio_unitario: 12000, stock_minimo: 5 },
      { nombre: 'Cerdo', categoria: 'proteina', cantidad: 25, unidad: 'kg', precio_unitario: 10000, stock_minimo: 8 },
      { nombre: 'Arroz', categoria: 'acompañamiento', cantidad: 100, unidad: 'kg', precio_unitario: 2500, stock_minimo: 20 },
      { nombre: 'Papa', categoria: 'acompañamiento', cantidad: 80, unidad: 'kg', precio_unitario: 1500, stock_minimo: 15 },
      { nombre: 'Ensalada', categoria: 'acompañamiento', cantidad: 40, unidad: 'kg', precio_unitario: 3000, stock_minimo: 10 },
      { nombre: 'Frijoles', categoria: 'acompañamiento', cantidad: 60, unidad: 'kg', precio_unitario: 4000, stock_minimo: 15 }
    ];

    const dias = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    const platosIniciales = dias.flatMap((dia, idx) => [
      { nombre: 'Bandeja Paisa', precio: 25000, categoria: 'plato_fuerte', dia_semana: idx, disponible: true },
      { nombre: 'Pollo Asado', precio: 18000, categoria: 'plato_fuerte', dia_semana: idx, disponible: true },
      { nombre: 'Pescado Frito', precio: 22000, categoria: 'plato_fuerte', dia_semana: idx, disponible: true }
    ]);

    const personalInicial = [
      { nombre: 'Juan Pérez', cargo: 'Mesero', salario: 1300000, telefono: '3001234567', activo: true },
      { nombre: 'María López', cargo: 'Cocinera', salario: 1500000, telefono: '3009876543', activo: true },
      { nombre: 'Carlos Ruiz', cargo: 'Cajero', salario: 1300000, telefono: '3012345678', activo: true }
    ];

    for (const mesa of mesasIniciales) await query('mesas', 'insert', mesa);
    for (const item of inventarioInicial) await query('inventario', 'insert', item);
    for (const plato of platosIniciales) await query('platos', 'insert', plato);
    for (const empleado of personalInicial) await query('personal', 'insert', empleado);

    await cargarDatos();
  };

  // ============= FUNCIONES DE NEGOCIO =============

  const abrirModalPedido = (mesa) => {
    setModalPedido({ isOpen: true, mesa });
  };

  const agregarPedido = async (mesaId, plato) => {
    try {
      const pedido = await query('pedidos', 'insert', {
        mesa_id: mesaId,
        nombre_plato: plato.nombre,
        precio: plato.precio,
        cantidad: 1,
        estado: 'pendiente'
      });

      await query('mesas', 'update', {
        id: mesaId,
        estado: 'ocupada'
      });

      await cargarDatos();
      setModalPedido({ isOpen: false, mesa: null });
    } catch (err) {
      console.error('Error agregando pedido:', err);
    }
  };

  const cerrarMesa = async (mesaId) => {
    try {
      const pedidosMesa = pedidos.filter(p => p.mesa_id === mesaId);
      const total = pedidosMesa.reduce((sum, p) => sum + p.precio, 0);

      if (window.confirm(`¿Cerrar mesa con total de $${total.toLocaleString()}?`)) {
        await query('mesas', 'update', { id: mesaId, estado: 'libre' });
        
        for (const pedido of pedidosMesa) {
          await query('pedidos', 'update', { ...pedido, estado: 'pagado' });
        }

        await cargarDatos();
      }
    } catch (err) {
      console.error('Error cerrando mesa:', err);
    }
  };

  const actualizarInventario = async (itemId, nuevaCantidad) => {
    try {
      const item = inventario.find(i => i.id === itemId);
      await query('inventario', 'update', { ...item, cantidad: parseFloat(nuevaCantidad) });
      await cargarDatos();
    } catch (err) {
      console.error('Error actualizando inventario:', err);
    }
  };

  // ============= CÁLCULOS =============

  const calcularEstadisticas = () => {
    const pedidosPagados = pedidos.filter(p => p.estado === 'pagado');
    const totalVentas = pedidosPagados.reduce((sum, p) => sum + p.precio, 0);
    const totalGastos = personal.reduce((sum, p) => sum + p.salario, 0);
    const valorInventario = inventario.reduce((sum, i) => sum + (i.cantidad * i.precio_unitario), 0);

    return {
      ventasMes: totalVentas,
      gastosMes: totalGastos,
      gananciaMes: totalVentas - totalGastos,
      inventarioValor: valorInventario,
      pedidosTotal: pedidosPagados.length
    };
  };

  const stats = calcularEstadisticas();
  const diaActual = new Date().getDay();
  const platosHoy = platos.filter(p => p.dia_semana === diaActual);
  const dias = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

  // ============= RENDER =============

  if (loading && mesas.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50">
      <div className="container mx-auto p-4 max-w-7xl">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden mb-6">
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
            {error && (
              <Alert type="error" className="mb-4">
                Error: {error}
              </Alert>
            )}

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
                  {mesas.map(mesa => {
                    const pedidosMesa = pedidos.filter(p => p.mesa_id === mesa.id && p.estado !== 'pagado');
                    const total = pedidosMesa.reduce((sum, p) => sum + p.precio, 0);

                    return (
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
                              <div className="text-sm text-gray-600">{pedidosMesa.length} pedido(s)</div>
                              <div className="text-lg font-bold text-orange-600">${total.toLocaleString()}</div>
                              <Button onClick={() => cerrarMesa(mesa.id)} variant="success" size="sm" className="w-full">
                                <Check size={16} /> Cerrar Mesa
                              </Button>
                            </div>
                          )}

                          {mesa.estado === 'libre' && (
                            <Button onClick={() => abrirModalPedido(mesa)} variant="primary" size="sm" className="w-full mt-4">
                              <Plus size={16} /> Tomar Pedido
                            </Button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* TAB: MENÚ */}
            {activeTab === 'menu' && (
              <div>
                <h2 className="text-2xl font-bold mb-4 text-gray-800">Menú Semanal</h2>
                <Alert type="info" className="mb-6">
                  <strong>Hoy es {dias[diaActual]}</strong> - Mostrando {platosHoy.length} platos disponibles
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
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
                          {platosDia.map((plato) => (
                            <div key={plato.id} className="bg-white p-4 rounded-lg shadow border border-gray-200">
                              <div className="flex justify-between items-start">
                                <span className="font-semibold text-gray-800">{plato.nombre}</span>
                                <span className="text-orange-600 font-bold">${plato.precio.toLocaleString()}</span>
                              </div>
                              {plato.disponible ? (
                                <span className="text-xs text-green-600 mt-1 inline-block">✓ Disponible</span>
                              ) : (
                                <span className="text-xs text-red-600 mt-1 inline-block">✗ Agotado</span>
                              )}
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
                  <Alert type="warning">
                    Valor Total: ${stats.inventarioValor.toLocaleString()}
                  </Alert>
                </div>

                <div className="space-y-6">
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
                  <Alert type="info">
                    Nómina Mensual: ${personal.reduce((sum, p) => sum + p.salario, 0).toLocaleString()}
                  </Alert>
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
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600">Estado:</span>
                              <span className={`font-semibold ${empleado.activo ? 'text-green-600' : 'text-red-600'}`}>
                                {empleado.activo ? 'Activo' : 'Inactivo'}
                              </span>
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
                    <p className="text-3xl font-bold">{mesas.filter(m => m.estado === 'ocupada').length}</p>
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

                {/* Últimos Pedidos */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h3 className="text-xl font-bold mb-4 text-gray-800">Últimos Pedidos</h3>
                  <div className="space-y-3">
                    {pedidos.slice(-10).reverse().map(pedido => {
                      const mesa = mesas.find(m => m.id === pedido.mesa_id);
                      return (
                        <div key={pedido.id} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                          <div>
                            <p className="font-semibold text-gray-800">
                              Mesa {mesa?.numero} - {pedido.nombre_plato}
                            </p>
                            <p className="text-sm text-gray-600">
                              {new Date(pedido.created_at).toLocaleString('es-CO')}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-xl font-bold text-orange-600">
                              ${pedido.precio.toLocaleString()}
                            </p>
                            <span className={`text-xs px-2 py-1 rounded ${
                              pedido.estado === 'pagado' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {pedido.estado}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                    {pedidos.length === 0 && (
                      <p className="text-center text-gray-500 py-8">No hay pedidos registrados aún</p>
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
              {platosHoy.map(plato => (
                <button
                  key={plato.id}
                  onClick={() => agregarPedido(modalPedido.mesa.id, plato)}
                  className="flex justify-between items-center p-4 bg-white border-2 border-gray-200 rounded-lg hover:border-orange-500 hover:bg-orange-50 transition-all"
                  disabled={!plato.disponible}
                >
                  <div className="text-left">
                    <p className="font-semibold text-gray-800">{plato.nombre}</p>
                    <p className="text-sm text-gray-600">{plato.categoria}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-orange-600">${plato.precio.toLocaleString()}</p>
                    {!plato.disponible && (
                      <span className="text-xs text-red-600">Agotado</span>
                    )}
                  </div>
                </button>
              ))}

              {platosHoy.length === 0 && (
                <p className="text-center text-gray-500 py-8">No hay platos disponibles para hoy</p>
              )}
            </div>
          </div>
        </Modal>
      </div>

      {/* CSS Animations */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default RestaurantApp;