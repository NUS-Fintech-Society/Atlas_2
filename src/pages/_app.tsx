// src/pages/_app.tsx
import { httpBatchLink } from '@trpc/client/links/httpBatchLink'
import { loggerLink } from '@trpc/client/links/loggerLink'
import { withTRPC } from '@trpc/next'
import { SessionProvider } from 'next-auth/react'
import superjson from 'superjson'
import type { AppType } from 'next/app'
import type { AppRouter } from '~/server/trpc/router/_app'
import type { Session } from 'next-auth'
import { ChakraProvider, extendTheme, type ThemeConfig } from '@chakra-ui/react'
import { Provider } from 'react-redux'
import store from '~/store/store'
import '../styles/globals.css'

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

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <Provider store={store}>
      <ChakraProvider theme={theme}>
        <SessionProvider session={session}>
          <Component {...pageProps} />
        </SessionProvider>
      </ChakraProvider>
    </Provider>
  )
}

const getBaseUrl = () => {
  if (typeof window !== 'undefined') return '' // browser should use relative url
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}` // SSR should use vercel url
  return `http://localhost:${process.env.PORT ?? 3000}` // dev SSR should use localhost
}

export default withTRPC<AppRouter>({
  config() {
    /**
     * If you want to use SSR, you need to use the server's full URL
     * @link https://trpc.io/docs/ssr
     */
    const url = `${getBaseUrl()}/api/trpc`

    return {
      links: [
        loggerLink({
          enabled: (opts) =>
            process.env.NODE_ENV === 'development' ||
            (opts.direction === 'down' && opts.result instanceof Error),
        }),
        httpBatchLink({ url }),
      ],
      url,
      transformer: superjson,
      /**
       * @link https://react-query.tanstack.com/reference/QueryClient
       */
      // queryClientConfig: { defaultOptions: { queries: { staleTime: 60 } } },

      // To use SSR properly you need to forward the client's headers to the server
      // headers: () => {
      //   if (ctx?.req) {
      //     const headers = ctx?.req?.headers;
      //     delete headers?.connection;
      //     return {
      //       ...headers,
      //       "x-ssr": "1",
      //     };
      //   }
      //   return {};
      // }
    }
  },
  /**
   * @link https://trpc.io/docs/ssr
   */
  ssr: false,
})(MyApp)
