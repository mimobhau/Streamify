import { create } from "zustand"

export const useThemeStore = create((set) => ({
    theme: localStorage.getItem("streamify-theme") || "coffee",
    // this initialises the state with the value saved in the browser's 'localStorage' under the key "streamify-theme"
    // if nothing is saved yet, it falls back to "coffee" as the 'default theme'
    setTheme: (theme) => {
        localStorage.setItem("streamify-theme", theme)
        // stores the 'streamify-theme' with 'theme'
        set({theme})
    }
}))