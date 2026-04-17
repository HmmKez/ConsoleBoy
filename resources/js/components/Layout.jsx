import { Link, usePage, router } from '@inertiajs/react';
import { useState } from 'react';
import AuthModal from './AuthModal';

function Navbar({ onAuthClick }) {
    const { url, props } = usePage();
    const user      = props.auth?.user;
    const cartCount = props.cartCount ?? 0;

    const links = [
        { href: '/',      label: 'Home' },
        { href: '/about', label: 'About' },
        { href: '/shop',  label: 'Shop' },
    ];

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-12 h-16 bg-[#0E0E0E] border-b-2 border-[#D0111A]">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 font-bebas text-2xl tracking-widest text-white">
                CONSOLE<span className="text-[#D0111A]">BOY</span>
                <svg className="w-6 h-6 fill-[#D0111A]" viewBox="0 0 24 24">
                    <path d="M21 6H3c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-10 7H8v3H6v-3H3v-2h3V8h2v3h3v2zm4.5 2c-.83 0-1.5-.67-1.5-1.5S14.67 12 15.5 12s1.5.67 1.5 1.5S16.33 15 15.5 15zm3-3c-.83 0-1.5-.67-1.5-1.5S17.67 10 18.5 10s1.5.67 1.5 1.5S19.33 12 18.5 12z"/>
                </svg>
            </Link>

            {/* Nav Links */}
            <ul className="flex gap-10 list-none">
                {links.map(({ href, label }) => {
                    const active = url === href || (href !== '/' && url.startsWith(href));
                    return (
                        <li key={href}>
                            <Link
                                href={href}
                                className={`font-barlow text-xs font-bold tracking-[3px] uppercase transition-colors relative pb-1
                                    ${active ? 'text-[#D0111A]' : 'text-white/60 hover:text-white'}`}
                            >
                                {label}
                                {active && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#D0111A]" />}
                            </Link>
                        </li>
                    );
                })}
            </ul>

            {/* Right side */}
            <div className="flex items-center gap-5">
                {user ? (
                    <>
                    {/* Profile icon — links to profile page */}
                    <Link
                        href="/profile"
                        className="flex items-center gap-2 text-white/60 hover:text-white transition-colors group"
                        title="My Profile"
                    >
                        <div className="w-7 h-7 rounded-full bg-[#D0111A]/20 border border-[#D0111A]/40 flex items-center justify-center group-hover:border-[#D0111A] transition-colors">
                            <svg className="w-3.5 h-3.5 fill-none stroke-current" strokeWidth="1.8" viewBox="0 0 24 24">
                                <circle cx="12" cy="7" r="4"/>
                                <path d="M5.5 20c0-3.6 2.9-6.5 6.5-6.5s6.5 2.9 6.5 6.5"/>
                            </svg>
                        </div>
                        <span className="font-barlow text-xs font-bold tracking-[2px] uppercase hidden lg:block">
                            {user.first_name}
                        </span>
                    </Link>

                    {/* Cart icon with badge */}
                    <Link href="/cart" className="relative text-white/60 hover:text-white transition-colors">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                            <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
                            <line x1="3" y1="6" x2="21" y2="6"/>
                            <path d="M16 10a4 4 0 01-8 0"/>
                        </svg>
                        {cartCount > 0 && (
                            <span className="absolute -top-2 -right-2 bg-[#D0111A] text-white text-[9px] font-bold font-barlow w-4 h-4 rounded-full flex items-center justify-center">
                                {cartCount > 9 ? '9+' : cartCount}
                            </span>
                        )}
                    </Link>

                    {/* Sign out */}
                    <button
                        onClick={() => router.post('/logout')}
                        className="font-barlow text-xs font-bold tracking-[3px] uppercase text-white/40 hover:text-white transition-colors"
                    >
                        Sign Out
                    </button>
                </>
            ) : (
                <button
                    onClick={() => onAuthClick('login')}
                    className="font-barlow text-xs font-bold tracking-[3px] uppercase text-white/60 hover:text-white transition-colors"
                >
                    Sign In
                </button>
            )}
            </div>
        </nav>
    );
}

function Footer() {
    return (
        <footer className="bg-[#0A0A0A] border-t-2 border-[#D0111A]">
            <div className="grid grid-cols-3 gap-12 px-12 py-14">
                <div>
                    <div className="font-bebas text-2xl tracking-widest mb-3">
                        CONSOLE<span className="text-[#D0111A]">BOY</span>
                    </div>
                    <p className="text-sm text-white/40">Level up your game!</p>
                </div>
                <div>
                    <h4 className="font-barlow text-[10px] font-bold tracking-[3px] uppercase text-[#D0111A] mb-4">Navigation</h4>
                    <ul className="space-y-2 text-sm text-white/45">
                        {[['Home','/'],['About','/about'],['Shop','/shop']].map(([l,h]) => (
                            <li key={l}><Link href={h} className="hover:text-white transition-colors">{l}</Link></li>
                        ))}
                    </ul>
                </div>
                <div>
                    <h4 className="font-barlow text-[10px] font-bold tracking-[3px] uppercase text-[#D0111A] mb-4">Contact Us</h4>
                    <p className="text-sm text-white/45">09505208091</p>
                    <p className="text-sm text-white/45">conchakent@gmail.com</p>
                </div>
            </div>
            <div className="border-t border-white/5 px-12 py-4">
                <p className="text-center text-white/20 text-xs font-barlow">We give you the best of the best!</p>
            </div>
        </footer>
    );
}

export default function Layout({ children }) {
    const [authModal, setAuthModal] = useState(null);

    return (
        <div className="min-h-screen flex flex-col">
            <Navbar onAuthClick={(mode) => setAuthModal(mode)} />
            <main className="flex-1 pt-16">{children}</main>
            <Footer />
            {authModal && (
                <AuthModal
                    mode={authModal}
                    onClose={() => setAuthModal(null)}
                    onSwitch={(m) => setAuthModal(m)}
                />
            )}
        </div>
    );
}