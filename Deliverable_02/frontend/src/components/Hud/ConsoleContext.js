import { createContext, useContext } from 'react';

export const ConsoleContext = createContext({ open: false, setOpen: () => {} });
export const useConsole = () => useContext(ConsoleContext);
