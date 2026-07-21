interface BlogExportPayload {
  version: string;
  platform: string;
  exportedAt: string;
  data: {
    titleZh: string;
    titleEn: string;
    categoryZh: string;
    categoryEn: string;
    summaryZh: string;
    summaryEn: string;
    tags: string[];
    contentZh: string;
    contentEn: string;
  };
}

interface BlogPost {
  id: string;
  titleZh: string;
  titleEn: string;
  categoryZh: string;
  categoryEn: string;
  excerptZh: string;
  excerptEn: string;
  contentZh: string;
  contentEn: string;
  tags?: string[];
}

export function exportBlogAsJson(article: BlogPost) {
  const payload: BlogExportPayload = {
    version: '1.0',
    platform: 'iChengHub',
    exportedAt: new Date().toISOString(),
    data: {
      titleZh: article.titleZh || '',
      titleEn: article.titleEn || '',
      categoryZh: article.categoryZh || '',
      categoryEn: article.categoryEn || '',
      summaryZh: article.excerptZh || '',
      summaryEn: article.excerptEn || '',
      tags: Array.isArray(article.tags) ? article.tags : [],
      contentZh: article.contentZh || '',
      contentEn: article.contentEn || '',
    },
  };

  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `ichenghub-blog-${article.id || 'draft'}-${Date.now()}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

export async function parseBlogJsonFile(file: File): Promise<BlogExportPayload['data']> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const json = JSON.parse(e.target?.result as string);

        if (typeof json !== 'object' || json === null) {
          throw new Error('Invalid JSON structure');
        }

        if (json.platform !== 'iChengHub') {
          throw new Error('Not an iChengHub blog backup file');
        }

        if (!json.data) {
          throw new Error('Missing data field');
        }

        resolve(json.data);
      } catch (err) {
        reject(new Error('文件格式解析失败，请检查是否为合法的 iChengHub 博客备份文件'));
      }
    };

    reader.onerror = () => {
      reject(new Error('读取文件失败'));
    };

    reader.readAsText(file);
  });
}