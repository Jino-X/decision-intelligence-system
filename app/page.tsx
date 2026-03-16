'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Brain, Shield, Zap, ChevronRight, Sparkles,
  TrendingUp, BarChart3, Lightbulb, ArrowRight,
  CheckCircle2, Star,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

const features = [
  {
    icon: Brain,
    title: 'Life Impact Prediction',
    description: 'AI scores the impact across financial, career, personal, social, and health dimensions.',
    color: 'text-indigo-400',
    bg: 'bg-indigo-500/10 border-indigo-500/20',
  },
  {
    icon: Shield,
    title: 'Risk Analysis',
    description: 'Comprehensive risk breakdown with mitigation strategies for every factor.',
    color: 'text-amber-400',
    bg: 'bg-amber-500/10 border-amber-500/20',
  },
  {
    icon: Zap,
    title: 'Scenario Simulation',
    description: 'Best, most-likely, and worst case scenarios with probability weights.',
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10 border-emerald-500/20',
  },
  {
    icon: Lightbulb,
    title: 'Key Insights',
    description: 'Distilled insights and concrete action items to move forward with confidence.',
    color: 'text-purple-400',
    bg: 'bg-purple-500/10 border-purple-500/20',
  },
];

const steps = [
  { step: '01', title: 'Describe your decision', desc: 'Tell us about your job switch, relocation, or any major life choice.' },
  { step: '02', title: 'AI analyzes everything', desc: 'GPT-4o processes your inputs through our structured decision framework.' },
  { step: '03', title: 'Get clear insights', desc: 'Receive scores, scenarios, risks, and an action plan in seconds.' },
];

const stats = [
  { value: '10K+', label: 'Decisions analyzed' },
  { value: '3', label: 'Decision types' },
  { value: '5', label: 'Life dimensions scored' },
  { value: 'GPT-4o', label: 'Powered by' },
];

const decisionExamples = [
  { type: 'Job Switch', title: 'Senior Engineer @ Stripe vs staying at current role', risk: 'medium', score: 78 },
  { type: 'Relocation', title: 'Moving from New York to Austin for lower cost of living', risk: 'low', score: 84 },
  { type: 'Custom', title: 'Starting a side business while employed full-time', risk: 'high', score: 61 },
];

const riskColors: Record<string, string> = {
  low: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
  medium: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
  high: 'text-red-400 bg-red-500/10 border-red-500/20',
};

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-indigo-600/10 rounded-full blur-[120px]" />
          <div className="absolute top-40 right-0 w-[400px] h-[400px] bg-purple-600/8 rounded-full blur-[100px]" />
          <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-[0.03]" />
        </div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-24 pb-20 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-4 py-1.5 text-sm text-indigo-300 mb-8">
              <Sparkles className="h-3.5 w-3.5" />
              Powered by GPT-4o
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight mb-6">
              Make Life&apos;s Hardest{' '}
              <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Decisions
              </span>
              <br />with AI Confidence
            </h1>

            <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
              AI-powered decision simulation engine that predicts life impact, analyzes risks,
              and simulates scenarios — so you always choose wisely.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button variant="gradient" size="xl" asChild>
                <Link href="/register">
                  <Sparkles className="h-5 w-5" />
                  Start Analyzing Free
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </Button>
              <Button variant="outline" size="xl" asChild>
                <Link href="/login">
                  Sign in to Dashboard
                </Link>
              </Button>
            </div>
          </motion.div>

          {/* Preview cards */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="mt-20 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-4xl mx-auto"
          >
            {decisionExamples.map((ex, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + i * 0.1 }}
                className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm p-4 text-left"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs text-slate-500 font-medium">{ex.type}</span>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-semibold border ${riskColors[ex.risk]}`}>
                    {ex.risk.toUpperCase()}
                  </span>
                </div>
                <p className="text-white text-sm font-medium leading-snug mb-3">{ex.title}</p>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-1.5 rounded-full bg-white/10">
                    <div
                      className="h-1.5 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600"
                      style={{ width: `${ex.score}%` }}
                    />
                  </div>
                  <span className="text-xs text-indigo-400 font-bold">{ex.score}/100</span>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-white/10 bg-white/[0.02]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="text-center"
              >
                <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
                <div className="text-sm text-slate-400">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <motion.h2
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl font-bold text-white mb-4"
            >
              Everything you need to decide{' '}
              <span className="text-indigo-400">confidently</span>
            </motion.h2>
            <p className="text-slate-400 text-lg max-w-xl mx-auto">
              A complete decision intelligence toolkit backed by state-of-the-art AI.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`rounded-2xl border p-6 ${feature.bg}`}
              >
                <div className={`inline-flex h-10 w-10 items-center justify-center rounded-xl mb-4 ${feature.bg}`}>
                  <feature.icon className={`h-5 w-5 ${feature.color}`} />
                </div>
                <h3 className="text-white font-semibold mb-2">{feature.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-24 bg-white/[0.02] border-y border-white/10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <motion.h2
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl font-bold text-white mb-4"
            >
              How it works
            </motion.h2>
            <p className="text-slate-400 text-lg">From question to clarity in seconds.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {steps.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="text-center relative"
              >
                {i < steps.length - 1 && (
                  <div className="hidden md:block absolute top-8 left-[60%] w-[80%] h-px bg-gradient-to-r from-white/10 to-transparent" />
                )}
                <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 text-xl font-bold text-white mb-6 shadow-lg shadow-indigo-500/25">
                  {step.step}
                </div>
                <h3 className="text-white font-semibold text-lg mb-3">{step.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="rounded-3xl border border-indigo-500/20 bg-gradient-to-br from-indigo-600/10 to-purple-600/10 p-12"
          >
            <div className="flex justify-center mb-6">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 shadow-2xl shadow-indigo-500/30">
                <Brain className="h-8 w-8 text-white" />
              </div>
            </div>
            <h2 className="text-4xl font-bold text-white mb-4">
              Ready to decide with confidence?
            </h2>
            <p className="text-slate-400 text-lg mb-8">
              Join thousands of people making better life decisions with AI.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button variant="gradient" size="xl" asChild>
                <Link href="/register">
                  <Sparkles className="h-5 w-5" />
                  Get Started — It&apos;s Free
                </Link>
              </Button>
              <Button variant="outline" size="xl" asChild>
                <Link href="/login">Sign In</Link>
              </Button>
            </div>
            <div className="flex items-center justify-center gap-6 mt-8 text-sm text-slate-500">
              {['No credit card required', 'Free to try', 'Instant results'].map(item => (
                <span key={item} className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" /> {item}
                </span>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
