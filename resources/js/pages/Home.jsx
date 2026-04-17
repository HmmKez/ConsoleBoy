import Layout from '../components/Layout';
import { Link } from '@inertiajs/react';

export default function Home({ featured = [], content = {} }) {

    console.log('Home content from server:', content);

    const heroImage     = content.hero_image     || 'https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=1400&q=80';
    const heroTitle     = content.hero_title     || 'LEVEL UP YOUR GAME';
    const heroSubtitle  = content.hero_subtitle  || 'Premium consoles, accessories, and controllers — all in one place. The best brands, the lowest prices, delivered fast.';
    const brandsTitle   = content.brands_title   || "Check out what's in store!";
    const brandsCaption = content.brands_caption || 'We give you the best of the best!';
    const xboxImg       = content.xbox_image     || 'https://images.unsplash.com/photo-1605901309584-818e25960a8f?w=600&q=80';
    const psImg         = content.ps_image       || 'https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=600&q=80';
    const nintendoImg   = content.nintendo_image || 'https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=600&q=80';

    const brands = [
        { name: 'XBOX',        img: xboxImg,     href: '/shop?brand=Xbox' },
        { name: 'PLAYSTATION', img: psImg,        href: '/shop?brand=PlayStation' },
        { name: 'NINTENDO',    img: nintendoImg,  href: '/shop?brand=Nintendo' },
    ];

    return (
        <Layout>
            {/* Hero */}
            <section className="relative h-[520px] flex items-center overflow-hidden bg-[#141414]">
                <div
                    className="absolute inset-0 bg-cover bg-center opacity-50"
                    style={{ backgroundImage: `url('${heroImage}')` }}
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
                <div className="relative z-10 px-16 max-w-2xl">
                    <h1 className="font-bebas text-7xl leading-none tracking-wide text-white mb-6">
                        {heroTitle}
                    </h1>
                    <p className="text-white/70 text-base leading-relaxed mb-8">
                        {heroSubtitle}
                    </p>
                    <div className="flex gap-4">
                        <Link
                            href="/shop"
                            className="flex items-center gap-2 bg-[#D0111A] hover:bg-[#9E0D14] text-white font-barlow text-sm font-bold tracking-[2px] uppercase px-8 py-4 transition-all hover:shadow-[0_0_24px_rgba(208,17,26,0.4)]"
                        >
                            Shop Now
                        </Link>
                        <Link
                            href="/about"
                            className="font-barlow text-sm font-bold tracking-[2px] uppercase px-8 py-4 border border-white/30 text-white hover:border-white transition-colors"
                        >
                            About Us
                        </Link>
                    </div>
                </div>
            </section>

            {/* Brand cards */}
            <section className="bg-[#0E0E0E] py-20 px-12">
                <h2 className="font-bebas text-4xl tracking-widest text-center text-white mb-12">
                    {brandsTitle}
                </h2>
                <div className="grid grid-cols-3 gap-1 max-w-5xl mx-auto">
                    {brands.map((b) => (
                        <Link
                            key={b.name}
                            href={b.href}
                            className="relative aspect-square overflow-hidden group"
                        >
                            <img
                                src={b.img}
                                alt={b.name}
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                            <div className="absolute bottom-0 left-0 right-0 p-6">
                                <div className="font-bebas text-3xl tracking-[3px] text-white">{b.name}</div>
                            </div>
                            <div className="absolute inset-0 border-2 border-transparent group-hover:border-[#D0111A] transition-colors duration-300" />
                        </Link>
                    ))}
                </div>
                <p className="text-center text-white/40 text-sm mt-8 font-barlow tracking-widest uppercase">
                    {brandsCaption}
                </p>
            </section>

            {/* Featured products */}
            {featured.length > 0 && (
                <section className="bg-[#141414] py-20 px-12">
                    <div className="flex items-baseline justify-between mb-10 max-w-5xl mx-auto">
                        <h2 className="font-bebas text-4xl tracking-widest text-white">
                            FEATURED <span className="text-[#D0111A]">PRODUCTS</span>
                        </h2>
                        <Link
                            href="/shop"
                            className="font-barlow text-xs font-bold tracking-[2px] uppercase text-[#D0111A] hover:text-white transition-colors"
                        >
                            View All →
                        </Link>
                    </div>
                    <div className="grid grid-cols-4 gap-1 max-w-5xl mx-auto">
                        {featured.map(p => (
                            <Link
                                key={p.id}
                                href={`/products/${p.id}`}
                                className="group bg-[#1A1A1A] border border-white/7 hover:border-[#D0111A] transition-colors overflow-hidden block"
                            >
                                <div className="aspect-square bg-[#1E1E1E] flex items-center justify-center overflow-hidden">
                                    {p.image_url
                                        ? <img src={p.image_url} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"/>
                                        : <span className="text-5xl">🎮</span>
                                    }
                                </div>
                                <div className="p-4 border-t border-white/7">
                                    <div className="font-barlow text-[9px] font-bold tracking-[3px] uppercase text-[#D0111A] mb-1">{p.brand}</div>
                                    <div className="font-barlow text-sm font-bold text-white mb-2 leading-tight">{p.name}</div>
                                    <div className="font-bebas text-lg text-white">
                                        PHP {Number(p.price).toLocaleString('en-PH', { minimumFractionDigits: 2 })}
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </section>
            )}
        </Layout>
    );
}