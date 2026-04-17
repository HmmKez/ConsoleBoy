import { Link, usePage, router } from '@inertiajs/react';

const navItems = [
    {
        href: '/admin/dashboard', label: 'Dashboard',
        icon: <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>,
    },
    {
        href: '/admin/products', label: 'Products',
        icon: <><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></>,
    },
    {
        href: '/admin/orders', label: 'Orders',
        icon: <><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/></>,
    },
    {
        href: '/admin/content', label: 'Site Content',
        icon: <><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/></>,
    },
    {
        href: '/admin/logs', label: 'Activity Logs',
        icon: <><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></>,
    },
];

export default function AdminLayout({ children, title }) {
    const { url, props } = usePage();
    const admin = props.auth?.admin;

    return (
        <div className="flex h-screen bg-[#0E0E0E] overflow-hidden">
            {/* Sidebar */}
            <aside className="w-56 bg-[#0A0A0A] border-r border-white/7 flex flex-col flex-shrink-0">
                {/* Logo */}
                <div className="h-14 flex items-center px-5 border-b border-white/7 bg-[#D0111A]">
                    <Link href="/admin/dashboard" className="font-bebas text-xl tracking-widest text-white">
                        CONSOLE<span className="opacity-75">BOY</span>
                        <span className="font-barlow text-[9px] font-bold tracking-[2px] uppercase text-white/60 ml-2">Admin</span>
                    </Link>
                </div>

                {/* Nav */}
                <nav className="flex-1 py-4">
                    {navItems.map(({ href, label, icon }) => {
                        const active = url.startsWith(href);
                        return (
                            <Link
                                key={href}
                                href={href}
                                className={`flex items-center gap-3 px-5 py-3 font-barlow text-xs font-bold tracking-[1.5px] uppercase transition-colors border-l-3 border-transparent
                                    ${active
                                        ? 'text-white bg-[#D0111A]/10 border-l-[3px] border-[#D0111A]'
                                        : 'text-white/40 hover:text-white hover:bg-white/3'}`}
                            >
                                <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                    {icon}
                                </svg>
                                {label}
                            </Link>
                        );
                    })}
                </nav>

                {/* Sign out */}
                <div className="border-t border-white/7 p-4">
                    <button
                        onClick={() => router.post('/admin/logout')}
                        className="flex items-center gap-3 w-full px-2 py-2 font-barlow text-xs font-bold tracking-[1.5px] uppercase text-white/30 hover:text-red-400 transition-colors"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/>
                            <polyline points="16 17 21 12 16 7"/>
                            <line x1="21" y1="12" x2="9" y2="12"/>
                        </svg>
                        Sign Out
                    </button>
                </div>
            </aside>

            {/* Main */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Topbar */}
                <header className="h-14 bg-[#0A0A0A] border-b border-white/7 flex items-center justify-between px-6 flex-shrink-0">
                    <h1 className="font-bebas text-xl tracking-widest text-white">{title}</h1>
                    <div className="flex items-center gap-3">
                        <span className="font-barlow text-xs text-white/40">Hello, {admin?.name}</span>
                        <div className="w-7 h-7 rounded-full bg-[#D0111A]/20 border border-[#D0111A]/30 flex items-center justify-center">
                            <span className="text-sm">👤</span>
                        </div>
                    </div>
                </header>

                {/* Content */}
                <main className="flex-1 overflow-y-auto p-6 bg-[#0E0E0E]">
                    {children}
                </main>
            </div>
        </div>
    );
}