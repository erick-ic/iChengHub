import prisma from "../src/lib/prisma"

async function main() {
  // 清空现有数据
  await prisma.toolCard.deleteMany({})

  // 插入新数据
  const tools = [
    {
      id: 'cmoiwkclv0000ahd07voycrgx',
      name: 'DeepSeek',
      nameEn: 'DeepSeek',
      desc: '深度求索大模型，支持多轮对话、代码生成、数学推理等多种任务',
      descEn: 'DeepSeek large model, supports multi-turn dialogue, code generation, mathematical reasoning and other tasks',
      url: 'https://www.deepseek.com',
      logoUrl: 'http://cdn-hsyq-static.shanhutech.cn/bizhi/staticwp/202506/3ed08f02b5306ab9f8728e17251a3216--4192779278.jpg',
      category: 'AI',
      status: 0,
      sortOrder: 0,
    },
    {
      id: 'cmoiwkclx0001ahd0qnvny1lk',
      name: 'Kimi',
      nameEn: 'Kimi',
      desc: 'Kimi 智能助手，支持超长上下文理解和多文档分析',
      descEn: 'Kimi AI Assistant, supports ultra-long context understanding and multi-document analysis',
      url: 'https://kimi.moonshot.cn',
      logoUrl: 'http://cdn-hsyq-static.shanhutech.cn/bizhi/staticwp/202505/a22807b9f97e6f643b1aed9f325bf919--2702915091.jpg',
      category: 'AI',
      status: 0,
      sortOrder: 0,
    },
    {
      id: 'cmoiwkcly0002ahd0ir0oxetv',
      name: 'GPT-4',
      nameEn: 'GPT-4',
      desc: 'OpenAI 的强大语言模型，支持复杂推理和创意生成',
      descEn: "OpenAI's powerful language model, supports complex reasoning and creative generation",
      url: 'https://openai.com',
      logoUrl: 'http://cdn-hsyq-static.shanhutech.cn/bizhi/staticwp/202503/66ed1c952cbd728a34f4dc060bc17065--4141980737.jpg',
      category: 'AI',
      status: 0,
      sortOrder: 0,
    },
    {
      id: 'cmoiwkcly0003ahd0zkfw9gzj',
      name: 'Claude',
      nameEn: 'Claude',
      desc: 'Anthropic 的 AI 助手，以安全性和长文本处理著称',
      descEn: "Anthropic's AI assistant, known for safety and long text processing",
      url: 'https://www.anthropic.com',
      logoUrl: 'http://cdn-hsyq-static.shanhutech.cn/bizhi/staticwp/202411/90008de0a0a2a09528daa77afa3c931a--3863040429.jpg',
      category: 'AI',
      status: 0,
      sortOrder: 0,
    },
    {
      id: 'cmoiwkclz0004ahd0l55nu3xa',
      name: 'Gemini',
      nameEn: 'Gemini',
      desc: 'Google 的多模态 AI 模型，支持文本、图像和视频理解',
      descEn: "Google's multimodal AI model, supports text, image and video understanding",
      url: 'https://gemini.google.com',
      logoUrl: 'http://cdn-hsyq-static.shanhutech.cn/bizhi/staticwp/202410/2f6a7726d778a393bc1170baebe7761f--4183847649.jpg',
      category: 'AI',
      status: 0,
      sortOrder: 0,
    },
    {
      id: 'cmoiwkclz0005ahd0iqeigbab',
      name: 'Stable Diffusion',
      nameEn: 'Stable Diffusion',
      desc: '开源图像生成模型，支持多种风格和自定义训练',
      descEn: 'Open-source image generation model, supports multiple styles and custom training',
      url: 'https://stablediffusionweb.com',
      logoUrl: 'http://cdn-hsyq-static.shanhutech.cn/bizhi/staticwp/202105/1919c4da28f6be56435a07060fe58576--3441585159.jpg',
      category: 'AI',
      status: 0,
      sortOrder: 0,
    },
  ]

  for (const tool of tools) {
    await prisma.toolCard.create({
      data: tool,
    })
  }

  console.log('数据替换完成！共插入 ' + tools.length + ' 条数据')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })