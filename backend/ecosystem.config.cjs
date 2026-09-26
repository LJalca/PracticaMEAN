module.exports = {
  apps: [{
    name: 'backend-mean',
    cwd: __dirname,
    script: './dist/index.js',
    instances: 'max',
    exec_mode: 'cluster',
    env_production: {
      NODE_ENV: 'production',
      PORT: 3000
    }
  }],

  deploy: {
    production: {
      user: 'ubuntu',
      host: '3.130.66.147',
      ref: 'origin/main',
      repo: 'git@github.com:LJalca/PracticaMEAN.git',
      path: '/home/ubuntu/tu-app',
      'post-deploy': 'npm --prefix backend install --legacy-peer-deps && npm --prefix backend run build && pm2 reload backend/ecosystem.config.cjs --env production',
      ssh_options: 'IdentityFile=C:/Users/LAJS/Documents/clj/MaeUPS/AWSPC/ljalca2626.pem'
    }
  }
};