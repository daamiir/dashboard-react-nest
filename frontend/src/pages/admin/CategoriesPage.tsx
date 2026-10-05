import { CategoriesListCard } from "@/modules/categories/components/CategoriesListCard";

const CategoriesPage = () => {
  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-xl font-semibold mb-4">Categories List</h1>
      <CategoriesListCard />
    </div>
  );
};

export default CategoriesPage;
