module.exports = {
  apps: [
    {
      name: 'frontend',
      script: 'cmd',
      args: '/c "npm run preview"',
      cwd: '.',
      instances: 1,
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'production',
        PORT: 8080,
        VITE_API_URL: 'http://192.168.30.246:5000/api',
        VITE_SOCKET_URL: 'http://192.168.30.246:5000',
        VITE_SERVER_URL: 'http://192.168.30.246:5000'
      },
      error_file: './logs/frontend-error.log',
      out_file: './logs/frontend-out.log',
      log_file: './logs/frontend.log',
      time: true
    }
  ]
};