import { useState } from 'react';
import { router } from '@inertiajs/react';
import axios from 'axios';

export default function AdminLogin() {
    const [form, setForm]     = useState({ email: '', password: '' });
    const [error, setError]   = useState('');
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e) {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const { data } = await axios.post('/admin/login', form);
            if (data.success) router.visit('/admin/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Invalid credentials.');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen bg-[#0E0E0E] flex items-center justify-center">
            <div className="flex w-[480px] shadow-2xl">
                {/* Left */}
                <div className="w-2/5 bg-[#D0111A] flex flex-col items-center justify-center p-8">
                    <svg className="w-16 h-16 fill-white mb-4" viewBox="0 0 24 24">
                        <path d="M21 6H3c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-10 7H8v3H6v-3H3v-2h3V8h2v3h3v2zm4.5 2c-.83 0-1.5-.67-1.5-1.5S14.67 12 15.5 12s1.5.67 1.5 1.5S16.33 15 15.5 15zm3-3c-.83 0-1.5-.67-1.5-1.5S17.67 10 18.5 10s1.5.67 1.5 1.5S19.33 12 18.5 12z"/>
                    </svg>
                    <div className="font-bebas text-2xl tracking-widest text-white text-center">CONSOLE<br/>BOY</div>
                    <div className="font-barlow text-[10px] font-bold tracking-[3px] uppercase text-white/60 mt-1">Admin Panel</div>
                </div>

                {/* Right */}
                <div className="flex-1 bg-[#141414] p-8">
                    <p className="font-barlow text-[10px] font-bold tracking-[3px] uppercase text-white/40 mb-1">Welcome Back</p>
                    <h2 className="font-bebas text-3xl tracking-widest text-white mb-1">ADMIN LOGIN</h2>
                    <p className="font-barlow text-xs text-white/30 mb-6">Sign in to manage your store</p>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="font-barlow text-[10px] font-bold tracking-[2px] uppercase text-white/50 block mb-1">Email</label>
                            <input
                                type="email" required
                                value={form.email}
                                onChange={e => setForm({ ...form, email: e.target.value })}
                                className="w-full bg-[#1E1E1E] border border-white/10 text-white text-sm px-3 py-2.5 outline-none focus:border-[#D0111A] transition-colors"
                                placeholder="admin@consoleboy.com"
                            />
                        </div>
                        <div>
                            <label className="font-barlow text-[10px] font-bold tracking-[2px] uppercase text-white/50 block mb-1">Password</label>
                            <input
                                type="password" required
                                value={form.password}
                                onChange={e => setForm({ ...form, password: e.target.value })}
                                className="w-full bg-[#1E1E1E] border border-white/10 text-white text-sm px-3 py-2.5 outline-none focus:border-[#D0111A] transition-colors"
                            />
                        </div>

                        {error && <p className="text-[#D0111A] text-xs font-barlow">{error}</p>}

                        <button
                            type="submit" disabled={loading}
                            className="w-full bg-[#D0111A] hover:bg-[#9E0D14] text-white font-barlow text-sm font-bold tracking-[3px] uppercase py-3 transition-colors disabled:opacity-60"
                        >
                            {loading ? 'Signing in...' : 'Sign In'}
                        </button>

                        <div className="mt-4 text-center">
                            <a
                                href="/"
                                className="font-barlow text-xs text-white/30 hover:text-white transition-colors tracking-[2px] uppercase"
                            >
                                ← Back to Store
                            </a>
                        </div>
                    </form>
                    
                </div>
            </div>
        </div>
    );
}