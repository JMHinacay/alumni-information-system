import { createContext } from "react";

export const AccountContext = createContext({});

export const AccountProvider = AccountContext.Provider;
export const AccountConsumer = AccountContext.Consumer;
