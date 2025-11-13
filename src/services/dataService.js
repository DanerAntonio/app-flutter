import { supabase } from '../lib/supabase';

const STORAGE_KEYS = {
  mesas: 'mesas',
  inventario: 'inventario',
  platos: 'platos',
  personal: 'personal',
  ventas: 'ventas'
};

// Verificar si Supabase está configurado
const isSupabaseConfigured = () => {
  return !!(import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY);
};

// Cargar datos (intenta Supabase, fallback a localStorage)
export const loadData = async (key, initializer) => {
  try {
    // Primero intenta localStorage
    const stored = localStorage.getItem(STORAGE_KEYS[key]);
    const localData = stored ? JSON.parse(stored) : initializer();
    
    // Si Supabase está configurado, intenta cargar de allí
    if (isSupabaseConfigured()) {
      const { data, error } = await supabase
        .from(key)
        .select('*');
      
      if (!error && data && data.length > 0) {
        // Guardar en localStorage como cache
        localStorage.setItem(STORAGE_KEYS[key], JSON.stringify(data));
        return data;
      }
    }
    
    return localData;
  } catch (error) {
    console.error(`Error loading ${key}:`, error);
    // Fallback a localStorage
    const stored = localStorage.getItem(STORAGE_KEYS[key]);
    return stored ? JSON.parse(stored) : initializer();
  }
};

// Guardar datos (intenta Supabase, fallback a localStorage)
export const saveData = async (key, data) => {
  try {
    // Siempre guardar en localStorage primero (cache)
    localStorage.setItem(STORAGE_KEYS[key], JSON.stringify(data));
    
    // Si Supabase está configurado, sincronizar
    if (isSupabaseConfigured()) {
      // Aquí puedes implementar lógica más compleja si necesitas
      console.log(`Datos de ${key} sincronizados con localStorage`);
    }
  } catch (error) {
    console.error(`Error saving ${key}:`, error);
  }
};

// Insertar en Supabase
export const insertToSupabase = async (table, data) => {
  if (!isSupabaseConfigured()) {
    console.log('Supabase no configurado, usando solo localStorage');
    return null;
  }
  
  try {
    const { data: result, error } = await supabase
      .from(table)
      .insert([data])
      .select()
      .single();
    
    if (error) throw error;
    return result;
  } catch (error) {
    console.error(`Error inserting into ${table}:`, error);
    return null;
  }
};

// Actualizar en Supabase
export const updateInSupabase = async (table, id, updates) => {
  if (!isSupabaseConfigured()) {
    return null;
  }
  
  try {
    const { data: result, error } = await supabase
      .from(table)
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return result;
  } catch (error) {
    console.error(`Error updating ${table}:`, error);
    return null;
  }
};

// Eliminar de Supabase
export const deleteFromSupabase = async (table, id) => {
  if (!isSupabaseConfigured()) {
    return false;
  }
  
  try {
    const { error } = await supabase
      .from(table)
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return true;
  } catch (error) {
    console.error(`Error deleting from ${table}:`, error);
    return false;
  }
};