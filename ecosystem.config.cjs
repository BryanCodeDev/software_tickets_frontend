module.exports = {
  apps: [
    {
      name: 'frontend',
      script: 'C:\\Program Files\\nodejs\\npx.cmd',
      args: 'vite preview --port 8080 --host 0.0.0.0',
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