import React, { createContext, useState, useEffect } from 'react';
import { fetchConfig } from '../services/api';
export const DataContext = createContext();
export const DataProvider = ({ children }) => {
  const [Config, setConfig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [Session, setSession] = useState(null);
  const [Menu, setMenu] = useState([]);
  useEffect(() => {
    const storedSession = sessionStorage.getItem('admin');
    if (storedSession) {
      setSession(JSON.parse(storedSession));
    }
  }, []);  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchConfig();
        const jsonData = await response.json();
        if(jsonData.status){
          setConfig(jsonData);
        }else{}
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <DataContext.Provider value={{ Config, loading, Session, Menu }}>
      {children}
    </DataContext.Provider>
  );
};
