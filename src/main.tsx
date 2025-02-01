import React from 'react';
import ReactDOM, { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { SnackbarProvider } from 'notistack';
import store from './redux/stores/store';
import App from './App';
import './index.scss';  // Change from .scss to .css if you're using CSS
import './index.css';  // Change from .scss to .css if you're using CSS

const container = document.getElementById('root');
if (!container) throw new Error('Failed to find the root element');
const root = createRoot(container);

root.render(
    <Provider store={store}>
      <BrowserRouter>
        <SnackbarProvider 
          maxSnack={3}
          autoHideDuration={3000}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
          style={{ 
            direction: 'rtl',
            fontFamily: 'Vazirmatn'
          }}
        >
          <App />
        </SnackbarProvider>
      </BrowserRouter>
    </Provider>
);