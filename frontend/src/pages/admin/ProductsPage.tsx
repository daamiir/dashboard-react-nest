import { ProductsListCard } from "@/modules/products";

const ProductsPage = () => {
  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-xl font-semibold mb-4">Products List</h1>
      <ProductsListCard />
    </div>
  );
};

export default ProductsPage;
