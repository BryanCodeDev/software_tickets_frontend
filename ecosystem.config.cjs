module.exports = {
  apps: [
    {
      name: 'frontend',
      script: './node_modules/.bin/vite',
      args: 'preview --port 8080 --host 0.0.0.0',
      cwd: '.',
      instances: 1,
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'production',
        PORT: 8080
      },
      error_file: './logs/frontend-error.log',
      out_file: './logs/frontend-out.log',
      log_file: './logs/frontend.log',
      time: true
    }
  ]
};