import { Metadata } from 'next';
import AboutView from './View';

type Props = {
  params: { locale: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const isEn = params.locale === 'en';
  return {
    title: isEn ? 'About Us - Pure AI Workshop' : '关于我们 - 纯净 AI 工坊',
    description: isEn 
      ? 'Learn about iChengHub, your dedicated AI efficiency compass. We curate high-quality AI tools and productivity prompts.' 
      : '了解热荐工坊，你的专属效率罗盘。我们精心收录高质量 AI 工具与生产力提示词。',
  };
}

export default function AboutPage() {
  return <AboutView />;
}
