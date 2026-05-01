import prisma from "../src/lib/prisma"

async function main() {
  // 更新 sortOrder 值，按照插入顺序
  const updates = [
    { id: 'cmoiwkclv0000ahd07voycrgx', sortOrder: 1 }, // DeepSeek
    { id: 'cmoiwkclx0001ahd0qnvny1lk', sortOrder: 2 }, // Kimi
    { id: 'cmoiwkcly0002ahd0ir0oxetv', sortOrder: 3 }, // GPT-4
    { id: 'cmoiwkcly0003ahd0zkfw9gzj', sortOrder: 4 }, // Claude
    { id: 'cmoiwkclz0004ahd0l55nu3xa', sortOrder: 5 }, // Gemini
    { id: 'cmoiwkclz0005ahd0iqeigbab', sortOrder: 6 }, // Stable Diffusion
  ]

  for (const tool of updates) {
    await prisma.toolCard.update({
      where: { id: tool.id },
      data: { sortOrder: tool.sortOrder },
    })
  }

  console.log('排序更新完成！')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })