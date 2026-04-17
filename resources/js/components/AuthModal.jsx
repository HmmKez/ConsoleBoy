import { useState } from 'react';
import { router } from '@inertiajs/react';
import axios from 'axios';

function LoginForm({ onSwitch, onClose }) {
    const [form, setForm]       = useState({ email: '', password: '' });
    const [error, setError]     = useState('');
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e) {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const { data } = await axios.post('/login', form);
            if (data.success) {
                router.reload();
                onClose();
            }
        } catch (err) {
            setError(
                err.response?.data?.message ||
                err.response?.data?.errors?.email?.[0] ||
                'Login failed. Please try again.'
            );
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="flex flex-col justify-center px-10 py-10">
            <p className="font-barlow text-[10px] font-bold tracking-[4px] uppercase text-white/50 mb-1">
                Welcome Back
            </p>
            <h2 className="font-bebas text-5xl tracking-widest text-white leading-none">SIGN IN</h2>
            <p className="font-bebas text-lg tracking-[3px] text-white/60 mb-8">TO CONSOLEBOY</p>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div>
                    <label className="font-barlow text-[10px] font-bold tracking-[3px] uppercase text-white/60 block mb-1.5">
                        Email
                    </label>
                    <input
                        type="email" required
                        value={form.email}
                        onChange={e => setForm({ ...form, email: e.target.value })}
                        placeholder="your@email.com"
                        className="w-full bg-black/30 border border-white/20 focus:border-white text-white text-sm px-4 py-3 outline-none transition-colors placeholder-white/20"
                    />
                </div>
                <div>
                    <label className="font-barlow text-[10px] font-bold tracking-[3px] uppercase text-white/60 block mb-1.5">
                        Password
                    </label>
                    <input
                        type="password" required
                        value={form.password}
                        onChange={e => setForm({ ...form, password: e.target.value })}
                        placeholder="••••••••"
                        className="w-full bg-black/30 border border-white/20 focus:border-white text-white text-sm px-4 py-3 outline-none transition-colors placeholder-white/20"
                    />
                </div>

                {error && (
                    <div className="bg-black/20 border border-white/20 px-3 py-2">
                        <p className="text-yellow-300 text-xs font-barlow">{error}</p>
                    </div>
                )}

                <button
                    type="submit" disabled={loading}
                    className="w-full bg-white text-black font-barlow text-sm font-bold tracking-[3px] uppercase py-3.5 hover:bg-white/90 transition-colors disabled:opacity-60 flex items-center justify-center gap-2 mt-1"
                >
                    {loading
                        ? <><span className="w-3.5 h-3.5 border-2 border-black/20 border-t-black rounded-full animate-spin"/>Signing in...</>
                        : 'Login'
                    }
                </button>
            </form>

            <div className="flex items-center gap-3 my-5">
                <div className="flex-1 h-px bg-white/15"/>
                <span className="font-barlow text-[10px] text-white/30 tracking-[2px] uppercase">or</span>
                <div className="flex-1 h-px bg-white/15"/>
            </div>

            <button
                onClick={() => onSwitch('register')}
                className="w-full border border-white/30 hover:border-white text-white font-barlow text-xs font-bold tracking-[2px] uppercase py-3 transition-colors"
            >
                Create an Account
            </button>

            <button
                onClick={() => { onClose(); router.visit('/admin/login'); }}
                className="mt-5 font-barlow text-[9px] tracking-[2px] uppercase text-white/25 hover:text-white/60 transition-colors text-center"
            >
                Login as Admin →
            </button>
        </div>
    );
}

function RegisterForm({ onSwitch, onClose }) {
    const [form, setForm] = useState({
        first_name: '', last_name: '',
        email: '', password: '', password_confirmation: '',
    });
    const [errors, setErrors]   = useState({});
    const [general, setGeneral] = useState('');
    const [loading, setLoading] = useState(false);

    function setField(name, value) {
        setForm(p => ({ ...p, [name]: value }));
        if (errors[name]) setErrors(p => ({ ...p, [name]: null }));
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setLoading(true);
        setErrors({});
        setGeneral('');

        if (form.password !== form.password_confirmation) {
            setErrors({ password_confirmation: ['Passwords do not match.'] });
            setLoading(false);
            return;
        }

        try {
            const { data } = await axios.post('/register', form);
            if (data.success) {
                onSwitch('login');
            }
        } catch (err) {
            if (err.response?.status === 422 && err.response?.data?.errors) {
                setErrors(err.response.data.errors);
            } else {
                setGeneral(
                    err.response?.data?.message ||
                    'Registration failed. Please try again.'
                );
            }
        } finally {
            setLoading(false);
        }
    }

    const fieldClass = (name) =>
        `w-full bg-black/30 border text-white text-sm px-4 py-3 outline-none transition-colors placeholder-white/20
        ${errors[name] ? 'border-yellow-400' : 'border-white/20 focus:border-white'}`;

    return (
        <div className="flex flex-col justify-center px-10 py-8">
            <p className="font-barlow text-[10px] font-bold tracking-[4px] uppercase text-white/50 mb-1">
                New Member
            </p>
            <h2 className="font-bebas text-5xl tracking-widest text-white leading-none">CREATE</h2>
            <p className="font-bebas text-lg tracking-[3px] text-white/60 mb-6">YOUR ACCOUNT</p>

            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <label className="font-barlow text-[10px] font-bold tracking-[3px] uppercase text-white/60 block mb-1.5">First Name</label>
                        <input type="text" required value={form.first_name} onChange={e => setField('first_name', e.target.value)} placeholder="Juan" className={fieldClass('first_name')}/>
                        {errors.first_name && <p className="text-yellow-300 text-[10px] mt-1">{errors.first_name[0]}</p>}
                    </div>
                    <div>
                        <label className="font-barlow text-[10px] font-bold tracking-[3px] uppercase text-white/60 block mb-1.5">Last Name</label>
                        <input type="text" required value={form.last_name} onChange={e => setField('last_name', e.target.value)} placeholder="dela Cruz" className={fieldClass('last_name')}/>
                        {errors.last_name && <p className="text-yellow-300 text-[10px] mt-1">{errors.last_name[0]}</p>}
                    </div>
                </div>

                <div>
                    <label className="font-barlow text-[10px] font-bold tracking-[3px] uppercase text-white/60 block mb-1.5">Email</label>
                    <input type="email" required value={form.email} onChange={e => setField('email', e.target.value)} placeholder="your@email.com" className={fieldClass('email')}/>
                    {errors.email && <p className="text-yellow-300 text-[10px] mt-1">{errors.email[0]}</p>}
                </div>

                <div>
                    <label className="font-barlow text-[10px] font-bold tracking-[3px] uppercase text-white/60 block mb-1.5">Password</label>
                    <input type="password" required value={form.password} onChange={e => setField('password', e.target.value)} placeholder="Min. 8 characters" className={fieldClass('password')}/>
                    {errors.password && <p className="text-yellow-300 text-[10px] mt-1">{errors.password[0]}</p>}
                </div>

                <div>
                    <label className="font-barlow text-[10px] font-bold tracking-[3px] uppercase text-white/60 block mb-1.5">Confirm Password</label>
                    <input type="password" required value={form.password_confirmation} onChange={e => setField('password_confirmation', e.target.value)} placeholder="••••••••" className={fieldClass('password_confirmation')}/>
                    {errors.password_confirmation && <p className="text-yellow-300 text-[10px] mt-1">{errors.password_confirmation[0]}</p>}
                </div>

                {general && (
                    <div className="bg-black/20 border border-white/20 px-3 py-2">
                        <p className="text-yellow-300 text-xs font-barlow">{general}</p>
                    </div>
                )}

                <button
                    type="submit" disabled={loading}
                    className="w-full bg-white text-black font-barlow text-sm font-bold tracking-[3px] uppercase py-3.5 hover:bg-white/90 transition-colors disabled:opacity-60 flex items-center justify-center gap-2 mt-2"
                >
                    {loading
                        ? <><span className="w-3.5 h-3.5 border-2 border-black/20 border-t-black rounded-full animate-spin"/>Creating...</>
                        : 'Create Account'
                    }
                </button>
            </form>

            <div className="flex items-center gap-3 my-4">
                <div className="flex-1 h-px bg-white/15"/>
                <span className="font-barlow text-[10px] text-white/30 tracking-[2px] uppercase">or</span>
                <div className="flex-1 h-px bg-white/15"/>
            </div>

            <button
                onClick={() => onSwitch('login')}
                className="w-full border border-white/30 hover:border-white text-white font-barlow text-xs font-bold tracking-[2px] uppercase py-3 transition-colors"
            >
                Already have an account? Sign In
            </button>
        </div>
    );
}

export default function AuthModal({ mode, onClose, onSwitch }) {
    return (
        <div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm"
            onClick={e => e.target === e.currentTarget && onClose()}
        >
            <div className="relative flex w-[560px] max-w-[95vw] shadow-2xl max-h-[95vh] overflow-y-auto">
                {/* Left — dark panel with logo */}
                <div className="w-[180px] bg-[#0A0A0A] flex flex-col items-center justify-center flex-shrink-0 py-10 px-6 border-r border-white/5">
                    <svg className="w-14 h-14 fill-white mb-4 opacity-70" viewBox="0 0 24 24">
                        <path d="M21 6H3c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-10 7H8v3H6v-3H3v-2h3V8h2v3h3v2zm4.5 2c-.83 0-1.5-.67-1.5-1.5S14.67 12 15.5 12s1.5.67 1.5 1.5S16.33 15 15.5 15zm3-3c-.83 0-1.5-.67-1.5-1.5S17.67 10 18.5 10s1.5.67 1.5 1.5S19.33 12 18.5 12z"/>
                    </svg>
                    <div className="font-bebas text-lg tracking-[3px] text-white text-center leading-tight">
                        CONSOLE<br/><span className="text-[#D0111A]">BOY</span>
                    </div>
                </div>

                {/* Right — red form panel */}
                <div className="flex-1 bg-[#C8101A] relative">
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 text-white/60 hover:text-white text-lg font-bold z-10 w-7 h-7 flex items-center justify-center transition-colors"
                    >
                        ✕
                    </button>
                    {mode === 'login'
                        ? <LoginForm onSwitch={onSwitch} onClose={onClose} />
                        : <RegisterForm onSwitch={onSwitch} onClose={onClose} />
                    }
                </div>
            </div>
        </div>
    );
}