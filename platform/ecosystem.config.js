module.exports = {
  apps: [{
    name: 'ai-tool-portal',
    // 1. 修正启动路径，指向 standalone 的入口
    script: './.next/standalone/server.js', 
    args: '',
    cwd: '/home/ecs-user/ai-tool-portal',
    instances: 1,
    exec_mode: 'fork',
    env: {
      NODE_ENV: 'production',
      PORT: 3000,
      HOSTNAME: '0.0.0.0',
      // 配置外部可访问的 URL，解决重定向端口号问题
      NEXT_PUBLIC_APP_URL: 'https://ichenghub.cn',
      NEXTAUTH_URL: 'https://ichenghub.cn',
      // 修正为本地环回地址，提高连接稳定性和安全性
      DATABASE_URL: 'postgresql://admin_user:Aichenghub1024.@127.0.0.1:5432/ichenghub'
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