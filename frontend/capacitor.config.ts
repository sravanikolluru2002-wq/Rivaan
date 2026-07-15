import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.rivan.reality',
  appName: 'Rivan Reality',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  }
};

export default config;
