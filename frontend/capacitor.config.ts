import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.rivan.app',
  appName: 'Rivan Realty',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  }
};

export default config;
