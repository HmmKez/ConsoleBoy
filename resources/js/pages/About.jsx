import Layout from '../components/Layout';

export default function About({ content = {} }) {

    // Debug — remove after confirming it works
    console.log('About content from server:', content);

    const heroImage    = content.hero_image    || 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1400&q=80';
    const heroTitle    = content.hero_title    || 'ABOUT US';
    const heroSubtitle = content.hero_subtitle || 'We are cool gamers';
    const statSales    = content.stat_sales    || '676,676';
    const statCust     = content.stat_customers|| '676,676';
    const founderName  = content.founder_name  || 'Kent Augustine Concha';
    const founderBio   = content.founder_bio   || 'His name is Kent Augustine Concha. He likes to eat a lot, and I mean a lot. yes.';
    const founderImg   = content.founder_image || '';

    return (
        <Layout>
            {/* Hero */}
            <section className="relative h-[380px] flex items-center justify-center overflow-hidden">
                <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: `url('${heroImage}')` }}
                />
                <div className="absolute inset-0 bg-black/60" />
                <div className="relative z-10 text-center">
                    <h1 className="font-bebas text-6xl tracking-widest text-white mb-4">
                        {heroTitle}
                    </h1>
                    <p className="text-white/70 text-base">{heroSubtitle}</p>
                </div>
            </section>

            {/* Stats strip */}
            <div className="bg-[#D0111A] py-5 flex items-center justify-around">
                <p className="font-barlow text-base font-bold tracking-wide text-white">
                    Over <strong>{statSales} Sales</strong>{' '}
                    <span className="font-black tracking-widest">WORLDWIDE!</span>
                </p>
                <p className="font-barlow text-base font-bold tracking-wide text-white">
                    <strong>{statCust} Satisfied</strong>{' '}
                    <span className="font-black tracking-widest">CUSTOMERS!</span>
                </p>
            </div>

            {/* Founder */}
            <section className="bg-[#0E0E0E] py-20 px-16">
                <div className="max-w-4xl mx-auto flex items-center gap-16">
                    <div className="flex-1">
                        <h2 className="font-bebas text-4xl tracking-widest text-white mb-2">
                            THE FOUNDER
                        </h2>
                        <p className="font-barlow text-[10px] font-bold tracking-[3px] uppercase text-[#D0111A] mb-4">
                            {founderName}
                        </p>
                        <p className="text-white/60 text-sm leading-relaxed">
                            {founderBio}
                        </p>
                    </div>

                    {/* Founder photo */}
                    <div className="w-48 h-56 flex-shrink-0 border border-white/10 overflow-hidden bg-[#1A1A1A] flex items-center justify-center">
                        {founderImg && founderImg.trim() !== '' ? (
                            <img
                                src={founderImg}
                                alt={founderName}
                                className="w-full h-full object-cover object-top"
                                onError={e => {
                                    // If image fails to load show fallback
                                    e.target.style.display = 'none';
                                    e.target.nextSibling.style.display = 'flex';
                                }}
                            />
                        ) : null}
                        <div
                            className="w-full h-full flex flex-col items-center justify-center text-white/20"
                            style={{ display: founderImg && founderImg.trim() !== '' ? 'none' : 'flex' }}
                        >
                            <span className="text-6xl">👤</span>
                            <span className="font-barlow text-[10px] mt-2 tracking-[2px] uppercase">No photo</span>
                        </div>
                    </div>
                </div>
            </section>
        </Layout>
    );
}