'use client';

interface MobileCategorySelectorProps {
  categories: string[];
  isEnglish: boolean;
}

export default function MobileCategorySelector({ categories, isEnglish }: MobileCategorySelectorProps) {
  const handleCategoryClick = (category: string) => {
    if (!category) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    
    const escapedCategory = encodeURIComponent(category);
    const selector = `[data-category="${escapedCategory}"]`;
    const element = document.querySelector(selector);
    
    if (element) {
      const offset = 80;
      const elementTop = element.getBoundingClientRect().top + window.pageYOffset;
      window.scrollTo({
        top: elementTop - offset,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
      <h2 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
        </svg>
        {isEnglish ? 'Categories' : '链接导航'}
      </h2>
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => handleCategoryClick('')}
          className="px-4 py-2 bg-primary text-white text-sm rounded-full hover:bg-primary/90 transition-colors"
        >
          {isEnglish ? 'All' : '全部'}
        </button>
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => handleCategoryClick(category)}
            className="px-4 py-2 bg-gray-100 text-gray-700 text-sm rounded-full hover:bg-gray-200 transition-colors"
          >
            {category}
          </button>
        ))}
      </div>
    </div>
  );
}
