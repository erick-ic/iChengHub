#!/bin/bash

# 1. 环境自检逻辑
echo "🔍 正在检查生产环境配置..."
if grep -q "127.0.0.1" .env; then
    echo "✅ 环境校验通过：数据库指向已设为 127.0.0.1"
else
    echo "⚠️ 警告：.env 中未发现 127.0.0.1，请确认是否要连接公网 IP？"
fi

# 2. 预清理与依赖检查
echo "🧹 清理旧产物..."
rm -f deploy.tar.gz

# ✨ 3. 同步静态资源到 standalone 目录内部
echo "📂 同步静态资源到 standalone 目录..."
cp -r public .next/standalone/
mkdir -p .next/standalone/.next
cp -r .next/static .next/standalone/.next/

# 4. 执行打包 (🚨 核心修改点)
echo "📦 正在打包 Standalone 产物..."
tar --no-xattrs \
    --exclude='._*' \
    --exclude='.DS_Store' \
    -czvhf deploy.tar.gz \
    .next/standalone \
    ecosystem.config.js \
    prisma/schema.prisma \
    prisma/migrations \
    package.json \
    package-lock.json

echo "🚀 打包完成！文件名：deploy.tar.gz"
echo "------------------------------------------------"
echo "💡 下一步建议手动操作流程 (大厂级安全 SOP)："
echo "1. 上传安装包："
echo "   scp deploy.tar.gz ecs-user@47.117.43.10:~/ai-tool-portal/"
echo "2. SSH 连上服务器并执行："
echo "   tar -xzvf deploy.tar.gz"
echo "   cp .env .next/standalone/.env"
echo "   # 生成适配 Linux 的 Prisma Client"
echo "   npx prisma generate"
echo "   # ⚠️ 安全应用数据库变更 (绝不删库)"
echo "   npx prisma migrate deploy"
echo "   # 🔄 零宕机平滑重启"
echo "   pm2 reload ecosystem.config.js --update-env"
echo "------------------------------------------------"