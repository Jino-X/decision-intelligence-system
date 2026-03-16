import React from 'react';
import Link from 'next/link';
import { Brain } from 'lucide-react';
import { AuthForm } from '@/components/auth/AuthForm';

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4">
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-purple-600/8 rounded-full blur-[100px]" />
      </div>

      <Link href="/" className="flex items-center gap-2 mb-10 group">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 shadow-lg shadow-indigo-500/25">
          <Brain className="h-5 w-5 text-white" />
        </div>
        <span className="font-bold text-white text-xl">
          AI Life <span className="text-indigo-400">OS</span>
        </span>
      </Link>

      <AuthForm mode="register" />
    </div>
  );
}
