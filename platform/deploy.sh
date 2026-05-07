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

# ✨ 3. 核心修复：同步静态资源到 standalone 目录内部
# 这是保证我们的 SVG 和 TTF 字体在线上能被加载的唯一方法！
echo "📂 同步静态资源到 standalone 目录..."
cp -r public .next/standalone/
mkdir -p .next/standalone/.next
cp -r .next/static .next/standalone/.next/

# 4. 执行打包
echo "📦 正在打包 Standalone 产物..."
# 修改：去掉了冗余的 .next/static 和 .next/server，直接打包合并后的 standalone
tar --no-xattrs \
    --exclude='._*' \
    --exclude='.DS_Store' \
    -czvhf deploy.tar.gz \
    .next/standalone \
    ecosystem.config.js \
    prisma/schema.prisma

echo "🚀 打包完成！文件名：deploy.tar.gz"
echo "------------------------------------------------"
echo "💡 下一步建议手动操作流程："
echo "1. scp deploy.tar.gz ecs-user@47.117.43.10:~/ai-tool-portal/"
echo "2. ssh 连上服务器执行："
echo "   tar -xzvf deploy.tar.gz"
echo "   cp .env .next/standalone/.env"
echo "   pm2 restart ecosystem.config.js"
echo "------------------------------------------------"