import { getDictionary } from '@/dictionaries';
import Navbar from '@/components/home/Navbar';
import Footer from '@/components/home/Footer';
import { ProductFilter } from '@/components/shop/ProductFilter';
import { ProductGrid } from '@/components/shop/ProductGrid';

export default async function ProductsPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const dict = await getDictionary(lang as any);

  return (
    <div className="bg-surface text-on-surface font-body-md min-h-screen pt-20">
      <Navbar />

      <main className="max-w-[1280px] mx-auto px-6 lg:px-8 py-8 grid grid-cols-1 md:grid-cols-12 gap-6">
        <ProductFilter dict={dict} />
        <ProductGrid dict={dict} lang={lang} />
      </main>

      <Footer />
    </div>
  );
}
