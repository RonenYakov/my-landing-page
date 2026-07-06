import { createContext, useContext, useState } from "react";
/* create contect i a global variable that can be accessed by any component in the application and use context is how to get the value from a component */
const ThemeContext = createContext<{ theme: string, setTheme: (t: string) => void }>({ theme: 'light', setTheme: () => {} })
/* the theme provider wraps all the componenets and each one will be a chiled of this the context will pass the current value */
export function ThemeProvider({ children }: { children: React.ReactNode }) {

    const [theme, setTheme] = useState('light')
    return (
        <ThemeContext.Provider value={{ theme, setTheme }}>
            {children}
        </ThemeContext.Provider> /* the provider is what allows each component to connect and add or recive data from the app */
    )

}
export function useTheme() {
    return useContext(ThemeContext) /* this is how each component will recive the value from the provider */
}
