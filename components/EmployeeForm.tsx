'use client';

import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Employee } from '@/lib/types';
import { supabase } from '@/lib/supabase/client';
import { useState } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

export const employeeSchema = z.object({
  name:  z.string().min(1, 'Name is required'),
  email: z.string().email('Must be a valid email')
});

type FormData = z.infer<typeof employeeSchema>;

interface EmployeeFormProps {
  employee?: Employee;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function EmployeeForm({ employee, isOpen, onClose, onSuccess }: EmployeeFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(employeeSchema),
    defaultValues: employee ? {
      name: employee.name,
      email: employee.email
    } : {
      name: '',
      email: ''
    }
  });

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    setErrorMsg('');
    
    try {
      if (employee) {
        const { error } = await supabase.from('employees').update(data).eq('id', employee.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('employees').insert(data);
        if (error) throw error;
      }
      
      onSuccess();
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'Error saving employee');
    } finally {
      setIsSubmitting(false);
    }
  };

  const Label = ({ children, required }: { children: React.ReactNode, required?: boolean }) => (
    <label className="block text-[11px] font-bold text-[#1e293b] uppercase tracking-wider mb-2">
      {children} {required && <span className="text-red-500">*</span>}
    </label>
  );

  const inputClasses = "w-full bg-white border border-gray-300 rounded-lg px-3 py-2.5 text-[14px] text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#3A7D44]/20 focus:border-[#3A7D44] transition-all shadow-[0_1px_2px_rgba(0,0,0,0.02)]";

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex justify-center items-center p-4"
      >
        <motion.div 
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden pointer-events-auto"
        >
          <div className="px-7 py-5 border-b border-gray-200 flex justify-between items-start bg-white">
            <div>
              <h2 className="text-[20px] font-bold text-gray-900 tracking-tight">
                {employee ? 'Edit Employee' : 'Add New Employee'}
              </h2>
              <p className="text-[13px] text-gray-500 mt-1 font-medium">Manage hub access for this user.</p>
            </div>
            <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors">
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="px-7 py-8">
            <form id="employeeForm" onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              
              <div>
                <Label required>Full Name</Label>
                <input {...register('name')} placeholder="e.g. John Doe" className={inputClasses} />
                {errors.name && <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.name.message}</p>}
              </div>
              
              <div>
                <Label required>Email Address</Label>
                <input {...register('email')} type="email" placeholder="john.doe@algoleap.com" className={inputClasses} />
                {errors.email && <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.email.message}</p>}
              </div>

              {errorMsg && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
                  <div className="mt-0.5"><svg className="w-4 h-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg></div>
                  <p className="text-red-700 text-[13px] font-medium">{errorMsg}</p>
                </div>
              )}
            </form>
          </div>

          <div className="px-7 py-5 border-t border-gray-200 bg-gray-50 flex justify-end gap-3">
            <button type="button" onClick={onClose} className="px-5 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 font-bold text-[14px] hover:bg-gray-50 transition-colors">
              Cancel
            </button>
            <button 
              type="submit" 
              form="employeeForm" 
              disabled={isSubmitting} 
              className="px-5 py-2 rounded-lg bg-[#3A7D44] text-white font-bold text-[14px] hover:bg-[#2E6336] transition-colors shadow-sm disabled:opacity-70"
            >
              {isSubmitting ? 'Saving...' : (employee ? 'Update' : 'Add Employee')}
            </button>
          </div>

        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
