import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export const useSupabaseData = (tableName) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Cargar datos iniciales
  const fetchData = async () => {
    try {
      setLoading(true);
      const { data: result, error: fetchError } = await supabase
        .from(tableName)
        .select('*')
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;
      setData(result || []);
    } catch (err) {
      console.error(`Error loading ${tableName}:`, err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Insertar nuevo registro
  const insert = async (newData) => {
    try {
      const { data: result, error: insertError } = await supabase
        .from(tableName)
        .insert([newData])
        .select()
        .single();

      if (insertError) throw insertError;
      setData([result, ...data]);
      return result;
    } catch (err) {
      console.error(`Error inserting into ${tableName}:`, err);
      throw err;
    }
  };

  // Actualizar registro
  const update = async (id, updates) => {
    try {
      const { data: result, error: updateError } = await supabase
        .from(tableName)
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (updateError) throw updateError;
      setData(data.map(item => item.id === id ? result : item));
      return result;
    } catch (err) {
      console.error(`Error updating ${tableName}:`, err);
      throw err;
    }
  };

  // Eliminar registro
  const remove = async (id) => {
    try {
      const { error: deleteError } = await supabase
        .from(tableName)
        .delete()
        .eq('id', id);

      if (deleteError) throw deleteError;
      setData(data.filter(item => item.id !== id));
      return true;
    } catch (err) {
      console.error(`Error deleting from ${tableName}:`, err);
      throw err;
    }
  };

  useEffect(() => {
    fetchData();

    // Suscripción en tiempo real
    const subscription = supabase
      .channel(`${tableName}_changes`)
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: tableName },
        () => fetchData()
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [tableName]);

  return { data, loading, error, fetchData, insert, update, remove };
};