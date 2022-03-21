import React, {
  createContext, useState, useEffect, CSSProperties, useMemo,
} from 'react';
import { setStorageItem, getStorageItem } from '@/app/Features/LocalStorage/LocalStorage';
import { logToConsole } from '@/utils/logging';

// TODO - see about setting this to something other than null for the default Value
// @ts-ignore
const ThemeContext = createContext<TypeThemeContext>();

interface TypeThemeContext {
  styles: MyCustomCSS
  changeTheme: any
  theme: string
}

export interface MyCustomCSS extends CSSProperties {
  '--color-primary': string
  '--color-primary-dark25': string
  '--color-secondary-light87': string
  '--color-secondary-light50': string
  '--color-secondary-light25': string
  '--color-secondary': string
  '--color-secondary-dark25': string
  '--color-CTA': string
  '--color-CTA-light25': string
  '--color-CTA-dark25': string
  '--color-background': string
  '--color-light': string
  '--color-text-darkbackground': string
  '--color-text-lightbackground': string
}

const colorVariables = (lightMode: boolean) => ({
  '--color-primary-light50': (lightMode) ? '#C5DDDD' : '#7990B4',
  '--color-primary-light25': (lightMode) ? '#A8CCCD' : '#475C7E',
  '--color-primary': (lightMode) ? '#8BBABC' : '#212B3B',
  '--color-primary-dark25': (lightMode) ? '#59999B' : '#19202C',

  // dark mode color needs updating. This is not the right color.
  '--color-secondary-light87': (lightMode) ? '#DEE3EC' : '#313945',
  '--color-secondary-light75': (lightMode) ? '#BCC7D9' : '#E2EEEE',
  '--color-secondary-light50': (lightMode) ? '#7990B4' : '#C5DDDD',
  '--color-secondary-light25': (lightMode) ? '#475C7E' : '#A8CCCD',
  '--color-secondary': (lightMode) ? '#212B3B' : '#8BBABC',
  '--color-secondary-dark25': (lightMode) ? '#19202C' : '#59999B',
  '--color-CTA-light25': (lightMode) ? '#FFD147' : '#FFD147',
  '--color-CTA': (lightMode) ? '#FFC20A' : '#FFC20A',
  '--color-CTA-dark25': (lightMode) ? '#C79500' : '#C79500',
  '--color-background': (lightMode) ? '#E7EAEE' : '#000000',
  '--color-background-light': (lightMode) ? '#F3F5F7' : '#242526',
  '--color-light': (lightMode) ? '#F3F5F7' : '#000',
  '--color-text-darkbackground': (lightMode) ? 'white' : 'black',
  '--color-text-lightbackground': (lightMode) ? 'black' : '#BFBFBF',
  '--color-boxshadow-1': (lightMode) ? 'rgba(154,160,185,.05)' : 'rgba(154,160,185,.00)',
  '--color-boxshadow-2': (lightMode) ? 'rgba(166,173,201,.2)' : 'rgba(166,173,201,.0)',

  // Tailwinds 600
  '--color-red': (lightMode) ? '#DC2626' : '#EF4444',
  '--color-green': (lightMode) ? '#059669' : '#059669',
  '--opacity-pill': (lightMode) ? '.95' : '.8',

  '--chart-metric1-color': (lightMode) ? '#59999B' : '#59999B', // color primary -25% / 0%
  '--chart-metric2-color': (lightMode) ? '#C79500' : '#FFD147', // CTA color (Yellow)
  '--chart-metric3-color': (lightMode) ? '#212B3B' : '#9BABC7', // color secondary 0% / 62.50%

  // tailwinds CSS colors
  // https://tailwindcss.com/docs/customizing-colors
  // '--chart-metric1-color' :  (lightMode) ? '#4F46E5' :  '#818CF8', // Purple
  // '--chart-metric2-color' :  (lightMode) ?  '#FCD34D' : '#FBBF24', // Yellow
  // '--chart-metric3-color' :  (lightMode) ? '#059669' : '#34D399', // Green

  '--chart-metric4-color': (lightMode) ? '#3B82F6' : '#60A5FA', // Blue
  '--chart-metric5-color': (lightMode) ? '#D97706' : '#FBBF24', // Yellow
  '--chart-metric6-color': (lightMode) ? '#DC2626' : '#F87171', // Red
  '--chart-metric7-color': (lightMode) ? '#7C3AED' : '#A78BFA', // Purple
  '--chart-metric8-color': (lightMode) ? '#059669' : '#34D399', // Green
});

const ThemeEngine = ({ children }: any) => {
  const [theme, updateTheme] = useState('lightMode');

  const [styles, setStyles] = useState<MyCustomCSS>(() => colorVariables(true));

  useEffect(() => {
    const localDisplay = getStorageItem('displayMode');
    const lightMode = (localDisplay !== undefined) ? localDisplay === 'lightMode' : true;
    const lightModeString = (localDisplay !== undefined) ? localDisplay : 'lightMode';
    setStyles(colorVariables(lightMode));
    updateTheme(lightModeString);
  }, []);

  const changeTheme = () => {
    updateTheme((prevTheme) => {
      const newTheme = (prevTheme === 'lightMode') ? 'darkMode' : 'lightMode';
      logToConsole('debug', newTheme);
      setStyles(colorVariables(newTheme === 'lightMode'));
      setStorageItem('displayMode', newTheme);
      return newTheme;
    });
  };

  const themeValues = useMemo(() => ({ styles, changeTheme, theme }), []);
  return (
    <ThemeContext.Provider value={themeValues}>
      {children}
    </ThemeContext.Provider>
  );
};

const useThemeProvidor = () => {
  const context = React.useContext(ThemeContext);
  if (context === undefined) {
    throw new Error(
      'useThemeProvidor must be used within a GlobalContextProvider',
    );
  }
  return context;
};

export { ThemeEngine, useThemeProvidor };
