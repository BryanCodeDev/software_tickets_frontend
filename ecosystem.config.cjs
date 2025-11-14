module.exports = {
  apps: [
    {
      name: 'frontend',
      script: 'npm',
      args: 'run preview',
      cwd: '.',
      instances: 1,
      exec_mode: 'fork',
      interpreter: 'cmd',
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