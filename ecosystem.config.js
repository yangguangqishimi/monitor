module.exports = {
  apps : [{
    name      : 'API',
    script    : 'index.js',
    env: {
      NODE_ENV: 'development'
    },
    env_production : {
      NODE_ENV: 'production'
    }
  }],

  deploy : {
    production : {
      user : 'ubuntu',
      host : '122.51.22.39',
      ref  : 'origin/master',
      repo : 'git@github.com:yangguangqishimi/monitor.git',
      path : '/home/ubuntu/node-project',
      "ssh_options": ["StrictHostKeyChecking=no", "PasswordAuthentication=no"],
      'post-deploy' : 'npm install && pm2 reload ecosystem.config.js --env production'
    }
  }
};
