import React, { useState, useEffect } from 'react';
import { Home, UtensilsCrossed, Package, Users, TrendingUp, Calendar, DollarSign, ShoppingCart, Plus, X, Check, AlertCircle, Trash2, Save, Minus, Search, Moon, Sun, Printer, Share2, Award, Clock, ChefHat, Coffee, Receipt, AlertTriangle, CheckCircle, XCircle, Bell, Edit } from 'lucide-react';

const formatearMoneda = (valor) => {
  return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(valor);
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

const Button = ({ children, onClick, variant = 'primary', size = 'md', disabled, className = '', type = 'button' }) => {
  const variants = {
    primary: 'bg-orange-600 text-white hover:bg-orange-700',
    secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300',
    success: 'bg-green-600 text-white hover:bg-green-700',
    danger: 'bg-red-600 text-white hover:bg-red-700',
    warning: 'bg-yellow-600 text-white hover:bg-yellow-700',
    info: 'bg-blue-600 text-white hover:bg-blue-700',
    outline: 'border-2 border-orange-600 text-orange-600 hover:bg-orange-50'
  };
  const sizes = { sm: 'px-3 py-1.5 text-sm', md: 'px-4 py-2', lg: 'px-6 py-3 text-lg' };
  return (
    <button type={type} onClick={onClick} disabled={disabled} className={`font-semibold rounded-lg transition-all flex items-center justify-center gap-2 ${variants[variant]} ${sizes[size]} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}>
      {children}
    </button>
  );
};

const Modal = ({ isOpen, onClose, title, children, size = 'md' }) => {
  if (!isOpen) return null;
  const sizes = { sm: 'max-w-md', md: 'max-w-2xl', lg: 'max-w-4xl', xl: 'max-w-6xl' };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div className={`bg-white rounded-2xl shadow-2xl ${sizes[size]} w-full max-h-[90vh] overflow-hidden`}>
        <div className="bg-gradient-to-r from-orange-600 to-amber-600 p-4 flex justify-between items-center">
          <h3 className="text-xl font-bold text-white">{title}</h3>
          <button onClick={onClose} className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2"><X size={24} /></button>
        </div>
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">{children}</div>
      </div>
    </div>
  );
};

const Alert = ({ type = 'info', children, icon }) => {
  const types = {
    success: 'bg-green-50 border-green-300 text-green-800',
    error: 'bg-red-50 border-red-300 text-red-800',
    warning: 'bg-yellow-50 border-yellow-300 text-yellow-800',
    info: 'bg-blue-50 border-blue-300 text-blue-800'
  };
  return (
    <div className={`border-l-4 p-4 rounded ${types[type]} flex items-start gap-3 mb-4`}>
      {icon || <AlertCircle size={20} className="flex-shrink-0" />}
      <div className="flex-1">{children}</div>
    </div>
  );
};

const Badge = ({ children, variant = 'default' }) => {
  const variants = {
    default: 'bg-gray-200 text-gray-800',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    danger: 'bg-red-100 text-red-800',
    info: 'bg-blue-100 text-blue-800'
  };
  return <span className={`px-3 py-1 rounded-full text-xs font-bold ${variants[variant]}`}>{children}</span>;
};

const Input = ({ label, type = 'text', value, onChange, required, placeholder, min, step }) => (
  <div className="mb-4">
    <label className="block text-sm font-semibold text-gray-700 mb-2">
      {label} {required && <span className="text-red-600">*</span>}
    </label>
    <input type={type} value={value} onChange={onChange} required={required} placeholder={placeholder} min={min} step={step} className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-orange-500 focus:outline-none" />
  </div>
);

const Select = ({ label, value, onChange, options, required }) => (
  <div className="mb-4">
    <label className="block text-sm font-semibold text-gray-700 mb-2">
      {label} {required && <span className="text-red-600">*</span>}
    </label>
    <select value={value} onChange={onChange} required={required} className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-orange-500 focus:outline-none">
      {options.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
    </select>
  </div>
);

const TextArea = ({ label, value, onChange, placeholder, rows = 2 }) => (
  <div className="mb-2">
    {label && <label className="block text-xs font-semibold text-gray-600 mb-1">{label}</label>}
    <textarea value={value} onChange={onChange} placeholder={placeholder} rows={rows} className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:border-orange-500 focus:outline-none resize-none" />
  </div>
);

const inicializarMesas = () => Array.from({ length: 12 }, (_, i) => ({
  id: `mesa-${i + 1}`,
  numero: i + 1,
  capacidad: i % 3 === 0 ? 6 : i % 2 === 0 ? 2 : 4,
  estado: 'libre',
  pedidos: [],
  total: 0
}));

const inicializarInventario = () => [
  { id: 'inv-1', nombre: 'Pollo Entero', categoria: 'proteina', cantidad: 10, unidad: 'unidades', precio_unitario: 12000, stock_minimo: 5, porciones_por_unidad: 8 },
  { id: 'inv-2', nombre: 'Carne de Res', categoria: 'proteina', cantidad: 15, unidad: 'libras', precio_unitario: 8000, stock_minimo: 5, porciones_por_unidad: 4 },
  { id: 'inv-3', nombre: 'Pescado', categoria: 'proteina', cantidad: 8, unidad: 'unidades', precio_unitario: 10000, stock_minimo: 5, porciones_por_unidad: 1 },
  { id: 'inv-4', nombre: 'Arroz', categoria: 'acompañamiento', cantidad: 25, unidad: 'kg', precio_unitario: 2500, stock_minimo: 5, porciones_por_unidad: 10 },
  { id: 'inv-5', nombre: 'Papa', categoria: 'acompañamiento', cantidad: 30, unidad: 'kg', precio_unitario: 1500, stock_minimo: 5, porciones_por_unidad: 10 },
  { id: 'inv-6', nombre: 'Yuca', categoria: 'acompañamiento', cantidad: 20, unidad: 'kg', precio_unitario: 1800, stock_minimo: 5, porciones_por_unidad: 8 },
  { id: 'inv-7', nombre: 'Ensalada', categoria: 'acompañamiento', cantidad: 15, unidad: 'kg', precio_unitario: 2000, stock_minimo: 5, porciones_por_unidad: 12 },
  { id: 'inv-8', nombre: 'Gaseosa', categoria: 'bebida', cantidad: 50, unidad: 'unidades', precio_unitario: 1500, stock_minimo: 5, porciones_por_unidad: 1 },
  { id: 'inv-9', nombre: 'Jugo Natural', categoria: 'bebida', cantidad: 30, unidad: 'unidades', precio_unitario: 2000, stock_minimo: 5, porciones_por_unidad: 1 },
  { id: 'inv-10', nombre: 'Cerveza', categoria: 'bebida', cantidad: 40, unidad: 'unidades', precio_unitario: 3000, stock_minimo: 5, porciones_por_unidad: 1 }
];

const inicializarPlatos = () => {
  const dias = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
  return dias.flatMap((dia, idx) => [
    { id: `plato-${idx}-1`, nombre: 'Bandeja Paisa', precio: 25000, disponible: true, dia_semana: idx, dia, estacion: 'cocina', receta: [{ ingrediente_id: 'inv-2', porciones: 1, nombre: 'Carne de Res' }, { ingrediente_id: 'inv-4', porciones: 1, nombre: 'Arroz' }, { ingrediente_id: 'inv-5', porciones: 1, nombre: 'Papa' }] },
    { id: `plato-${idx}-2`, nombre: 'Pollo Asado', precio: 18000, disponible: true, dia_semana: idx, dia, estacion: 'cocina', receta: [{ ingrediente_id: 'inv-1', porciones: 1, nombre: 'Pollo Entero' }, { ingrediente_id: 'inv-5', porciones: 1, nombre: 'Papa' }, { ingrediente_id: 'inv-7', porciones: 1, nombre: 'Ensalada' }] },
    { id: `plato-${idx}-3`, nombre: 'Pescado Frito', precio: 22000, disponible: true, dia_semana: idx, dia, estacion: 'cocina', receta: [{ ingrediente_id: 'inv-3', porciones: 1, nombre: 'Pescado' }, { ingrediente_id: 'inv-4', porciones: 1, nombre: 'Arroz' }, { ingrediente_id: 'inv-6', porciones: 1, nombre: 'Yuca' }] },
    { id: `plato-${idx}-4`, nombre: 'Sopa de Papa', precio: 12000, disponible: true, dia_semana: idx, dia, estacion: 'cocina', receta: [{ ingrediente_id: 'inv-5', porciones: 1, nombre: 'Papa' }, { ingrediente_id: 'inv-2', porciones: 0.5, nombre: 'Carne de Res' }] },
    { id: `plato-${idx}-5`, nombre: 'Jugo Natural', precio: 4000, disponible: true, dia_semana: idx, dia, estacion: 'bar', receta: [{ ingrediente_id: 'inv-9', porciones: 1, nombre: 'Jugo Natural' }] },
    { id: `plato-${idx}-6`, nombre: 'Gaseosa', precio: 3000, disponible: true, dia_semana: idx, dia, estacion: 'bar', receta: [{ ingrediente_id: 'inv-8', porciones: 1, nombre: 'Gaseosa' }] }
  ]);
};

const inicializarPersonal = () => [
  { id: 'emp-1', nombre: 'Juan Pérez', cargo: 'Mesero', salario: 1300000, telefono: '3001234567', activo: true },
  { id: 'emp-2', nombre: 'María López', cargo: 'Cocinera', salario: 1500000, telefono: '3009876543', activo: true },
  { id: 'emp-3', nombre: 'Carlos Ruiz', cargo: 'Cajero', salario: 1300000, telefono: '3012345678', activo: true },
  { id: 'emp-4', nombre: 'Ana Torres', cargo: 'Barman', salario: 1400000, telefono: '3015678901', activo: true }
];

const RestaurantApp = () => {
  const [activeTab, setActiveTab] = useState('mesas');
  const [mesas, setMesas] = useState(() => cargarDesdeStorage('mesas', inicializarMesas));
  const [inventario, setInventario] = useState(() => cargarDesdeStorage('inventario', inicializarInventario));
  const [platos, setPlatos] = useState(() => cargarDesdeStorage('platos', inicializarPlatos));
  const [personal, setPersonal] = useState(() => cargarDesdeStorage('personal', inicializarPersonal));
  const [ventas, setVentas] = useState(() => cargarDesdeStorage('ventas', () => []));
  const [comandas, setComandas] = useState(() => cargarDesdeStorage('comandas', () => []));
  const [darkMode, setDarkMode] = useState(false);
  const [busqueda, setBusqueda] = useState('');
  
  const [modalPedido, setModalPedido] = useState({ isOpen: false, mesa: null, carrito: [] });
  const [modalCerrarMesa, setModalCerrarMesa] = useState({ isOpen: false, mesa: null, propina: 10, metodoPago: 'efectivo', dividirEntre: 1 });
  const [modalPersonal, setModalPersonal] = useState({ isOpen: false });
  const [modalPlato, setModalPlato] = useState({ isOpen: false, editando: null });
  const [modalInventario, setModalInventario] = useState({ isOpen: false, editando: null });
  const [modalMesa, setModalMesa] = useState({ isOpen: false });
  const [modalReceta, setModalReceta] = useState({ isOpen: false, plato: null, recetaTemp: [] });

  const [formPersonal, setFormPersonal] = useState({ nombre: '', cargo: 'Mesero', salario: '', telefono: '' });
  const [formPlato, setFormPlato] = useState({ nombre: '', precio: '', dia_semana: 1, estacion: 'cocina' });
  const [formInventario, setFormInventario] = useState({ nombre: '', categoria: 'proteina', cantidad: '', unidad: 'kg', precio_unitario: '', stock_minimo: 5, porciones_por_unidad: 1 });
  const [formMesa, setFormMesa] = useState({ numero: '', capacidad: 4 });

  const dias = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
  const diaActual = new Date().getDay();

  useEffect(() => { guardarEnStorage('mesas', mesas); }, [mesas]);
  useEffect(() => { guardarEnStorage('inventario', inventario); }, [inventario]);
  useEffect(() => { guardarEnStorage('platos', platos); }, [platos]);
  useEffect(() => { guardarEnStorage('personal', personal); }, [personal]);
  useEffect(() => { guardarEnStorage('ventas', ventas); }, [ventas]);
  useEffect(() => { guardarEnStorage('comandas', comandas); }, [comandas]);

  const calcularPlatosDisponibles = (plato) => {
    if (!plato.receta || plato.receta.length === 0) return 999;
    let minPlatos = 999;
    plato.receta.forEach(ingrediente => {
      const item = inventario.find(i => i.id === ingrediente.ingrediente_id);
      if (item) {
        const platosDisponibles = Math.floor((item.cantidad * item.porciones_por_unidad) / ingrediente.porciones);
        minPlatos = Math.min(minPlatos, platosDisponibles);
      }
    });
    return minPlatos;
  };

  const descontarInventario = (receta, cantidad) => {
    setInventario(prevInventario => {
      const nuevoInventario = [...prevInventario];
      receta.forEach(ingrediente => {
        const idx = nuevoInventario.findIndex(i => i.id === ingrediente.ingrediente_id);
        if (idx !== -1) {
          const item = nuevoInventario[idx];
          const unidadesADescontar = (ingrediente.porciones * cantidad) / item.porciones_por_unidad;
          nuevoInventario[idx] = { ...item, cantidad: Math.max(0, item.cantidad - unidadesADescontar) };
        }
      });
      return nuevoInventario;
    });
  };

  const verificarDisponibilidad = (plato, cantidad) => {
    const disponibles = calcularPlatosDisponibles(plato);
    return disponibles >= cantidad;
  };

  const agregarAlCarrito = (plato) => {
    if (!verificarDisponibilidad(plato, 1)) {
      alert(`❌ No hay suficiente inventario para: ${plato.nombre}\n\nPlatos disponibles: ${calcularPlatosDisponibles(plato)}`);
      return;
    }
    setModalPedido(prev => ({ ...prev, carrito: [...prev.carrito, { ...plato, cantidad: 1, notas: '', id_carrito: Date.now() }] }));
  };

  const actualizarCantidad = (id_carrito, cambio) => {
    setModalPedido(prev => {
      const item = prev.carrito.find(i => i.id_carrito === id_carrito);
      const nuevaCantidad = item.cantidad + cambio;
      if (cambio > 0 && !verificarDisponibilidad(item, nuevaCantidad)) {
        const disponibles = calcularPlatosDisponibles(item);
        alert(`❌ Solo hay ${disponibles} platos disponibles de ${item.nombre}`);
        return prev;
      }
      return { ...prev, carrito: prev.carrito.map(item => item.id_carrito === id_carrito ? { ...item, cantidad: Math.max(1, nuevaCantidad) } : item) };
    });
  };

  const removerDelCarrito = (id_carrito) => {
    setModalPedido(prev => ({ ...prev, carrito: prev.carrito.filter(item => item.id_carrito !== id_carrito) }));
  };

  const actualizarNotas = (id_carrito, notas) => {
    setModalPedido(prev => ({ ...prev, carrito: prev.carrito.map(item => item.id_carrito === id_carrito ? { ...item, notas } : item) }));
  };

  const calcularTotal = () => modalPedido.carrito.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);

  const confirmarPedido = () => {
    if (modalPedido.carrito.length === 0) return alert('Carrito vacío');
    const nuevaComanda = {
      id: `comanda-${Date.now()}`,
      numeroMesa: modalPedido.mesa.numero,
      items: modalPedido.carrito,
      fecha: new Date().toISOString(),
      estado: 'pendiente',
      total: calcularTotal()
    };
    setComandas([...comandas, nuevaComanda]);
    modalPedido.carrito.forEach(item => { if (item.receta) { descontarInventario(item.receta, item.cantidad); } });
    setMesas(mesas.map(mesa => {
      if (mesa.id === modalPedido.mesa.id) {
        const nuevosPedidos = [...mesa.pedidos, ...modalPedido.carrito];
        return { ...mesa, estado: 'ocupada', pedidos: nuevosPedidos, total: nuevosPedidos.reduce((sum, p) => sum + (p.precio * p.cantidad), 0), comanda_id: nuevaComanda.id };
      }
      return mesa;
    }));
    setModalPedido({ isOpen: false, mesa: null, carrito: [] });
    const itemsCocina = modalPedido.carrito.filter(i => i.estacion === 'cocina');
    const itemsBar = modalPedido.carrito.filter(i => i.estacion === 'bar');
    if (itemsCocina.length > 0) { setTimeout(() => imprimirComandaEstacion({ ...nuevaComanda, items: itemsCocina }, 'COCINA'), 500); }
    if (itemsBar.length > 0) { setTimeout(() => imprimirComandaEstacion({ ...nuevaComanda, items: itemsBar }, 'BAR'), 1000); }
    alert('✅ Pedido confirmado\n📄 Comandas enviadas a cocina/bar');
  };

  const cambiarEstadoComanda = (comandaId, nuevoEstado) => {
    setComandas(comandas.map(c => c.id === comandaId ? { ...c, estado: nuevoEstado } : c));
  };

  const imprimirComandaEstacion = (comanda, estacion) => {
    let ticket = `\n═════════════════════════════════\n         ${estacion}\n═════════════════════════════════\nMesa: ${comanda.numeroMesa}\nComanda: #${comanda.id.slice(-6)}\n${new Date(comanda.fecha).toLocaleTimeString('es-CO')}\n─────────────────────────────────\n`;
    comanda.items.forEach((item, i) => {
      ticket += `\n${i+1}. ${item.nombre} x${item.cantidad}`;
      if (item.notas) ticket += `\n   ⚠️ ${item.notas}`;
    });
    ticket += `\n═════════════════════════════════\n`;
    const ventana = window.open('', '_blank');
    ventana.document.write(`<pre style="font-family: 'Courier New', monospace; font-size: 16px; padding: 20px;">${ticket}</pre>`);
    ventana.print();
  };

  const abrirModalCerrarMesa = (mesa) => {
    setModalCerrarMesa({ isOpen: true, mesa, propina: 10, metodoPago: 'efectivo', dividirEntre: 1 });
  };

  const cerrarMesa = () => {
    const { mesa, propina, metodoPago, dividirEntre } = modalCerrarMesa;
    const subtotal = mesa.total;
    const montoPropina = subtotal * (propina / 100);
    const total = subtotal + montoPropina;
    const nuevaVenta = { id: `venta-${Date.now()}`, numeroMesa: mesa.numero, subtotal, propina, montoPropina, total, metodoPago, dividirEntre, pedidos: mesa.pedidos, fecha: new Date().toISOString() };
    setVentas([...ventas, nuevaVenta]);
    setMesas(mesas.map(m => m.id === mesa.id ? { ...m, estado: 'libre', pedidos: [], total: 0, comanda_id: null } : m));
    if (mesa.comanda_id) { setComandas(comandas.filter(c => c.id !== mesa.comanda_id)); }
    setModalCerrarMesa({ isOpen: false, mesa: null, propina: 10, metodoPago: 'efectivo', dividirEntre: 1 });
  };

  const imprimirRecibo = () => {
    const { mesa, propina } = modalCerrarMesa;
    let recibo = `\n═══════════════════════════════\n      MI RESTAURANTE\n═══════════════════════════════\nMesa ${mesa.numero}\n${new Date().toLocaleString('es-CO')}\n\nPEDIDO:\n`;
    mesa.pedidos.forEach((p, i) => {
      recibo += `\n${i+1}. ${p.nombre} x${p.cantidad}`;
      recibo += `\n   ${formatearMoneda(p.precio * p.cantidad)}`;
      if (p.notas) recibo += `\n   Nota: ${p.notas}`;
    });
    const montoPropina = mesa.total * (propina / 100);
    recibo += `\n\n───────────────────────────────\nSubtotal: ${formatearMoneda(mesa.total)}\nPropina ${propina}%: ${formatearMoneda(montoPropina)}\n───────────────────────────────\nTOTAL: ${formatearMoneda(mesa.total + montoPropina)}\n═══════════════════════════════\n   ¡GRACIAS POR SU VISITA!\n═══════════════════════════════`;
    const ventana = window.open('', '_blank');
    ventana.document.write(`<pre style="font-family: 'Courier New', monospace; font-size: 14px; padding: 20px;">${recibo}</pre>`);
    ventana.print();
  };

  const compartirWhatsApp = () => {
    const { mesa, propina } = modalCerrarMesa;
    const montoPropina = mesa.total * (propina / 100);
    const texto = `*MI RESTAURANTE*\n\nMesa ${mesa.numero}\nTotal: ${formatearMoneda(mesa.total + montoPropina)}\n\n¡Gracias por su visita!`;
    window.open(`https://wa.me/?text=${encodeURIComponent(texto)}`);
  };

  const agregarMesa = (e) => {
    e.preventDefault();
    setMesas([...mesas, { id: `mesa-${Date.now()}`, numero: parseInt(formMesa.numero), capacidad: parseInt(formMesa.capacidad), estado: 'libre', pedidos: [], total: 0 }]);
    setModalMesa({ isOpen: false });
    setFormMesa({ numero: '', capacidad: 4 });
  };

  const eliminarMesa = (id) => {
    if (window.confirm('¿Eliminar mesa?')) setMesas(mesas.filter(m => m.id !== id));
  };

  const agregarInventario = (e) => {
    e.preventDefault();
    if (modalInventario.editando) {
      setInventario(inventario.map(item => item.id === modalInventario.editando.id ? { ...item, ...formInventario, cantidad: parseFloat(formInventario.cantidad), precio_unitario: parseFloat(formInventario.precio_unitario), stock_minimo: parseFloat(formInventario.stock_minimo), porciones_por_unidad: parseFloat(formInventario.porciones_por_unidad) } : item));
    } else {
      setInventario([...inventario, { id: `inv-${Date.now()}`, ...formInventario, cantidad: parseFloat(formInventario.cantidad), precio_unitario: parseFloat(formInventario.precio_unitario), stock_minimo: parseFloat(formInventario.stock_minimo), porciones_por_unidad: parseFloat(formInventario.porciones_por_unidad) }]);
    }
    setModalInventario({ isOpen: false, editando: null });
    setFormInventario({ nombre: '', categoria: 'proteina', cantidad: '', unidad: 'kg', precio_unitario: '', stock_minimo: 5, porciones_por_unidad: 1 });
  };

  const editarInventario = (item) => {
    setFormInventario({ nombre: item.nombre, categoria: item.categoria, cantidad: item.cantidad, unidad: item.unidad, precio_unitario: item.precio_unitario, stock_minimo: item.stock_minimo, porciones_por_unidad: item.porciones_por_unidad });
    setModalInventario({ isOpen: true, editando: item });
  };

  const actualizarInventario = (id, nuevaCantidad) => {
    setInventario(inventario.map(item => item.id === id ? { ...item, cantidad: parseFloat(nuevaCantidad) || 0 } : item));
  };

  const eliminarInventario = (id) => {
    if (window.confirm('¿Eliminar item?')) setInventario(inventario.filter(i => i.id !== id));
  };

  const agregarPlato = (e) => {
    e.preventDefault();
    if (modalPlato.editando) {
      setPlatos(platos.map(p => p.id === modalPlato.editando.id ? { ...p, nombre: formPlato.nombre, precio: parseFloat(formPlato.precio), dia_semana: parseInt(formPlato.dia_semana), dia: dias[parseInt(formPlato.dia_semana)], estacion: formPlato.estacion } : p));
    } else {
      setPlatos([...platos, { id: `plato-${Date.now()}`, ...formPlato, precio: parseFloat(formPlato.precio), dia_semana: parseInt(formPlato.dia_semana), dia: dias[parseInt(formPlato.dia_semana)], disponible: true, receta: [] }]);
    }
    setModalPlato({ isOpen: false, editando: null });
    setFormPlato({ nombre: '', precio: '', dia_semana: 1, estacion: 'cocina' });
  };

  const editarPlato = (plato) => {
    setFormPlato({ nombre: plato.nombre, precio: plato.precio, dia_semana: plato.dia_semana, estacion: plato.estacion });
    setModalPlato({ isOpen: true, editando: plato });
  };

  const eliminarPlato = (id) => {
    if (window.confirm('¿Eliminar plato?')) setPlatos(platos.filter(p => p.id !== id));
  };

  const toggleDisponibilidad = (id) => {
    setPlatos(platos.map(p => p.id === id ? { ...p, disponible: !p.disponible } : p));
  };

  const abrirModalReceta = (plato) => {
    setModalReceta({ isOpen: true, plato, recetaTemp: plato.receta || [] });
  };

  const agregarIngredienteReceta = (ingrediente_id) => {
    const ingrediente = inventario.find(i => i.id === ingrediente_id);
    if (!ingrediente) return;
    const yaExiste = modalReceta.recetaTemp.find(r => r.ingrediente_id === ingrediente_id);
    if (yaExiste) { alert('Este ingrediente ya está en la receta'); return; }
    setModalReceta(prev => ({ ...prev, recetaTemp: [...prev.recetaTemp, { ingrediente_id, nombre: ingrediente.nombre, porciones: 1 }] }));
  };

  const actualizarPorcionesReceta = (ingrediente_id, porciones) => {
    setModalReceta(prev => ({ ...prev, recetaTemp: prev.recetaTemp.map(r => r.ingrediente_id === ingrediente_id ? { ...r, porciones: parseFloat(porciones) || 0 } : r) }));
  };

  const eliminarIngredienteReceta = (ingrediente_id) => {
    setModalReceta(prev => ({ ...prev, recetaTemp: prev.recetaTemp.filter(r => r.ingrediente_id !== ingrediente_id) }));
  };

  const guardarReceta = () => {
    setPlatos(platos.map(p => p.id === modalReceta.plato.id ? { ...p, receta: modalReceta.recetaTemp } : p));
    setModalReceta({ isOpen: false, plato: null, recetaTemp: [] });
  };

  const agregarPersonal = (e) => {
    e.preventDefault();
    setPersonal([...personal, { id: `emp-${Date.now()}`, ...formPersonal, salario: parseFloat(formPersonal.salario), activo: true }]);
    setModalPersonal({ isOpen: false });
    setFormPersonal({ nombre: '', cargo: 'Mesero', salario: '', telefono: '' });
  };

  const eliminarPersonal = (id) => {
    if (window.confirm('¿Eliminar empleado?')) setPersonal(personal.filter(p => p.id !== id));
  };

  const toggleActivo = (id) => {
    setPersonal(personal.map(p => p.id === id ? { ...p, activo: !p.activo } : p));
  };

  const stats = {
    ventasMes: ventas.reduce((sum, v) => sum + v.total, 0),
    totalPropinas: ventas.reduce((sum, v) => sum + v.montoPropina, 0),
    gastosMes: personal.filter(p => p.activo).reduce((sum, p) => sum + p.salario, 0),
    inventarioValor: inventario.reduce((sum, i) => sum + (i.cantidad * i.precio_unitario), 0),
    pedidosTotal: ventas.length,
    mesasOcupadas: mesas.filter(m => m.estado === 'ocupada').length,
    itemsBajoStock: inventario.filter(i => i.cantidad <= i.stock_minimo).length
  };

  const platosHoy = platos.filter(p => p.dia_semana === diaActual && p.disponible);
  const platosFiltrados = platosHoy.filter(p => p.nombre.toLowerCase().includes(busqueda.toLowerCase()));

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-orange-50 to-amber-50'}`}>
      <div className="container mx-auto p-4 max-w-7xl">
        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-2xl overflow-hidden`}>
          
          <div className="bg-gradient-to-r from-orange-600 to-amber-600 p-6 flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                <UtensilsCrossed size={36} />
                Mi Restaurante PRO
              </h1>
              <p className="text-orange-100 mt-1">Sistema Completo con Control de Inventario</p>
            </div>
            <div className="flex gap-3">
              {stats.itemsBajoStock > 0 && (
                <button className="bg-red-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 animate-pulse">
                  <AlertTriangle size={20} />
                  {stats.itemsBajoStock} Items Bajo Stock
                </button>
              )}
              <button onClick={() => setDarkMode(!darkMode)} className="bg-white bg-opacity-20 p-3 rounded-full hover:bg-opacity-30">
                {darkMode ? <Sun size={24} className="text-white" /> : <Moon size={24} className="text-white" />}
              </button>
            </div>
          </div>

          <div className={`flex flex-wrap gap-2 p-4 ${darkMode ? 'bg-gray-700' : 'bg-gray-50'} border-b`}>
            {[
              { id: 'mesas', label: 'Mesas', icon: Home },
              { id: 'comandas', label: 'Comandas', icon: Receipt },
              { id: 'menu', label: 'Menú', icon: Calendar },
              { id: 'inventario', label: 'Inventario', icon: Package },
              { id: 'personal', label: 'Personal', icon: Users },
              { id: 'reportes', label: 'Reportes', icon: TrendingUp }
            ].map(tab => (
              <Button key={tab.id} onClick={() => setActiveTab(tab.id)} variant={activeTab === tab.id ? 'primary' : 'secondary'} size="md">
                <tab.icon size={20} />
                {tab.label}
                {tab.id === 'comandas' && comandas.length > 0 && (
                  <span className="bg-red-500 text-white rounded-full px-2 py-0.5 text-xs ml-1">{comandas.length}</span>
                )}
              </Button>
            ))}
          </div>

          <div className="p-6">
            
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

            {activeTab === 'comandas' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>Comandas Activas</h2>
                  <Badge variant={comandas.length > 0 ? 'danger' : 'success'}>{comandas.length} activas</Badge>
                </div>

                {comandas.length === 0 ? (
                  <Alert type="info">
                    <div className="text-center py-8">
                      <Receipt size={48} className="mx-auto mb-4 text-gray-400" />
                      <p className="text-lg font-semibold">No hay comandas activas</p>
                      <p className="text-sm text-gray-600">Las comandas aparecerán aquí cuando se tomen pedidos</p>
                    </div>
                  </Alert>
                ) : (
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className={`${darkMode ? 'bg-gray-700' : 'bg-white'} rounded-xl shadow-lg p-6`}>
                      <div className="flex items-center gap-3 mb-4">
                        <ChefHat size={28} className="text-orange-600" />
                        <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>COCINA</h3>
                      </div>
                      {comandas.map(comanda => {
                        const itemsCocina = comanda.items.filter(i => i.estacion === 'cocina');
                        if (itemsCocina.length === 0) return null;
                        return (
                          <div key={comanda.id} className="mb-4 p-4 bg-orange-50 rounded-lg border-2 border-orange-300">
                            <div className="flex justify-between items-start mb-2">
                              <div>
                                <p className="font-bold text-lg">Mesa {comanda.numeroMesa}</p>
                                <p className="text-xs text-gray-600">#{comanda.id.slice(-6)} - {new Date(comanda.fecha).toLocaleTimeString('es-CO')}</p>
                              </div>
                              <Badge variant={comanda.estado === 'pendiente' ? 'warning' : comanda.estado === 'preparando' ? 'info' : 'success'}>
                                {comanda.estado.toUpperCase()}
                              </Badge>
                            </div>
                            <div className="space-y-1 mb-3">
                              {itemsCocina.map((item, i) => (
                                <div key={i} className="text-sm">
                                  <span className="font-semibold">{item.cantidad}x {item.nombre}</span>
                                  {item.notas && <p className="text-xs text-red-600">⚠️ {item.notas}</p>}
                                </div>
                              ))}
                            </div>
                            <div className="flex gap-2">
                              {comanda.estado === 'pendiente' && (
                                <Button onClick={() => cambiarEstadoComanda(comanda.id, 'preparando')} variant="warning" size="sm" className="flex-1">
                                  <Clock size={14} /> Preparando
                                </Button>
                              )}
                              {comanda.estado === 'preparando' && (
                                <Button onClick={() => cambiarEstadoComanda(comanda.id, 'listo')} variant="success" size="sm" className="flex-1">
                                  <CheckCircle size={14} /> Listo
                                </Button>
                              )}
                              <Button onClick={() => imprimirComandaEstacion({ ...comanda, items: itemsCocina }, 'COCINA')} variant="secondary" size="sm">
                                <Printer size={14} />
                              </Button>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    <div className={`${darkMode ? 'bg-gray-700' : 'bg-white'} rounded-xl shadow-lg p-6`}>
                      <div className="flex items-center gap-3 mb-4">
                        <Coffee size={28} className="text-blue-600" />
                        <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>BAR</h3>
                      </div>
                      {comandas.map(comanda => {
                        const itemsBar = comanda.items.filter(i => i.estacion === 'bar');
                        if (itemsBar.length === 0) return null;
                        return (
                          <div key={comanda.id} className="mb-4 p-4 bg-blue-50 rounded-lg border-2 border-blue-300">
                            <div className="flex justify-between items-start mb-2">
                              <div>
                                <p className="font-bold text-lg">Mesa {comanda.numeroMesa}</p>
                                <p className="text-xs text-gray-600">#{comanda.id.slice(-6)} - {new Date(comanda.fecha).toLocaleTimeString('es-CO')}</p>
                              </div>
                              <Badge variant={comanda.estado === 'pendiente' ? 'warning' : comanda.estado === 'preparando' ? 'info' : 'success'}>
                                {comanda.estado.toUpperCase()}
                              </Badge>
                            </div>
                            <div className="space-y-1 mb-3">
                              {itemsBar.map((item, i) => (
                                <div key={i} className="text-sm">
                                  <span className="font-semibold">{item.cantidad}x {item.nombre}</span>
                                  {item.notas && <p className="text-xs text-red-600">⚠️ {item.notas}</p>}
                                </div>
                              ))}
                            </div>
                            <div className="flex gap-2">
                              {comanda.estado === 'pendiente' && (
                                <Button onClick={() => cambiarEstadoComanda(comanda.id, 'preparando')} variant="warning" size="sm" className="flex-1">
                                  <Clock size={14} /> Preparando
                                </Button>
                              )}
                              {comanda.estado === 'preparando' && (
                                <Button onClick={() => cambiarEstadoComanda(comanda.id, 'listo')} variant="success" size="sm" className="flex-1">
                                  <CheckCircle size={14} /> Listo
                                </Button>
                              )}
                              <Button onClick={() => imprimirComandaEstacion({ ...comanda, items: itemsBar }, 'BAR')} variant="secondary" size="sm">
                                <Printer size={14} />
                              </Button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'menu' && (
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>Menú Semanal</h2>
                  <Button onClick={() => { setFormPlato({ nombre: '', precio: '', dia_semana: diaActual, estacion: 'cocina' }); setModalPlato({ isOpen: true, editando: null }); }} size="sm">
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
                        {platosDia.map(plato => {
                          const disponibles = calcularPlatosDisponibles(plato);
                          const sinStock = disponibles === 0;
                          return (
                            <div key={plato.id} className={`p-4 rounded-lg shadow flex justify-between items-start ${sinStock ? 'bg-red-50 border-2 border-red-300' : 'bg-white'}`}>
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <p className="font-semibold">{plato.nombre}</p>
                                  {plato.estacion === 'bar' ? <Coffee size={16} className="text-blue-600" /> : <ChefHat size={16} className="text-orange-600" />}
                                </div>
                                <p className="text-orange-600 font-bold">{formatearMoneda(plato.precio)}</p>
                                {plato.receta && plato.receta.length > 0 && (
                                  <p className={`text-xs mt-1 ${sinStock ? 'text-red-600 font-bold' : 'text-gray-600'}`}>
                                    {sinStock ? '❌ Sin stock' : `✅ ${disponibles} disponibles`}
                                  </p>
                                )}
                              </div>
                              <div className="flex flex-col gap-1">
                                <button onClick={() => toggleDisponibilidad(plato.id)} className={`px-2 py-1 text-xs rounded ${plato.disponible ? 'bg-green-100 text-green-800' : 'bg-gray-100'}`}>
                                  {plato.disponible ? '✓' : '✗'}
                                </button>
                                <button onClick={() => abrirModalReceta(plato)} className="px-2 py-1 text-xs rounded bg-blue-100 text-blue-800" title="Editar receta">
                                  <Edit size={14} />
                                </button>
                                <button onClick={() => editarPlato(plato)} className="px-2 py-1 text-xs rounded bg-yellow-100 text-yellow-800" title="Editar plato">
                                  <Edit size={14} />
                                </button>
                                <button onClick={() => eliminarPlato(plato.id)} className="text-red-600">
                                  <Trash2 size={14} />
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {activeTab === 'inventario' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>Inventario</h2>
                  <div className="flex gap-4 items-center">
                    <span className="bg-yellow-100 px-4 py-2 rounded font-semibold">Total: {formatearMoneda(stats.inventarioValor)}</span>
                    <Button onClick={() => { setFormInventario({ nombre: '', categoria: 'proteina', cantidad: '', unidad: 'kg', precio_unitario: '', stock_minimo: 5, porciones_por_unidad: 1 }); setModalInventario({ isOpen: true, editando: null }); }} size="sm">
                      <Plus size={16} /> Agregar
                    </Button>
                  </div>
                </div>

                {stats.itemsBajoStock > 0 && (
                  <Alert type="warning" icon={<AlertTriangle size={20} />}>
                    <strong>{stats.itemsBajoStock} productos</strong> tienen stock bajo o agotado. ¡Reponer pronto!
                  </Alert>
                )}

                {['proteina', 'acompañamiento', 'bebida'].map(categoria => (
                  <div key={categoria} className={`${darkMode ? 'bg-gray-700' : 'bg-white'} rounded-xl shadow-lg p-6 mb-4`}>
                    <h3 className={`text-xl font-bold mb-4 capitalize ${darkMode ? 'text-white' : 'text-gray-800'}`}>{categoria}s</h3>
                    <div className="space-y-3">
                      {inventario.filter(item => item.categoria === categoria).map(item => {
                        const bajStock = item.cantidad <= item.stock_minimo;
                        const agotado = item.cantidad === 0;
                        return (
                          <div key={item.id} className={`p-4 rounded-lg border-2 ${agotado ? 'bg-red-100 border-red-400' : bajStock ? 'bg-yellow-50 border-yellow-300' : 'bg-gray-50 border-gray-200'}`}>
                            <div className="flex justify-between items-center">
                              <div className="flex-1">
                                <div className="flex items-center gap-3">
                                  <h4 className="font-bold text-lg">{item.nombre}</h4>
                                  <Badge variant="default">{item.porciones_por_unidad} porciones/{item.unidad}</Badge>
                                  <button onClick={() => editarInventario(item)} className="text-blue-600 hover:text-blue-800">
                                    <Edit size={16} />
                                  </button>
                                  <button onClick={() => eliminarInventario(item.id)} className="text-red-600 hover:text-red-800">
                                    <Trash2 size={16} />
                                  </button>
                                </div>
                                <p className="text-sm text-gray-600">{formatearMoneda(item.precio_unitario)}/{item.unidad} • Mínimo: {item.stock_minimo} {item.unidad}</p>
                                {bajStock && (
                                  <p className={`text-sm font-bold mt-1 ${agotado ? 'text-red-600' : 'text-yellow-600'}`}>
                                    {agotado ? '❌ AGOTADO' : '⚠️ STOCK BAJO'}
                                  </p>
                                )}
                              </div>
                              <div className="flex items-center gap-3">
                                <input type="number" value={item.cantidad} onChange={(e) => actualizarInventario(item.id, e.target.value)} className="w-24 px-3 py-2 border-2 rounded-lg text-center font-bold" min="0" step="0.1" />
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

            {activeTab === 'reportes' && (
              <div>
                <h2 className={`text-2xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-800'}`}>Reportes y Estadísticas</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  <div className={`${darkMode ? 'bg-gray-700' : 'bg-white'} p-6 rounded-xl shadow-lg border-l-4 border-green-500`}>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-semibold text-gray-600">Ventas del Mes</p>
                        <p className="text-2xl font-bold text-gray-800">{formatearMoneda(stats.ventasMes)}</p>
                      </div>
                      <div className="bg-green-100 p-3 rounded-full">
                        <DollarSign size={24} className="text-green-600" />
                      </div>
                    </div>
                  </div>

                  <div className={`${darkMode ? 'bg-gray-700' : 'bg-white'} p-6 rounded-xl shadow-lg border-l-4 border-blue-500`}>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-semibold text-gray-600">Total Propinas</p>
                        <p className="text-2xl font-bold text-gray-800">{formatearMoneda(stats.totalPropinas)}</p>
                      </div>
                      <div className="bg-blue-100 p-3 rounded-full">
                        <Award size={24} className="text-blue-600" />
                      </div>
                    </div>
                  </div>

                  <div className={`${darkMode ? 'bg-gray-700' : 'bg-white'} p-6 rounded-xl shadow-lg border-l-4 border-orange-500`}>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-semibold text-gray-600">Gastos Nómina</p>
                        <p className="text-2xl font-bold text-gray-800">{formatearMoneda(stats.gastosMes)}</p>
                      </div>
                      <div className="bg-orange-100 p-3 rounded-full">
                        <Users size={24} className="text-orange-600" />
                      </div>
                    </div>
                  </div>

                  <div className={`${darkMode ? 'bg-gray-700' : 'bg-white'} p-6 rounded-xl shadow-lg border-l-4 border-purple-500`}>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-semibold text-gray-600">Total Pedidos</p>
                        <p className="text-2xl font-bold text-gray-800">{stats.pedidosTotal}</p>
                      </div>
                      <div className="bg-purple-100 p-3 rounded-full">
                        <ShoppingCart size={24} className="text-purple-600" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <div className={`${darkMode ? 'bg-gray-700' : 'bg-white'} p-6 rounded-xl shadow-lg`}>
                    <h3 className={`text-lg font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>Resumen Financiero</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span>Ingresos por Ventas:</span>
                        <span className="font-bold text-green-600">{formatearMoneda(stats.ventasMes)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Propinas Recibidas:</span>
                        <span className="font-bold text-blue-600">{formatearMoneda(stats.totalPropinas)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Gastos de Nómina:</span>
                        <span className="font-bold text-red-600">-{formatearMoneda(stats.gastosMes)}</span>
                      </div>
                      <div className="border-t pt-2 flex justify-between items-center font-bold text-lg">
                        <span>Utilidad Neta:</span>
                        <span className={`${stats.ventasMes + stats.totalPropinas - stats.gastosMes >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {formatearMoneda(stats.ventasMes + stats.totalPropinas - stats.gastosMes)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className={`${darkMode ? 'bg-gray-700' : 'bg-white'} p-6 rounded-xl shadow-lg`}>
                    <h3 className={`text-lg font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>Estado Actual</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span>Mesas Ocupadas:</span>
                        <Badge variant={stats.mesasOcupadas > 0 ? 'warning' : 'success'}>
                          {stats.mesasOcupadas} / {mesas.length}
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Items Bajo Stock:</span>
                        <Badge variant={stats.itemsBajoStock > 0 ? 'danger' : 'success'}>
                          {stats.itemsBajoStock}
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Valor Inventario:</span>
                        <span className="font-bold">{formatearMoneda(stats.inventarioValor)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Comandas Activas:</span>
                        <Badge variant={comandas.length > 0 ? 'warning' : 'success'}>
                          {comandas.length}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>

                <div className={`${darkMode ? 'bg-gray-700' : 'bg-white'} rounded-xl shadow-lg p-6`}>
                  <h3 className={`text-lg font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>Historial de Ventas</h3>
                  {ventas.length === 0 ? (
                    <Alert type="info">
                      <div className="text-center py-4">
                        <p>No hay ventas registradas</p>
                      </div>
                    </Alert>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className={`border-b ${darkMode ? 'border-gray-600' : 'border-gray-200'}`}>
                            <th className="text-left py-2">Mesa</th>
                            <th className="text-left py-2">Fecha</th>
                            <th className="text-left py-2">Subtotal</th>
                            <th className="text-left py-2">Propina</th>
                            <th className="text-left py-2">Total</th>
                            <th className="text-left py-2">Método Pago</th>
                          </tr>
                        </thead>
                        <tbody>
                          {ventas.slice().reverse().map(venta => (
                            <tr key={venta.id} className={`border-b ${darkMode ? 'border-gray-600' : 'border-gray-200'}`}>
                              <td className="py-3 font-semibold">Mesa {venta.numeroMesa}</td>
                              <td className="py-3 text-sm">{new Date(venta.fecha).toLocaleString('es-CO')}</td>
                              <td className="py-3">{formatearMoneda(venta.subtotal)}</td>
                              <td className="py-3">{formatearMoneda(venta.montoPropina)} ({venta.propina}%)</td>
                              <td className="py-3 font-bold text-orange-600">{formatearMoneda(venta.total)}</td>
                              <td className="py-3">
                                <Badge variant="info">{venta.metodoPago}</Badge>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal para tomar pedido */}
      <Modal isOpen={modalPedido.isOpen} onClose={() => setModalPedido({ isOpen: false, mesa: null, carrito: [] })} title={`Tomar Pedido - Mesa ${modalPedido.mesa?.numero}`} size="xl">
        {modalPedido.mesa && (
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-bold mb-3 text-lg">Menú del Día ({dias[diaActual]})</h4>
              <div className="mb-4">
                <input
                  type="text"
                  placeholder="Buscar platos..."
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-orange-500 focus:outline-none"
                />
              </div>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {platosFiltrados.map(plato => {
                  const disponibles = calcularPlatosDisponibles(plato);
                  const sinStock = disponibles === 0;
                  return (
                    <div key={plato.id} className={`p-3 rounded-lg border-2 ${sinStock ? 'border-red-300 bg-red-50' : 'border-gray-200 bg-white'} flex justify-between items-center`}>
                      <div>
                        <p className="font-semibold">{plato.nombre}</p>
                        <p className="text-orange-600 font-bold">{formatearMoneda(plato.precio)}</p>
                        {plato.receta && plato.receta.length > 0 && (
                          <p className={`text-xs ${sinStock ? 'text-red-600' : 'text-gray-600'}`}>
                            {sinStock ? '❌ Sin stock' : `✅ ${disponibles} disponibles`}
                          </p>
                        )}
                      </div>
                      <Button onClick={() => agregarAlCarrito(plato)} disabled={sinStock} size="sm">
                        <Plus size={16} /> Agregar
                      </Button>
                    </div>
                  );
                })}
              </div>
            </div>

            <div>
              <h4 className="font-bold mb-3 text-lg">Carrito</h4>
              {modalPedido.carrito.length === 0 ? (
                <Alert type="info">
                  <p>El carrito está vacío</p>
                </Alert>
              ) : (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {modalPedido.carrito.map(item => (
                    <div key={item.id_carrito} className="p-3 bg-orange-50 rounded-lg border-2 border-orange-200">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-semibold">{item.nombre}</p>
                          <p className="text-orange-600 font-bold">{formatearMoneda(item.precio * item.cantidad)}</p>
                        </div>
                        <button onClick={() => removerDelCarrito(item.id_carrito)} className="text-red-600">
                          <Trash2 size={16} />
                        </button>
                      </div>
                      <div className="flex items-center gap-2 mb-2">
                        <button onClick={() => actualizarCantidad(item.id_carrito, -1)} className="bg-gray-200 p-1 rounded">
                          <Minus size={14} />
                        </button>
                        <span className="font-bold mx-2">{item.cantidad}</span>
                        <button onClick={() => actualizarCantidad(item.id_carrito, 1)} className="bg-gray-200 p-1 rounded">
                          <Plus size={14} />
                        </button>
                      </div>
                      <TextArea
                        label="Notas especiales:"
                        value={item.notas}
                        onChange={(e) => actualizarNotas(item.id_carrito, e.target.value)}
                        placeholder="Sin cebolla, bien cocido, etc."
                        rows={1}
                      />
                    </div>
                  ))}
                </div>
              )}
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-semibold">Subtotal:</span>
                  <span className="font-bold">{formatearMoneda(calcularTotal())}</span>
                </div>
                <div className="flex justify-between items-center text-lg">
                  <span className="font-bold">Total:</span>
                  <span className="font-bold text-orange-600 text-xl">{formatearMoneda(calcularTotal())}</span>
                </div>
                <Button onClick={confirmarPedido} variant="success" className="w-full mt-4" disabled={modalPedido.carrito.length === 0}>
                  <Check size={20} /> Confirmar Pedido
                </Button>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Modal para cerrar mesa */}
      <Modal isOpen={modalCerrarMesa.isOpen} onClose={() => setModalCerrarMesa({ isOpen: false, mesa: null, propina: 10, metodoPago: 'efectivo', dividirEntre: 1 })} title={`Cerrar Mesa ${modalCerrarMesa.mesa?.numero}`}>
        {modalCerrarMesa.mesa && (
          <div>
            <div className="mb-6">
              <h4 className="font-bold mb-3">Resumen del Pedido</h4>
              <div className="bg-gray-50 p-4 rounded-lg max-h-48 overflow-y-auto">
                {modalCerrarMesa.mesa.pedidos.map((pedido, index) => (
                  <div key={index} className="flex justify-between items-center py-2 border-b border-gray-200">
                    <div>
                      <span className="font-semibold">{pedido.cantidad}x {pedido.nombre}</span>
                      {pedido.notas && <p className="text-xs text-gray-600">Nota: {pedido.notas}</p>}
                    </div>
                    <span className="font-bold">{formatearMoneda(pedido.precio * pedido.cantidad)}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div>
                <Input
                  label="Propina (%)"
                  type="number"
                  value={modalCerrarMesa.propina}
                  onChange={(e) => setModalCerrarMesa(prev => ({ ...prev, propina: parseInt(e.target.value) || 0 }))}
                  min="0"
                  max="50"
                />
              </div>
              <div>
                <Select
                  label="Método de Pago"
                  value={modalCerrarMesa.metodoPago}
                  onChange={(e) => setModalCerrarMesa(prev => ({ ...prev, metodoPago: e.target.value }))}
                  options={[
                    { value: 'efectivo', label: 'Efectivo' },
                    { value: 'tarjeta', label: 'Tarjeta' },
                    { value: 'transferencia', label: 'Transferencia' }
                  ]}
                />
              </div>
            </div>

            <div className="bg-orange-50 p-4 rounded-lg mb-6">
              <div className="flex justify-between mb-2">
                <span>Subtotal:</span>
                <span className="font-bold">{formatearMoneda(modalCerrarMesa.mesa.total)}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span>Propina ({modalCerrarMesa.propina}%):</span>
                <span className="font-bold">{formatearMoneda(modalCerrarMesa.mesa.total * (modalCerrarMesa.propina / 100))}</span>
              </div>
              <div className="flex justify-between text-lg font-bold border-t pt-2">
                <span>TOTAL:</span>
                <span className="text-orange-600">{formatearMoneda(modalCerrarMesa.mesa.total * (1 + modalCerrarMesa.propina / 100))}</span>
              </div>
            </div>

            <div className="flex gap-3 justify-end">
              <Button onClick={imprimirRecibo} variant="secondary">
                <Printer size={16} /> Imprimir
              </Button>
              <Button onClick={compartirWhatsApp} variant="info">
                <Share2 size={16} /> Compartir
              </Button>
              <Button onClick={cerrarMesa} variant="success">
                <Check size={16} /> Cobrar y Cerrar
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Modal para agregar/editar personal */}
      <Modal isOpen={modalPersonal.isOpen} onClose={() => setModalPersonal({ isOpen: false })} title="Agregar Personal">
        <form onSubmit={agregarPersonal}>
          <Input
            label="Nombre Completo"
            value={formPersonal.nombre}
            onChange={(e) => setFormPersonal(prev => ({ ...prev, nombre: e.target.value }))}
            required
          />
          <Select
            label="Cargo"
            value={formPersonal.cargo}
            onChange={(e) => setFormPersonal(prev => ({ ...prev, cargo: e.target.value }))}
            options={[
              { value: 'Mesero', label: 'Mesero' },
              { value: 'Cocinero', label: 'Cocinero' },
              { value: 'Barman', label: 'Barman' },
              { value: 'Cajero', label: 'Cajero' },
              { value: 'Administrador', label: 'Administrador' }
            ]}
            required
          />
          <Input
            label="Salario Mensual"
            type="number"
            value={formPersonal.salario}
            onChange={(e) => setFormPersonal(prev => ({ ...prev, salario: e.target.value }))}
            required
          />
          <Input
            label="Teléfono"
            type="tel"
            value={formPersonal.telefono}
            onChange={(e) => setFormPersonal(prev => ({ ...prev, telefono: e.target.value }))}
            required
          />
          <div className="flex gap-3 justify-end mt-6">
            <Button type="button" onClick={() => setModalPersonal({ isOpen: false })} variant="secondary">
              Cancelar
            </Button>
            <Button type="submit" variant="primary">
              <Save size={16} /> Guardar
            </Button>
          </div>
        </form>
      </Modal>

      {/* Modal para agregar/editar plato */}
      <Modal isOpen={modalPlato.isOpen} onClose={() => setModalPlato({ isOpen: false, editando: null })} title={modalPlato.editando ? 'Editar Plato' : 'Agregar Plato'}>
        <form onSubmit={agregarPlato}>
          <Input
            label="Nombre del Plato"
            value={formPlato.nombre}
            onChange={(e) => setFormPlato(prev => ({ ...prev, nombre: e.target.value }))}
            required
          />
          <Input
            label="Precio"
            type="number"
            value={formPlato.precio}
            onChange={(e) => setFormPlato(prev => ({ ...prev, precio: e.target.value }))}
            required
          />
          <Select
            label="Día de la Semana"
            value={formPlato.dia_semana}
            onChange={(e) => setFormPlato(prev => ({ ...prev, dia_semana: e.target.value }))}
            options={dias.map((dia, index) => ({ value: index, label: dia }))}
            required
          />
          <Select
            label="Estación"
            value={formPlato.estacion}
            onChange={(e) => setFormPlato(prev => ({ ...prev, estacion: e.target.value }))}
            options={[
              { value: 'cocina', label: 'Cocina' },
              { value: 'bar', label: 'Bar' }
            ]}
            required
          />
          <div className="flex gap-3 justify-end mt-6">
            <Button type="button" onClick={() => setModalPlato({ isOpen: false, editando: null })} variant="secondary">
              Cancelar
            </Button>
            <Button type="submit" variant="primary">
              <Save size={16} /> {modalPlato.editando ? 'Actualizar' : 'Guardar'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Modal para receta */}
      <Modal isOpen={modalReceta.isOpen} onClose={() => setModalReceta({ isOpen: false, plato: null, recetaTemp: [] })} title={`Receta: ${modalReceta.plato?.nombre}`} size="lg">
        {modalReceta.plato && (
          <div>
            <div className="mb-6">
              <h4 className="font-bold mb-3">Ingredientes Actuales</h4>
              {modalReceta.recetaTemp.length === 0 ? (
                <Alert type="info">
                  <p>No hay ingredientes en la receta</p>
                </Alert>
              ) : (
                <div className="space-y-2">
                  {modalReceta.recetaTemp.map(ingrediente => (
                    <div key={ingrediente.ingrediente_id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-semibold">{ingrediente.nombre}</p>
                        <p className="text-sm text-gray-600">Porciones por plato: {ingrediente.porciones}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <input
                          type="number"
                          value={ingrediente.porciones}
                          onChange={(e) => actualizarPorcionesReceta(ingrediente.ingrediente_id, e.target.value)}
                          className="w-20 px-2 py-1 border rounded"
                          min="0"
                          step="0.1"
                        />
                        <button onClick={() => eliminarIngredienteReceta(ingrediente.ingrediente_id)} className="text-red-600">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="mb-6">
              <h4 className="font-bold mb-3">Agregar Ingrediente</h4>
              <Select
                label="Seleccionar Ingrediente"
                value=""
                onChange={(e) => agregarIngredienteReceta(e.target.value)}
                options={inventario.map(item => ({ value: item.id, label: `${item.nombre} (${item.cantidad} ${item.unidad} disponibles)` }))}
              />
            </div>

            <div className="flex gap-3 justify-end">
              <Button onClick={() => setModalReceta({ isOpen: false, plato: null, recetaTemp: [] })} variant="secondary">
                Cancelar
              </Button>
              <Button onClick={guardarReceta} variant="primary">
                <Save size={16} /> Guardar Receta
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Modal para inventario */}
      <Modal isOpen={modalInventario.isOpen} onClose={() => setModalInventario({ isOpen: false, editando: null })} title={modalInventario.editando ? 'Editar Inventario' : 'Agregar al Inventario'}>
        <form onSubmit={agregarInventario}>
          <Input
            label="Nombre del Producto"
            value={formInventario.nombre}
            onChange={(e) => setFormInventario(prev => ({ ...prev, nombre: e.target.value }))}
            required
          />
          <Select
            label="Categoría"
            value={formInventario.categoria}
            onChange={(e) => setFormInventario(prev => ({ ...prev, categoria: e.target.value }))}
            options={[
              { value: 'proteina', label: 'Proteína' },
              { value: 'acompañamiento', label: 'Acompañamiento' },
              { value: 'bebida', label: 'Bebida' }
            ]}
            required
          />
          <div className="grid md:grid-cols-2 gap-4">
            <Input
              label="Cantidad"
              type="number"
              value={formInventario.cantidad}
              onChange={(e) => setFormInventario(prev => ({ ...prev, cantidad: e.target.value }))}
              required
              step="0.1"
            />
            <Select
              label="Unidad"
              value={formInventario.unidad}
              onChange={(e) => setFormInventario(prev => ({ ...prev, unidad: e.target.value }))}
              options={[
                { value: 'kg', label: 'Kilogramos' },
                { value: 'libras', label: 'Libras' },
                { value: 'unidades', label: 'Unidades' },
                { value: 'litros', label: 'Litros' }
              ]}
              required
            />
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <Input
              label="Precio Unitario"
              type="number"
              value={formInventario.precio_unitario}
              onChange={(e) => setFormInventario(prev => ({ ...prev, precio_unitario: e.target.value }))}
              required
            />
            <Input
              label="Stock Mínimo"
              type="number"
              value={formInventario.stock_minimo}
              onChange={(e) => setFormInventario(prev => ({ ...prev, stock_minimo: e.target.value }))}
              required
            />
          </div>
          <Input
            label="Porciones por Unidad"
            type="number"
            value={formInventario.porciones_por_unidad}
            onChange={(e) => setFormInventario(prev => ({ ...prev, porciones_por_unidad: e.target.value }))}
            required
            min="1"
          />
          <div className="flex gap-3 justify-end mt-6">
            <Button type="button" onClick={() => setModalInventario({ isOpen: false, editando: null })} variant="secondary">
              Cancelar
            </Button>
            <Button type="submit" variant="primary">
              <Save size={16} /> {modalInventario.editando ? 'Actualizar' : 'Guardar'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Modal para agregar mesa */}
      <Modal isOpen={modalMesa.isOpen} onClose={() => setModalMesa({ isOpen: false })} title="Agregar Mesa">
        <form onSubmit={agregarMesa}>
          <Input
            label="Número de Mesa"
            type="number"
            value={formMesa.numero}
            onChange={(e) => setFormMesa(prev => ({ ...prev, numero: e.target.value }))}
            required
            min="1"
          />
          <Select
            label="Capacidad"
            value={formMesa.capacidad}
            onChange={(e) => setFormMesa(prev => ({ ...prev, capacidad: e.target.value }))}
            options={[
              { value: 2, label: '2 personas' },
              { value: 4, label: '4 personas' },
              { value: 6, label: '6 personas' },
              { value: 8, label: '8 personas' }
            ]}
            required
          />
          <div className="flex gap-3 justify-end mt-6">
            <Button type="button" onClick={() => setModalMesa({ isOpen: false })} variant="secondary">
              Cancelar
            </Button>
            <Button type="submit" variant="primary">
              <Save size={16} /> Guardar
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default RestaurantApp;