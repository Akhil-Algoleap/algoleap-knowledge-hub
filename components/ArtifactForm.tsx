'use client';

import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Artifact } from '@/lib/types';
import { ARTIFACT_TYPES, SERVICE_LINES, INDUSTRIES, AUDIENCES } from '@/lib/constants';
import { supabase } from '@/lib/supabase/client';
import { useState } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

export const artifactSchema = z.object({
  title:          z.string().min(1, 'Title is required'),
  description:    z.string().min(1, 'Description is required'),
  artifact_type:  z.string().min(1, 'Type is required'),
  service_line:   z.array(z.string()),
  industry:       z.array(z.string()),
  audience:       z.array(z.string()),
  tech_tags:      z.string().optional(), // Will split into array on save
  onedrive_url:   z.string().url('Must be a valid URL'),
  owner_name:     z.string().min(1, 'Owner name is required'),
  owner_email:    z.string().email('Must be a valid email'),
  status:         z.enum(['current', 'needs-update', 'archived']),
  is_client_safe: z.boolean()
});

type FormData = z.infer<typeof artifactSchema>;

interface ArtifactFormProps {
  artifact?: Artifact;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function ArtifactForm({ artifact, isOpen, onClose, onSuccess }: ArtifactFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const { register, handleSubmit, formState: { errors }, watch, setValue } = useForm<FormData>({
    resolver: zodResolver(artifactSchema),
    defaultValues: artifact ? {
      title: artifact.title,
      description: artifact.description || '',
      artifact_type: artifact.artifact_type,
      service_line: artifact.service_line,
      industry: artifact.industry,
      audience: artifact.audience,
      tech_tags: artifact.tech_tags.join(', '),
      onedrive_url: artifact.onedrive_url,
      owner_name: artifact.owner_name || '',
      owner_email: artifact.owner_email || '',
      status: artifact.status,
      is_client_safe: artifact.is_client_safe
    } : {
      service_line: [],
      industry: [],
      audience: [],
      status: 'current',
      is_client_safe: false
    }
  });

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    setErrorMsg('');
    
    try {
      const formattedData = {
        ...data,
        tech_tags: data.tech_tags ? data.tech_tags.split(',').map(t => t.trim()).filter(Boolean) : [],
      };

      if (artifact) {
        const { error } = await supabase.from('artifacts').update(formattedData).eq('id', artifact.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('artifacts').insert(formattedData);
        if (error) throw error;
      }
      
      onSuccess();
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'Error saving artifact');
    } finally {
      setIsSubmitting(false);
    }
  };

  const MultiSelect = ({ name, options, label, error }: any) => {
    const selected = watch(name) as string[] || [];
    return (
      <div className="mb-6">
        <label className="block text-[11px] font-bold text-[#1e293b] uppercase tracking-wider mb-3">
          {label}
        </label>
        <div className="flex flex-wrap gap-2.5">
          {options.map((opt: string) => {
            const isSelected = selected.includes(opt);
            return (
              <button
                type="button"
                key={opt}
                onClick={() => {
                  if (isSelected) setValue(name, selected.filter(s => s !== opt));
                  else setValue(name, [...selected, opt]);
                }}
                className={cn(
                  "px-4 py-1.5 rounded-full text-[13px] font-medium border transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-[#19593A]",
                  isSelected 
                    ? "bg-[#f0fdf6] border-[#19593A] text-[#19593A]" 
                    : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400"
                )}
              >
                {opt}
              </button>
            );
          })}
        </div>
        {error && <p className="text-red-500 text-xs mt-1.5 font-medium">{error.message}</p>}
      </div>
    );
  };

  const Label = ({ children, required }: { children: React.ReactNode, required?: boolean }) => (
    <label className="block text-[11px] font-bold text-[#1e293b] uppercase tracking-wider mb-2">
      {children} {required && <span className="text-red-500">*</span>}
    </label>
  );

  const inputClasses = "w-full bg-white border border-gray-300 rounded-lg px-3 py-2.5 text-[14px] text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#19593A]/20 focus:border-[#19593A] transition-all shadow-[0_1px_2px_rgba(0,0,0,0.02)]";

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex justify-end"
      >
        <motion.div 
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: "spring", bounce: 0, duration: 0.4 }}
          className="w-full max-w-2xl bg-white h-full shadow-2xl flex flex-col pointer-events-auto"
        >
          <div className="px-7 py-5 border-b border-gray-200 flex justify-between items-start bg-white z-10">
            <div>
              <h2 className="text-[22px] font-bold text-gray-900 tracking-tight">
                {artifact ? 'Edit Artifact' : 'Add New Artifact'}
              </h2>
              <p className="text-[13px] text-gray-500 mt-1 font-medium">Fields marked <span className="text-red-400">*</span> are required</p>
            </div>
            <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors border border-transparent hover:border-gray-200">
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="px-7 py-8 overflow-y-auto flex-grow scrollbar-hide">
            <form id="artifactForm" onSubmit={handleSubmit(onSubmit)} className="space-y-7 max-w-xl">
              
              <div>
                <Label required>Title</Label>
                <input {...register('title')} placeholder="e.g. AI Capabilities Deck for Banking" className={inputClasses} />
                {errors.title && <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.title.message}</p>}
              </div>
              
              <div>
                <Label required>Description</Label>
                <textarea {...register('description')} rows={3} placeholder="2-3 sentences describing what this is and when someone should use it." className={inputClasses} />
                {errors.description && <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.description.message}</p>}
              </div>

              <div>
                <Label required>Artifact Type</Label>
                <div className="relative">
                  <select {...register('artifact_type')} className={cn(inputClasses, "appearance-none pr-10")}>
                    <option value="">Select type...</option>
                    {ARTIFACT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none text-gray-500">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                  </div>
                </div>
                {errors.artifact_type && <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.artifact_type.message}</p>}
              </div>

              <div>
                <Label required>OneDrive URL</Label>
                <input {...register('onedrive_url')} placeholder="https://algoleap-my.sharepoint.com/..." className={inputClasses} />
                {errors.onedrive_url && <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.onedrive_url.message}</p>}
              </div>

              <div className="pt-2">
                <MultiSelect name="service_line" options={SERVICE_LINES} label="Service Line" error={errors.service_line} />
                <MultiSelect name="industry" options={INDUSTRIES} label="Industry" error={errors.industry} />
                <MultiSelect name="audience" options={AUDIENCES} label="Audience" error={errors.audience} />
              </div>

              <div>
                <Label>Technology Tags</Label>
                <input {...register('tech_tags')} placeholder="e.g. Salesforce, ServiceNow, LangChain (comma-separated)" className={inputClasses} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <Label required>Owner Name</Label>
                  <input {...register('owner_name')} placeholder="Full name" className={inputClasses} />
                  {errors.owner_name && <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.owner_name.message}</p>}
                </div>
                <div>
                  <Label required>Owner Email</Label>
                  <input type="email" {...register('owner_email')} placeholder="name@algoleap.com" className={inputClasses} />
                  {errors.owner_email && <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.owner_email.message}</p>}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-5 pb-4">
                <div>
                  <Label>Status</Label>
                  <div className="relative">
                    <select {...register('status')} className={cn(inputClasses, "appearance-none pr-10")}>
                      <option value="current">Current</option>
                      <option value="needs-update">Needs Update</option>
                      <option value="archived">Archived</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none text-gray-500">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                    </div>
                  </div>
                </div>
                <div>
                  <Label>Client Safe</Label>
                  <div className="flex items-center h-[42px]">
                    <label className="relative inline-flex items-center cursor-pointer gap-3">
                      <div className="relative">
                        <input type="checkbox" {...register('is_client_safe')} className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[#19593A]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#19593A]"></div>
                      </div>
                      <span className="text-[14px] font-medium text-gray-600">
                        {watch('is_client_safe') ? 'Yes — client-facing' : 'No — internal only'}
                      </span>
                    </label>
                  </div>
                </div>
              </div>

              {errorMsg && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
                  <div className="mt-0.5"><svg className="w-4 h-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg></div>
                  <p className="text-red-700 text-[13px] font-medium">{errorMsg}</p>
                </div>
              )}

            </form>
          </div>

          <div className="px-7 py-5 border-t border-gray-200 bg-white flex justify-start gap-4">
            <button type="button" onClick={onClose} className="px-6 py-2.5 rounded-lg border border-gray-300 bg-white text-gray-700 font-bold text-[14px] hover:bg-gray-50 transition-colors w-[120px] shadow-sm">
              Cancel
            </button>
            <button 
              type="submit" 
              form="artifactForm" 
              disabled={isSubmitting} 
              className="flex-grow flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg bg-[#19593A] text-white font-bold text-[14px] hover:bg-[#12422b] transition-colors shadow-sm disabled:opacity-70"
            >
              {isSubmitting ? 'Saving...' : (artifact ? 'Update Artifact' : 'Add Artifact')}
            </button>
          </div>

        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
