#!/bin/bash

# 1. 环境自检逻辑
echo "🔍 正在检查生产环境配置..."

# 修改建议：打包时我们其实可以用本地的 iChengHub_local，
# 只要确保服务器上有一份正确的 .env 即可。
# 但如果你坚持在打包时切换变量，请确保 127.0.0.1 已经写好。
if grep -q "127.0.0.1" .env; then
    echo "✅ 环境校验通过：数据库指向已设为 127.0.0.1"
else
    echo "⚠️ 警告：.env 中未发现 127.0.0.1，请确认是否要连接公网 IP？"
    # 这里建议只做提示，不一定要 exit，除非你确定要强制 127.0.0.1
fi

# 2. 预清理与依赖检查 (新增)
echo "🧹 清理旧产物..."
rm -f deploy.tar.gz

# 3. 执行打包
echo "📦 正在打包 Standalone 产物..."

# 核心调整：
# 1. 使用 --exclude 彻底排除 Mac 系统的元数据文件和 DS_Store
# 2. 确保包含 .next/standalone 内部的 .env（如果需要）
# 3. 添加 -h 参数跟随软链接（防止 Prisma 引擎丢失）

tar --no-xattrs \
    --exclude='._*' \
    --exclude='.DS_Store' \
    -czvhf deploy.tar.gz \
    .next/standalone \
    .next/static \
    .next/server \
    public \
    ecosystem.config.js \
    prisma/schema.prisma

echo "🚀 打包完成！文件名：deploy.tar.gz"
echo "------------------------------------------------"
echo "💡 下一步建议手动操作流程："
echo "1. scp deploy.tar.gz ecs-user@47.117.43.10:~/ai-tool-portal/"
echo "2. ssh 连上服务器执行："
echo "   tar -xzvf deploy.tar.gz"
echo "   cp .env .next/standalone/.env"
echo "   pm2 delete ai-tool-portal && pm2 start ecosystem.config.js"
echo "------------------------------------------------"