'use client'

import { store } from "@/redux/store"
import React from "react"
import { Provider as ReactReduxProvider } from "react-redux"

// persist
import { persistStore } from "redux-persist"
import { PersistGate } from "redux-persist/integration/react"

import { LinearProgress } from "@mui/material"

export default function ReduxProvider({children}:{children:React.ReactNode}){

    // add persist store here
    let reduxPersister = persistStore(store) ;
    
    return(
        <ReactReduxProvider store={store}>
            {/* add PersisteGate here */}
            <PersistGate loading={<LinearProgress></LinearProgress>} persistor={reduxPersister}>
              {children}
            </PersistGate>   
        </ReactReduxProvider>
    )

}