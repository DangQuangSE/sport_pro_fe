import { getDictionary } from '@/dictionaries';
import Navbar from '@/components/home/Navbar';
import Link from 'next/link';

export default async function CustomizerPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const dict = await getDictionary(lang as any);

  return (
    <div className="bg-surface text-on-surface font-body-md min-h-screen flex flex-col">
      {/* TopNavBar */}
      <header className="bg-white/90 backdrop-blur-md fixed top-0 w-full z-50 border-b-2 border-zinc-200 shadow-[0_4px_12px_rgba(0,0,0,0.05)] flex justify-between items-center px-8 h-20">
        <div className="text-2xl font-black italic tracking-tighter text-zinc-900">
          <Link href={`/${lang}`}>SPORT PRO</Link>
        </div>
        <nav className="hidden md:flex gap-8 items-center h-full">
          <Link className="font-lexend font-bold tracking-tight uppercase text-zinc-600 hover:text-orange-500 transition-colors h-full flex items-center px-2" href={`/${lang}/products?category=men`}>NAM</Link>
          <Link className="font-lexend font-bold tracking-tight uppercase text-zinc-600 hover:text-orange-500 transition-colors h-full flex items-center px-2" href={`/${lang}/products?category=women`}>NỮ</Link>
          <Link className="font-lexend font-bold tracking-tight uppercase text-blue-600 border-b-2 border-blue-600 h-full flex items-center px-2" href={`/${lang}/products`}>TRANG BỊ</Link>
          <Link className="font-lexend font-bold tracking-tight uppercase text-zinc-600 hover:text-orange-500 transition-colors h-full flex items-center px-2" href={`/${lang}/products`}>TẬP LUYỆN</Link>
          <Link className="font-lexend font-bold tracking-tight uppercase text-zinc-600 hover:text-orange-500 transition-colors h-full flex items-center px-2" href={`/${lang}/products`}>GIẢM GIÁ</Link>
        </nav>
        <div className="flex items-center gap-4">
          <button className="text-zinc-600 hover:text-orange-500 transition-colors"><span className="material-symbols-outlined">search</span></button>
          <Link href={`/${lang}/cart`} className="text-zinc-600 hover:text-orange-500 transition-colors"><span className="material-symbols-outlined">shopping_cart</span></Link>
          <button className="text-zinc-600 hover:text-orange-500 transition-colors"><span className="material-symbols-outlined">person</span></button>
        </div>
      </header>

      {/* Main Content: Customizer Workspace */}
      <main className="flex-grow pt-20 flex flex-col md:flex-row max-w-[1280px] mx-auto w-full px-8 gap-6 h-[calc(100vh-80px)] overflow-hidden">
        {/* Left Sidebar: Tools & Options */}
        <aside className="w-full md:w-80 flex-shrink-0 flex flex-col gap-6 py-8 overflow-y-auto pr-4 bg-surface border-r border-outline-variant h-full">
          <div className="mb-2">
            <h1 className="font-headline-md text-headline-md text-on-surface mb-1">{dict.customizer.title}</h1>
            <p className="font-body-sm text-body-sm text-on-surface-variant">{dict.customizer.subtitle}</p>
          </div>

          {/* Tool Sections */}
          <div className="space-y-6 flex-grow">
            {/* Add Text Section */}
            <div className="bg-surface-container-lowest p-4 rounded-lg border border-outline-variant shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-2 mb-4">
                <span className="material-symbols-outlined text-primary">text_fields</span>
                <h2 className="font-label-lg text-label-lg text-on-surface uppercase">{dict.customizer.addText}</h2>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block font-label-md text-label-md text-on-surface-variant mb-1 uppercase">{dict.customizer.content}</label>
                  <input className="w-full bg-surface-container-lowest border border-outline-variant rounded px-4 py-2 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors font-body-md text-body-md text-on-surface" placeholder="Nhập tên hoặc số..." type="text" />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block font-label-md text-label-md text-on-surface-variant mb-1 uppercase">{dict.customizer.font}</label>
                    <select className="w-full bg-surface-container-lowest border border-outline-variant rounded px-4 py-2 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors font-body-sm text-body-sm text-on-surface">
                      <option>Lexend</option>
                      <option>Inter</option>
                      <option>Bebas Neue</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-label-md text-label-md text-on-surface-variant mb-1 uppercase">{dict.customizer.color}</label>
                    <div className="flex gap-1 items-center h-full">
                      <button className="w-8 h-8 rounded-full bg-on-surface border border-outline-variant ring-2 ring-offset-1 ring-transparent hover:ring-outline transition-all"></button>
                      <button className="w-8 h-8 rounded-full bg-surface-container-lowest border border-outline-variant ring-2 ring-offset-1 ring-transparent hover:ring-outline transition-all"></button>
                      <button className="w-8 h-8 rounded-full bg-secondary-container border border-outline-variant ring-2 ring-offset-1 ring-transparent hover:ring-outline transition-all"></button>
                      <button className="w-8 h-8 rounded-full bg-primary border border-outline-variant ring-2 ring-offset-1 ring-transparent hover:ring-outline transition-all"></button>
                    </div>
                  </div>
                </div>
                <button className="w-full py-2 px-4 border-2 border-outline-variant text-on-surface font-label-lg text-label-lg rounded hover:bg-surface-container transition-colors flex items-center justify-center gap-1 uppercase">
                  <span className="material-symbols-outlined text-[18px]">add</span> {dict.customizer.addTextBtn}
                </button>
              </div>
            </div>

            {/* Upload Image Section */}
            <div className="bg-surface-container-lowest p-4 rounded-lg border border-outline-variant shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-2 mb-4">
                <span className="material-symbols-outlined text-primary">image</span>
                <h2 className="font-label-lg text-label-lg text-on-surface uppercase">{dict.customizer.addLogo}</h2>
              </div>
              <div className="border-2 border-dashed border-outline-variant rounded-lg p-6 flex flex-col items-center justify-center text-center bg-surface hover:bg-surface-container-low transition-colors cursor-pointer">
                <span className="material-symbols-outlined text-[32px] text-outline mb-2">cloud_upload</span>
                <p className="font-label-lg text-label-lg text-on-surface mb-1">{dict.customizer.uploadNote}</p>
                <p className="font-body-sm text-body-sm text-on-surface-variant text-[12px]">{dict.customizer.uploadSupport}</p>
              </div>
            </div>

            {/* Printing Material Section */}
            <div className="bg-surface-container-lowest p-4 rounded-lg border border-outline-variant shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-2 mb-4">
                <span className="material-symbols-outlined text-primary">layers</span>
                <h2 className="font-label-lg text-label-lg text-on-surface uppercase">{dict.customizer.material}</h2>
              </div>
              <div className="flex flex-col gap-2">
                <label className="flex items-start gap-4 p-3 border border-outline-variant rounded hover:bg-surface-container-low cursor-pointer transition-colors relative">
                  <input checked className="mt-1 text-primary focus:ring-primary" name="material" type="radio" readOnly />
                  <div>
                    <span className="font-label-lg text-label-lg text-on-surface block mb-1">{dict.customizer.sublimation}</span>
                    <span className="font-body-sm text-body-sm text-on-surface-variant text-[12px]">{dict.customizer.sublimationNote}</span>
                  </div>
                </label>
                <label className="flex items-start gap-4 p-3 border border-outline-variant rounded hover:bg-surface-container-low cursor-pointer transition-colors relative">
                  <input className="mt-1 text-primary focus:ring-primary" name="material" type="radio" readOnly />
                  <div>
                    <span className="font-label-lg text-label-lg text-on-surface block mb-1">{dict.customizer.decal}</span>
                    <span className="font-body-sm text-body-sm text-on-surface-variant text-[12px]">{dict.customizer.decalNote}</span>
                  </div>
                </label>
              </div>
            </div>
          </div>
        </aside>

        {/* Central Workspace: Preview Area */}
        <section className="flex-grow flex flex-col py-8 relative bg-surface-container-low rounded-lg shadow-inner overflow-hidden my-4 border border-outline-variant">
          {/* Canvas Controls */}
          <div className="absolute top-4 right-4 flex gap-2 z-10 bg-surface-container-lowest p-1 rounded shadow-sm border border-outline-variant">
            <button className="w-10 h-10 flex items-center justify-center rounded hover:bg-surface-container text-on-surface-variant transition-colors" title="Zoom In">
              <span className="material-symbols-outlined">zoom_in</span>
            </button>
            <button className="w-10 h-10 flex items-center justify-center rounded hover:bg-surface-container text-on-surface-variant transition-colors" title="Zoom Out">
              <span className="material-symbols-outlined">zoom_out</span>
            </button>
            <div className="w-px h-6 bg-outline-variant self-center mx-1"></div>
            <button className="w-10 h-10 flex items-center justify-center rounded hover:bg-surface-container text-on-surface-variant transition-colors" title="Undo">
              <span className="material-symbols-outlined">undo</span>
            </button>
            <button className="w-10 h-10 flex items-center justify-center rounded hover:bg-surface-container text-on-surface-variant transition-colors" title="Redo">
              <span className="material-symbols-outlined">redo</span>
            </button>
          </div>

          {/* Preview Image Area */}
          <div className="flex-grow flex items-center justify-center relative w-full h-full p-8">
            <div className="relative w-full max-w-[500px] aspect-[4/5] bg-surface-container-lowest shadow-md rounded-lg border border-outline flex items-center justify-center overflow-hidden">
              <img alt="Blank sports t-shirt" className="w-[80%] h-auto object-contain opacity-90 drop-shadow-lg" src="https://lh3.googleusercontent.com/aida-public/AB6AXuApAvuc8kUmi1kPVuDAo-oq_0nc-mqUK1nIR6tvQU4KX8XdymhuHs97bAa6NJgjNGVSQF26WChfvU6FHg-CPujrbgM73RaLRQlm9g7zS-7rbEMOQnW9RvZm2qhr0qezf_hhBjbWpFYXFoA94FUXFPLeyW3DsoMnShdOYvg7a3PtHyxONtqYfrfAWD3q2RsymdRhymbCyMOPNm3J1Gaa9CkGA0Ng38rcaTndLazCZ0IQaT6psrpzA8kVMXjpK-xVhJ8qTy-_IhTMo3U" />
              {/* Editable Layer Overlay */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <div className="border border-dashed border-primary/50 w-[40%] h-[50%] flex items-center justify-center relative pointer-events-auto cursor-move hover:border-primary transition-colors bg-white/10 backdrop-blur-[2px]">
                  <span className="font-headline-lg text-headline-lg text-on-surface font-bold uppercase tracking-wider text-center drop-shadow-md">YOUR NAME<br />00</span>
                  <div className="absolute -top-1.5 -left-1.5 w-3 h-3 bg-white border border-primary rounded-full"></div>
                  <div className="absolute -top-1.5 -right-1.5 w-3 h-3 bg-white border border-primary rounded-full"></div>
                  <div className="absolute -bottom-1.5 -left-1.5 w-3 h-3 bg-white border border-primary rounded-full"></div>
                  <div className="absolute -bottom-1.5 -right-1.5 w-3 h-3 bg-white border border-primary rounded-full"></div>
                </div>
              </div>
            </div>
          </div>

          {/* View Toggle (Front/Back) */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-surface-container-lowest p-1 rounded-full shadow-md border border-outline-variant flex gap-1">
            <button className="px-6 py-2 rounded-full bg-primary text-on-primary font-label-md text-label-md transition-colors shadow-sm">{dict.customizer.front}</button>
            <button className="px-6 py-2 rounded-full bg-transparent hover:bg-surface-container text-on-surface-variant font-label-md text-label-md transition-colors">{dict.customizer.back}</button>
          </div>
        </section>
      </main>

      {/* Bottom Action Bar */}
      <div className="w-full bg-surface-container-lowest border-t border-outline-variant p-4 shadow-[0_-4px_12px_rgba(0,0,0,0.05)] sticky bottom-0 z-40">
        <div className="max-w-[1280px] mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-4">
            <div>
              <p className="font-label-sm text-label-sm text-on-surface-variant uppercase mb-1">{dict.customizer.totalEstimate}</p>
              <p className="font-headline-sm text-headline-sm text-on-surface">0 ₫</p>
            </div>
          </div>
          <div className="flex gap-4 w-full md:w-auto">
            <button className="flex-1 md:flex-none px-6 py-3 border-2 border-outline-variant text-on-surface font-label-lg text-label-lg rounded hover:bg-surface-container transition-colors flex items-center justify-center gap-2 whitespace-nowrap uppercase">
              <span className="material-symbols-outlined">save</span> {dict.customizer.saveDesign}
            </button>
            <Link href={`/${lang}/checkout`} className="flex-1 md:flex-none px-6 py-3 bg-secondary-container text-white font-label-lg text-label-lg font-bold rounded shadow-md hover:bg-secondary transition-all flex items-center justify-center gap-2 whitespace-nowrap uppercase">
              <span className="material-symbols-outlined">check_circle</span> {dict.customizer.confirmAndBack}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
