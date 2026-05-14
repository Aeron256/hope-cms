import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { supabase } from '../lib/supabaseClient'; 
import { useAuth } from './AuthContext';       

export interface RightsMatrix {
  CUST_VIEW: boolean;
  CUST_ADD: boolean;
  CUST_EDIT: boolean;
  CUST_DEL: boolean;
  SALES_VIEW: boolean;
  SD_VIEW: boolean;
  PROD_VIEW: boolean;
  PRICE_VIEW: boolean;
  ADM_USER: boolean;
}

interface UserRightsContextType {
  rights: RightsMatrix;
  loadingRights: boolean;
}

// Fixed interface matching our new View output format
interface DbRightRow {
  right_code: string;
  is_enabled: boolean | number | string;
}

interface UserRightsProviderProps {
  children: ReactNode;
}

const UserRightsContext = createContext<UserRightsContextType | null>(null);

const defaultRights: RightsMatrix = {
  CUST_VIEW: false,
  CUST_ADD: false,
  CUST_EDIT: false,
  CUST_DEL: false,
  SALES_VIEW: false,
  SD_VIEW: false,
  PROD_VIEW: false,
  PRICE_VIEW: false,
  ADM_USER: false,
};

export const UserRightsProvider: React.FC<UserRightsProviderProps> = ({ children }) => {
  const [rights, setRights] = useState<RightsMatrix>(defaultRights);
  const [loadingRights, setLoadingRights] = useState<boolean>(true);
  const { currentUser } = useAuth(); 

  useEffect(() => {
    const fetchUserRights = async () => {
      if (!currentUser) {
        setRights(defaultRights);
        setLoadingRights(false);
        return;
      }

      try {
        setLoadingRights(true);
        console.log("Fetching rights for current authenticated UUID:", currentUser.id);

        // Target the unified view instead of the raw junction table
        const { data, error } = await supabase
          .from('vw_user_permissions')
          .select('right_code, is_enabled')
          .eq('user_id', currentUser.id);

        if (error) throw error;

        console.log('Raw data received from View:', data);

        if (data && data.length > 0) {
          const rightsMap: Partial<RightsMatrix> = {};
          
          (data as DbRightRow[]).forEach((item) => {
            if (item.right_code in defaultRights) {
              // Gracefully handle raw boolean type OR numeric flags (1/0)
              rightsMap[item.right_code as keyof RightsMatrix] = 
                item.is_enabled === true || Number(item.is_enabled) === 1 || item.is_enabled === 'true';
            }
          });

          setRights({
            ...defaultRights,
            ...rightsMap,
          });
        } else {
          console.warn("⚠️ No permissions rows mapped in DB for this user UUID yet.");
          setRights(defaultRights);
        }
      } catch (err: any) {
        console.error('Error loading user rights context:', err.message || err);
      } finally {
        setLoadingRights(false);
      }
    };

    fetchUserRights();
  }, [currentUser]);

  return (
    <UserRightsContext.Provider value={{ rights, loadingRights }}>
      {children}
    </UserRightsContext.Provider>
  );
};

export const useRights = (): UserRightsContextType => {
  const context = useContext(UserRightsContext);
  if (!context) {
    throw new Error('useRights must be used within a UserRightsProvider');
  }
  return context;
};