import React from 'react'
import { selectedOptionsReducer } from '../reducers/selectedoptions'
import { defaultOptions } from '../utils/data'
import { createContext, useContext } from 'react';

const SelectedOptionsContext = createContext<any>({});

export function useSelectedOptions(){
    console.log(useContext(SelectedOptionsContext))
    return useContext(SelectedOptionsContext)
}

export default function SelectedOptionsProvider({ children }: { children: React.ReactNode }) {
    console.log(children)

    const [selectedOptions, dispatch] = React.useReducer(selectedOptionsReducer, defaultOptions)
    return (
        <SelectedOptionsContext.Provider value={{
            selectedOptions,
            dispatch
        }}>
            { children }
        </SelectedOptionsContext.Provider>
    )
}
