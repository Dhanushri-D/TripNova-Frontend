import React, { createContext, useContext, useState, useEffect } from 'react';
import { packagesAPI } from '../services/api';

const PackageContext = createContext();

export const PackageProvider = ({ children }) => {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);

  const normalize = (p) => ({ ...p, id: p._id || p.id });

  const fetchAll = async () => {
    try {
      const res = await packagesAPI.getAll();
      setPackages(res.data.map(normalize));
    } catch (err) {
      console.error('Failed to load packages', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAll(); }, []);  // eslint-disable-line react-hooks/exhaustive-deps

  const addPackage = async (pkg) => {
    const res = await packagesAPI.create(pkg);
    const newPkg = normalize(res.data);
    setPackages(prev => [...prev, newPkg]);
    return newPkg;
  };

  const updatePackage = async (id, updates) => {
    const res = await packagesAPI.update(id, updates);
    const updated = normalize(res.data);
    setPackages(prev => prev.map(p => p.id === id ? updated : p));
  };

  const deletePackage = async (id) => {
    await packagesAPI.remove(id);
    setPackages(prev => prev.filter(p => p.id !== id));
  };

  const getPackageById = (id) => packages.find(p => p.id === id || p._id === id);

  return (
    <PackageContext.Provider value={{ packages, loading, addPackage, updatePackage, deletePackage, getPackageById, refresh: fetchAll }}>
      {children}
    </PackageContext.Provider>
  );
};

export const usePackages = () => useContext(PackageContext);
export default PackageContext;
