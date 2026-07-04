import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Eye, EyeOff, LockKeyhole } from 'lucide-react';

const ResetPassword = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const token = searchParams.get('token');
    const userId = searchParams.get('id');

    const [formData, setFormData] = useState({
        password: '',
        confirmPassword: '',
    });

    const [showPassword, setShowPassword] = useState(false);
    const [status, setStatus] = useState({ type: '', message: '' });
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (!token) {
            setStatus({ type: 'error', message: 'Invalid or missing reset token.' });
        }
    }, [token]);

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            return setStatus({ type: 'error', message: 'Passwords do not match.' });
        }

        if (formData.password.length < 8) {
            return setStatus({ type: 'error', message: 'Password must be at least 8 characters long.' });
        }

        setIsLoading(true);
        setStatus({ type: '', message: '' });

        try {
            // Adjust the base URL to match your backend setup
             await axios.post('/api/auth/reset-pass', {
                token,
                userId,
                password: formData.password,
            });

            setStatus({ type: 'success', message: 'Password reset successfully. Redirecting...' });

            setTimeout(() => navigate('/'), 2000);

        } catch (error) {
            setStatus({
                type: 'error',
                message: error.response?.data?.message || 'Failed to reset password. The link may have expired.'
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-zinc-950 text-zinc-200 font-sans selection:bg-zinc-700 selection:text-white">
            <div className="w-full max-w-md p-8 bg-zinc-900/50 backdrop-blur-md border border-zinc-800 rounded-xl shadow-2xl">

                <div className="flex flex-col items-center mb-8">
                    <div className="p-3 bg-zinc-800/50 rounded-full mb-4 border border-zinc-700">
                        <LockKeyhole size={24} className="text-zinc-300" />
                    </div>
                    <h2 className="text-2xl font-semibold tracking-tight text-white">Create New Password</h2>
                    <p className="text-sm text-zinc-400 mt-2 text-center">
                        Your new password must be different from previous used passwords.
                    </p>
                </div>

                {status.message && (
                    <div className={`p-4 mb-6 text-sm rounded-lg border ${
                        status.type === 'success'
                            ? 'bg-green-950/30 border-green-900 text-green-400'
                            : 'bg-red-950/30 border-red-900 text-red-400'
                    }`}>
                        {status.message}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="space-y-1">
                        <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider">New Password</label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                value={formData.password}
                                onChange={handleInputChange}
                                required
                                disabled={!token || isLoading}
                                className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-lg focus:outline-none focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500 transition-colors text-white placeholder-zinc-600"
                                placeholder="••••••••"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors"
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider">Confirm Password</label>
                        <input
                            type={showPassword ? "text" : "password"}
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleInputChange}
                            required
                            disabled={!token || isLoading}
                            className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-lg focus:outline-none focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500 transition-colors text-white placeholder-zinc-600"
                            placeholder="••••••••"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={!token || isLoading}
                        className="w-full py-3 px-4 mt-4 bg-white text-black font-medium rounded-lg hover:bg-zinc-200 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-zinc-950 focus:ring-white disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? 'Resetting...' : 'Reset Password'}
                    </button>
                </form>

            </div>
        </div>
    );
};

export default ResetPassword;