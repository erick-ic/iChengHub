export interface Tool {
  id: string;
  nameKey: string;
  descKey: string;
  coverImage: string;
  category: string;
  url: string;
}

export const tools: Tool[] = [
  {
    id: '1',
    nameKey: 'aiImageGenerator',
    descKey: 'aiImageGeneratorDesc',
    coverImage: 'http://cdn-hsyq-static.shanhutech.cn/bizhi/staticwp/202506/3ed08f02b5306ab9f8728e17251a3216--4192779278.jpg',
    category: 'AI',
    url: '/tools/ai-image-generator'
  },
  {
    id: '2',
    nameKey: 'imageEditor',
    descKey: 'imageEditorDesc',
    coverImage: 'http://cdn-hsyq-static.shanhutech.cn/bizhi/staticwp/202505/a22807b9f97e6f643b1aed9f325bf919--2702915091.jpg',
    category: '编辑',
    url: '/tools/image-editor'
  },
  {
    id: '3',
    nameKey: 'formatConverter',
    descKey: 'formatConverterDesc',
    coverImage: 'http://cdn-hsyq-static.shanhutech.cn/bizhi/staticwp/202503/66ed1c952cbd728a34f4dc060bc17065--4141980737.jpg',
    category: '转换',
    url: '/tools/format-converter'
  },
  {
    id: '4',
    nameKey: 'videoEditor',
    descKey: 'videoEditorDesc',
    coverImage: 'http://cdn-hsyq-static.shanhutech.cn/bizhi/staticwp/202411/90008de0a0a2a09528daa77afa3c931a--3863040429.jpg',
    category: '编辑',
    url: '/tools/video-editor'
  },
  {
    id: '5',
    nameKey: 'documentConverter',
    descKey: 'documentConverterDesc',
    coverImage: 'http://cdn-hsyq-static.shanhutech.cn/bizhi/staticwp/202410/2f6a7726d778a393bc1170baebe7761f--4183847649.jpg',
    category: '转换',
    url: '/tools/document-converter'
  },
  {
    id: '6',
    nameKey: 'aiTextAssistant',
    descKey: 'aiTextAssistantDesc',
    coverImage: 'http://cdn-hsyq-static.shanhutech.cn/bizhi/staticwp/202408/aa5f5cb60290872203fcd14dfa10e9d5--2308701055.jpg',
    category: 'AI',
    url: '/tools/ai-text-assistant'
  }
];