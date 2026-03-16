'use client';

import Link from 'next/link';
import { Brain, Github, Twitter } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-slate-950/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-600 to-purple-600">
                <Brain className="h-4 w-4 text-white" />
              </div>
              <span className="font-bold text-white text-lg">
                AI Life <span className="text-indigo-400">OS</span>
              </span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed max-w-xs">
              Your personal AI-powered decision engine. Simulate life scenarios, analyze risks, and make confident choices backed by data.
            </p>
            <div className="flex items-center gap-3 mt-4">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-400 hover:text-white transition-colors"
              >
                <Github className="h-5 w-5" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-400 hover:text-white transition-colors"
              >
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Product */}
          <div>
            <h3 className="text-white font-semibold text-sm mb-4">Product</h3>
            <ul className="space-y-2">
              {[
                { label: 'Dashboard', href: '/dashboard' },
                { label: 'Decision History', href: '/history' },
                { label: 'Sign In', href: '/login' },
                { label: 'Get Started', href: '/register' },
              ].map(({ label, href }) => (
                <li key={href}>
                  <Link href={href} className="text-slate-400 hover:text-white text-sm transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Features */}
          <div>
            <h3 className="text-white font-semibold text-sm mb-4">Features</h3>
            <ul className="space-y-2">
              {[
                'Life Impact Prediction',
                'Risk Analysis',
                'Scenario Simulation',
                'Decision History',
                'AI-Powered Insights',
              ].map(feature => (
                <li key={feature} className="text-slate-400 text-sm">
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-slate-500 text-xs">
            &copy; {new Date().getFullYear()} AI Life OS. All rights reserved.
          </p>
          <p className="text-slate-500 text-xs">
            Built with Next.js, Firebase &amp; OpenAI
          </p>
        </div>
      </div>
    </footer>
  );
}
