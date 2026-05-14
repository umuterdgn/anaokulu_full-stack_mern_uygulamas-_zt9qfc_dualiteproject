import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Loader2, Lock } from 'lucide-react';
import PageTransition from '../components/PageTransition';

const loginSchema = z.object({
  email: z.string().email('Geçerli bir e-posta adresi giriniz.'),
  password: z.string().min(6, 'Şifre en az 6 karakter olmalıdır.'),
});

type LoginFormInputs = z.infer<typeof loginSchema>;

const Login: React.FC = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormInputs>({
    resolver: zodResolver(loginSchema),
  });
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const onSubmit = async (data: LoginFormInputs) => {
    setLoading(true);
    setErrorMsg('');
    try {
      const response = await axios.post('/api/login', data);
      login(response.data.token);
      navigate('/admin/dashboard');
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || 'Giriş başarısız. Lütfen bilgilerinizi kontrol edin.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
          <div className="flex justify-center mb-6">
            <div className="bg-pastel-orange p-4 rounded-full">
              <Lock className="w-8 h-8 text-white" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-8">Admin Girişi</h2>
          
          {errorMsg && (
            <div className="bg-red-50 text-red-500 p-3 rounded-lg mb-4 text-sm text-center">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">E-posta</label>
              <input 
                type="email" 
                {...register('email')}
                className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 ${errors.email ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-pastel-orange'}`}
                placeholder="admin@mutlucocuklar.com"
              />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Şifre</label>
              <input 
                type="password" 
                {...register('password')}
                className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 ${errors.password ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-pastel-orange'}`}
                placeholder="••••••"
              />
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-gray-800 text-white font-bold py-3 rounded-lg hover:bg-gray-700 transition flex justify-center items-center gap-2 disabled:opacity-70 mt-6"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Giriş Yap'}
            </button>
          </form>
          <div className="mt-4 text-center text-xs text-gray-400">
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default Login;
