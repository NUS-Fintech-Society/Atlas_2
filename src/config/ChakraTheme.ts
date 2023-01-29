import { extendTheme, type ThemeConfig } from '@chakra-ui/react'

export const theme: ThemeConfig = extendTheme(
  {
    colors: {
      light: {
        primary: {
          primary: '#FFFFFF',
          onPrimary: '#000000',
          primaryContainer: '#FFFFFF',
          onPrimaryContainer: '#000000',
        },
        secondary: {
          primary: '#4285F4',
          onPrimary: '#000000',
          primaryContainer: '#D9E0EA',
          onPrimaryContainer: '#000000',
        },
        tertiary: {
          primary: '#FF0000',
          onPrimary: '#000000',
          primaryContainer: '#FF0000',
          onPrimaryContainer: '#000000',
        },
      },
      dark: {
        primary: {
          primary: '#000000',
          onPrimary: '#FFFFFF',
          primaryContainer: '#3F3B36',
          onPrimaryContainer: '#FFFFFF',
        },
        secondary: {
          primary: '#97AEFF',
          onPrimary: '#000000',
          primaryContainer: '#97AEFF',
          onPrimaryContainer: '#FFFFFF',
        },
        tertiary: {
          primary: '#FF8A00',
          onPrimary: '#FFFFFF',
          primaryContainer: '#FFCEA1',
          onPrimaryContainer: '#FFFFFF',
        },
      },
    },
  },
  {
    styles: {
      global: {
        // styles for the `body`
        body: {
          bg: '#000000',
          color: 'white',
        },
      },
    },
  }
)