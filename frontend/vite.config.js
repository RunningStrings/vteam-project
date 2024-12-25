import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/users': 'http://backend:5000',
      '/bikes': 'http://backend:5000',
      '/cities': 'http://backend:5000',
      '/charging_stations': 'http://backend:5000',
      '/parking_zones': 'http://backend:5000',
    },
  },
});
