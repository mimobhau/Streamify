import React from 'react'
import { useThemeStore } from '../store/useThemeStore'
import { PaletteIcon } from 'lucide-react'
import { THEMES } from '../constants'

const ThemeSelector = () => {
  const {theme, setTheme} = useThemeStore()

  return (
    <div className='dropdown dropdown-end'>
      {/* DROPDOWN TRIGGER */}
      <button tabIndex={0} className='btn btn-ghost'>
        {/* icon of the dropdown-button - "paletteIcon" */}
        <PaletteIcon className='size-5' />
      </button>

      {/* DROPDOWN LIST */}
      <div
        tabIndex={0}
        className='dropdown-content mt-2 p-1 shadow-2xl bg-base-200 backdrop-blur-lg rounded-2xl w-56 border border-base-content/10 max-h-80 overflow-y-auto'
      >

        <div className='space-y-1'>
          {THEMES.map((themeOption) => (
          // selected option(theme) is highlighted, while the unselected options are highlighted when we hover over them
            <button key={themeOption.name}
              className={`w-full px-4 py-3 rounded-xl flex items-center gap-3 transiition-colors
                ${
                  theme === themeOption.name
                    ? "bg-primary/10 text-primary"
                    : "hover:bg-base-content/5"
                }`}
                // sets the theme to the selected one
                onClick={() => setTheme(themeOption.name)}
            >
              {/* the items in the drop-down list;
                  --> "PaletteIcon" icon
                  --> Theme name
                  --> Theme Preview colors */}
              <PaletteIcon className='size-4' />
              <span className='text-sm font-medium'>
                {themeOption.name}
              </span>
              {/* THEME PREVIEW COLORS */}
              <div className='ml-auto flex gap-1'>
                {themeOption.colors.map((color, i) => (
                  <span
                    key={i}
                    className='size-2 rounded-full'
                    style={{backgroundColor: color}}
                  ></span>
                ))}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default ThemeSelector