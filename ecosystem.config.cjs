module.exports = {
  apps: [
    {
      name: 'pdf-tools',
      host: '0.0.0.0',
      port: '4000',
      exec_mode: 'cluster',
      instances: 'max',
      script: './.output/server/index.mjs',
      env: {
        NODE_OPTIONS: '--ipv6=false',  // Force Node.js to avoid IPv6
        HOST: '0.0.0.0',               // Listen on all IPv4 interfaces
        PORT: '4000'                   // Port for your app
      }
    }
  ]
}
