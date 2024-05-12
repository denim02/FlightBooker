import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { CssBaseline, StyledEngineProvider, createTheme } from '@mui/material';
import { ThemeProvider, CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';

const rootElement = document.getElementById("root");
const root = ReactDOM.createRoot(rootElement!);

const theme = createTheme({
    components: {
        MuiPopover: {
            defaultProps: {
                container: rootElement,
            },
        },
        MuiPopper: {
            defaultProps: {
                container: rootElement,
            },
        },
        MuiDialog: {
            defaultProps: {
                container: rootElement,
            },
        },
        MuiModal: {
            defaultProps: {
                container: rootElement,
            },
        },
    },
    breakpoints: {
        values: {
            xs: 0,
            sm: 640,
            md: 768,
            lg: 1024,
            xl: 1280,
        }
    }
}); 

const cache = createCache({
    key: 'css',
    prepend: true,
});

root.render(
    <React.StrictMode>
        <CacheProvider value={cache}>
            <StyledEngineProvider injectFirst>
                <ThemeProvider theme={theme}>
                    <CssBaseline />
                    <App />
                </ThemeProvider>
            </StyledEngineProvider>
        </CacheProvider>
    </React.StrictMode>,
)
