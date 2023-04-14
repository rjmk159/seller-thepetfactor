import { getCurrentStore } from '@/utils/auth-utils';
import React, { FC, useMemo } from 'react';

export interface State {
  currentStore: any;
}

const initialState = {
  currentStore: getCurrentStore()?.storeDetails || {},
};

type Action = {
  type: 'SET_STORE';
  payload: {};
};

export const StoreContext = React.createContext<State | any>(initialState);

StoreContext.displayName = 'storeConfig';

function uiReducer(state: State, action: Action) {
  switch (action.type) {
    case 'SET_STORE': {
      return {
        ...state,
        currentStore: action.payload,
      };
    }
  }
}

export const StoreProvider: FC = (props) => {
  const [state, dispatch] = React.useReducer(uiReducer, initialState);

  const setCurrentStore = (payload: any) =>
    dispatch({ type: 'SET_STORE', payload });

  const value = useMemo(
    () => ({
      ...state,
      setCurrentStore,
    }),
    [state]
  );

  return <StoreContext.Provider value={value} {...props} />;
};

export const useStore = () => {
  const context = React.useContext(StoreContext);
  if (context === undefined) {
    throw new Error(`useUI must be used within a StoreProvider`);
  }
  return context;
};

