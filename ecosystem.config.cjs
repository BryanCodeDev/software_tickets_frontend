module.exports = {
  apps: [
    {
      name: 'frontend',
      script: 'npx',
      args: 'serve dist -p 8080 -s',
      cwd: './software_tickets_frontend',
      instances: 1,
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'production',
        PORT: 8080
      },
      error_file: './logs/frontend-error.log',
      out_file: './logs/frontend-out.log',
      log_file: './logs/frontend.log',
      time: true,
      max_restarts: 10,
      min_uptime: '10s'
    }
  ]
};