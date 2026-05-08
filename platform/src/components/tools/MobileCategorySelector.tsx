'use client';

interface CategoryItem {
  categoryName: string;
  displayCategoryName: string;
  toolCount: number;
}

interface MobileCategorySelectorProps {
  categories: CategoryItem[];
  isEnglish: boolean;
}

export default function MobileCategorySelector({ categories, isEnglish }: MobileCategorySelectorProps) {
  const handleCategoryClick = (categoryName: string) => {
    if (!categoryName) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    
    const escapedCategory = encodeURIComponent(categoryName);
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
        {isEnglish ? 'Categories' : '工具分类'}
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
            key={category.categoryName}
            onClick={() => handleCategoryClick(category.categoryName)}
            className="px-4 py-2 bg-gray-100 text-gray-700 text-sm rounded-full hover:bg-gray-200 transition-colors"
          >
            {category.displayCategoryName}
          </button>
        ))}
      </div>
    </div>
  );
}
