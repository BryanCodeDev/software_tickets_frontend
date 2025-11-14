module.exports = {
  apps: [
    {
      name: 'frontend',
      script: 'npm',
      args: 'run preview',
      cwd: '.',
      instances: 1,
      exec_mode: 'fork',
      interpreter: 'none',  // Important: tells PM2 not to use Node.js to run npm
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