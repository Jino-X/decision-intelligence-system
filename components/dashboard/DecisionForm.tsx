'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { Briefcase, MapPin, Lightbulb, Loader2, Sparkles, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import type { DecisionInputs, DecisionType } from '@/types';

const decisionSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters').max(120),
  context: z.string().min(20, 'Please provide more context (at least 20 characters)').max(1000),
  currentSalary: z.coerce.number().positive().optional().or(z.literal('')),
  proposedSalary: z.coerce.number().positive().optional().or(z.literal('')),
  currentLocation: z.string().max(80).optional().or(z.literal('')),
  targetLocation: z.string().max(80).optional().or(z.literal('')),
  timeframe: z.string().optional().or(z.literal('')),
});

type FormData = z.infer<typeof decisionSchema>;

const PRIORITIES = ['Career growth', 'Work-life balance', 'Financial security', 'Family', 'Adventure', 'Stability', 'Impact', 'Flexibility'];
const LIFESTYLE_FACTORS = ['Remote work', 'Urban lifestyle', 'Outdoor activities', 'Travel', 'Community', 'Health & fitness', 'Culture & arts', 'Social life'];

interface DecisionFormProps {
  onSubmit: (inputs: DecisionInputs) => Promise<void>;
  isLoading: boolean;
}

export function DecisionForm({ onSubmit, isLoading }: DecisionFormProps) {
  const [activeTab, setActiveTab] = useState<DecisionType>('job-switch');
  const [selectedPriorities, setSelectedPriorities] = useState<string[]>([]);
  const [selectedLifestyle, setSelectedLifestyle] = useState<string[]>([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } = useForm<any>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(decisionSchema) as any,
  });

  const toggleItem = (
    item: string,
    list: string[],
    setList: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    setList(list.includes(item) ? list.filter(i => i !== item) : [...list, item]);
  };

  const handleFormSubmit = async (data: FormData) => {
    const inputs: DecisionInputs = {
      decisionType: activeTab,
      title: data.title,
      context: data.context,
      priorities: selectedPriorities,
      lifestyle: selectedLifestyle,
      timeframe: data.timeframe || undefined,
      ...(activeTab === 'job-switch' && {
        currentSalary: data.currentSalary ? Number(data.currentSalary) : undefined,
        proposedSalary: data.proposedSalary ? Number(data.proposedSalary) : undefined,
      }),
      ...(activeTab === 'relocation' && {
        currentLocation: data.currentLocation || undefined,
        targetLocation: data.targetLocation || undefined,
      }),
    };
    await onSubmit(inputs);
  };

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm h-full">
      <div className="p-6 border-b border-white/10">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-indigo-400" />
          Decision Engine
        </h2>
        <p className="text-slate-400 text-sm mt-1">Describe your decision and get AI-powered analysis</p>
      </div>

      <form onSubmit={handleSubmit(handleFormSubmit)} className="p-6 space-y-6">
        {/* Decision type tabs */}
        <div>
          <Label className="mb-3 block">Decision Type</Label>
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as DecisionType)}>
            <TabsList className="w-full grid grid-cols-3">
              <TabsTrigger value="job-switch" className="flex items-center gap-1.5 text-xs">
                <Briefcase className="h-3.5 w-3.5" /> Job Switch
              </TabsTrigger>
              <TabsTrigger value="relocation" className="flex items-center gap-1.5 text-xs">
                <MapPin className="h-3.5 w-3.5" /> Relocation
              </TabsTrigger>
              <TabsTrigger value="custom" className="flex items-center gap-1.5 text-xs">
                <Lightbulb className="h-3.5 w-3.5" /> Custom
              </TabsTrigger>
            </TabsList>

            {/* Job Switch Fields */}
            <TabsContent value="job-switch" className="mt-4 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="currentSalary">Current Salary ($/yr)</Label>
                  <Input id="currentSalary" type="number" placeholder="75000" {...register('currentSalary')} />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="proposedSalary">New Salary ($/yr)</Label>
                  <Input id="proposedSalary" type="number" placeholder="95000" {...register('proposedSalary')} />
                </div>
              </div>
            </TabsContent>

            {/* Relocation Fields */}
            <TabsContent value="relocation" className="mt-4 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="currentLocation">Current City</Label>
                  <Input id="currentLocation" placeholder="New York, NY" {...register('currentLocation')} />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="targetLocation">Target City</Label>
                  <Input id="targetLocation" placeholder="Austin, TX" {...register('targetLocation')} />
                </div>
              </div>
            </TabsContent>

            {/* Custom – no extra fields */}
            <TabsContent value="custom" className="mt-4">
              <p className="text-slate-400 text-sm">Describe your custom decision in the fields below.</p>
            </TabsContent>
          </Tabs>
        </div>

        {/* Decision title */}
        <div className="space-y-1.5">
          <Label htmlFor="title">Decision Title</Label>
          <Input
            id="title"
            placeholder="e.g. Should I accept the senior engineer role at Stripe?"
            {...register('title')}
            aria-invalid={!!errors.title}
          />
          {errors.title && <p className="text-xs text-red-400">{errors.title.message as string}</p>}
        </div>

        {/* Context */}
        <div className="space-y-1.5">
          <Label htmlFor="context">Describe Your Situation</Label>
          <Textarea
            id="context"
            placeholder="Provide details about your current situation, what you're considering, and any relevant factors..."
            rows={4}
            {...register('context')}
            aria-invalid={!!errors.context}
          />
          {errors.context && <p className="text-xs text-red-400">{errors.context.message as string}</p>}
        </div>

        {/* Priorities */}
        <div className="space-y-2">
          <Label>Your Priorities <span className="text-slate-500 font-normal">(select all that apply)</span></Label>
          <div className="flex flex-wrap gap-2">
            {PRIORITIES.map(p => (
              <button
                key={p}
                type="button"
                onClick={() => toggleItem(p, selectedPriorities, setSelectedPriorities)}
                className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
                  selectedPriorities.includes(p)
                    ? 'bg-indigo-600/30 border-indigo-500/60 text-indigo-300'
                    : 'bg-white/5 border-white/10 text-slate-400 hover:border-white/20 hover:text-white'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* Lifestyle */}
        <div className="space-y-2">
          <Label>Lifestyle Factors <span className="text-slate-500 font-normal">(select all that apply)</span></Label>
          <div className="flex flex-wrap gap-2">
            {LIFESTYLE_FACTORS.map(f => (
              <button
                key={f}
                type="button"
                onClick={() => toggleItem(f, selectedLifestyle, setSelectedLifestyle)}
                className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
                  selectedLifestyle.includes(f)
                    ? 'bg-purple-600/30 border-purple-500/60 text-purple-300'
                    : 'bg-white/5 border-white/10 text-slate-400 hover:border-white/20 hover:text-white'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Timeframe */}
        <div className="space-y-1.5">
          <Label htmlFor="timeframe">Decision Timeframe <span className="text-slate-500 font-normal">(optional)</span></Label>
          <Input id="timeframe" placeholder="e.g. 2 weeks, 1 month" {...register('timeframe')} />
        </div>

        <Button
          type="submit"
          variant="gradient"
          size="lg"
          className="w-full"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Analyzing with AI...
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4" />
              Analyze My Decision
              <ChevronRight className="h-4 w-4" />
            </>
          )}
        </Button>
      </form>
    </div>
  );
}
