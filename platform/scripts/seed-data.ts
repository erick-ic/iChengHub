import prisma from "../src/lib/prisma"

async function main() {
  const tools = [
    {
      name: "Gemini",
      nameEn: "Gemini",
      desc: "Google 的多模态 AI 模型，支持文本、图像和视频理解",
      descEn: "Google's multimodal AI model, supports text, image and video understanding",
      url: "https://gemini.google.com",
      logoUrl: "https://cdn-icons-png.flaticon.com/512/3063/3063120.png",
      category: "AI",
      status: 1,
      sortOrder: 1,
    },
    {
      name: "Kimi",
      nameEn: "Kimi",
      desc: "Kimi 智能助手，支持超长上下文理解和多文档分析",
      descEn: "Kimi AI assistant, supports ultra-long context understanding and multi-document analysis",
      url: "https://kimi.moonshot.cn",
      logoUrl: "https://neeko-copilot.bytedance.net/api/text2image?prompt=AI%20chatbot%20logo%20design%20with%20blue%20gradient&image_size=square",
      category: "AI",
      status: 1,
      sortOrder: 2,
    },
    {
      name: "GPT-4",
      nameEn: "GPT-4",
      desc: "OpenAI 的强大语言模型，支持复杂推理和创意生成",
      descEn: "OpenAI's powerful language model, supports complex reasoning and creative generation",
      url: "https://openai.com",
      logoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/04/ChatGPT_logo.svg/1024px-ChatGPT_logo.svg.png",
      category: "AI",
      status: 1,
      sortOrder: 3,
    },
    {
      name: "DeepSeek",
      nameEn: "DeepSeek",
      desc: "深度求索大模型，支持多轮对话、代码生成、数学推理等多种任务",
      descEn: "DeepSeek large model, supports multi-turn dialogue, code generation, mathematical reasoning and other tasks",
      url: "https://www.deepseek.com",
      logoUrl: "https://neeko-copilot.bytedance.net/api/text2image?prompt=AI%20robot%20logo%20with%20green%20tech%20style&image_size=square",
      category: "AI",
      status: 1,
      sortOrder: 4,
    },
    {
      name: "Stable Diffusion",
      nameEn: "Stable Diffusion",
      desc: "开源图像生成模型，支持多种风格和自定义训练",
      descEn: "Open-source image generation model, supports multiple styles and custom training",
      url: "https://stablediffusionweb.com",
      logoUrl: "https://neeko-copilot.bytedance.net/api/text2image?prompt=AI%20art%20generator%20logo%20with%20colorful%20diffusion&image_size=square",
      category: "AI",
      status: 0,
      sortOrder: 5,
    },
    {
      name: "Claude",
      nameEn: "Claude",
      desc: "Anthropic 的 AI 助手，以安全性和长文本处理著称",
      descEn: "Anthropic's AI assistant, known for safety and long text processing",
      url: "https://www.anthropic.com",
      logoUrl: "https://neeko-copilot.bytedance.net/api/text2image?prompt=friendly%20AI%20chatbot%20logo%20with%20orange%20warm%20color&image_size=square",
      category: "AI",
      status: 0,
      sortOrder: 6,
    },
  ]

  for (const tool of tools) {
    await prisma.toolCard.create({
      data: tool,
    })
  }

  console.log("数据插入完成！")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })