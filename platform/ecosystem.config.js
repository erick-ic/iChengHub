module.exports = {
  apps: [{
    name: 'ai-tool-portal',
    // 1. 修改 script 路径
    script: 'server.js', 
    // 2. 这里的 args 不再需要 start，因为 server.js 就是入口
    args: '', 
    cwd: '/home/ecs-user/ai-tool-portal',
    instances: 1,
    exec_mode: 'fork',
    env: {
      NODE_ENV: 'production',
      PORT: 3000 // 3. 通过环境变量指定端口
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_file: './logs/combined.log',
    merge_logs: true,
    log_date_format: 'YYYY-MM-DD HH:mm:ss',
    autorestart: true,
    restart_delay: 5000
  }]
};