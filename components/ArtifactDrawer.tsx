'use client';

import { Artifact } from '@/lib/types';
import { X, ExternalLink, ShieldCheck, Mail, Calendar, User, Tag } from 'lucide-react';
import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ArtifactDrawerProps {
  artifact: Artifact | null;
  onClose: () => void;
}

export function ArtifactDrawer({ artifact, onClose }: ArtifactDrawerProps) {
  
  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <AnimatePresence>
      {artifact && (
        <>
          {/* Overlay */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40"
          />

          {/* Drawer */}
          <motion.div 
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full max-w-lg bg-white border-l border-gray-200 z-50 overflow-y-auto shadow-2xl"
          >
            {/* Header / Actions */}
            <div className="sticky top-0 bg-white/95 backdrop-blur-md p-6 border-b border-gray-200 flex justify-between items-center z-10">
              <h2 className="text-xl font-bold text-gray-900 truncate pr-4">Artifact Details</h2>
              <button 
                onClick={onClose}
                className="p-2 rounded-full hover:bg-gray-100 text-gray-500 hover:text-gray-900 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6 space-y-8">
              {/* Primary Action */}
              <button 
                onClick={() => window.open(artifact.onedrive_url, '_blank', 'noopener noreferrer')}
                className="w-full bg-[#19593A] hover:bg-[#12422b] text-white flex items-center justify-center gap-2 py-4 rounded-xl text-lg font-bold shadow-sm transition-colors"
              >
                Open in OneDrive <ExternalLink className="h-5 w-5" />
              </button>

              {/* Title & Badges */}
              <div>
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="px-3 py-1 rounded-full text-xs font-bold border border-gray-200 bg-gray-50 text-gray-700">
                    {artifact.artifact_type}
                  </span>
                  {artifact.is_client_safe && (
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-green-50 text-[#19593A] border border-green-200 flex items-center gap-1.5">
                      <ShieldCheck className="h-3.5 w-3.5" /> Client Safe
                    </span>
                  )}
                  {artifact.status === 'needs-update' && (
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
                      Needs Update
                    </span>
                  )}
                </div>
                <h1 className="text-3xl font-extrabold text-gray-900 mb-2 leading-tight">{artifact.title}</h1>
                <p className="text-base text-gray-600 leading-relaxed whitespace-pre-wrap mt-4">
                  {artifact.description || 'No description available for this artifact.'}
                </p>
              </div>

              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-4">Metadata</h3>
                
                <div className="grid grid-cols-2 gap-y-6">
                  <div>
                    <div className="flex items-center gap-2 text-gray-500 mb-1">
                      <User className="h-4 w-4" /> <span className="text-[11px] font-bold uppercase tracking-wide">Owner</span>
                    </div>
                    <p className="text-gray-900 font-bold">{artifact.owner_name}</p>
                    {artifact.owner_email && (
                      <a href={`mailto:${artifact.owner_email}`} className="text-[13px] text-[#19593A] hover:underline flex items-center gap-1 mt-1 font-medium">
                        <Mail className="h-3.5 w-3.5" /> {artifact.owner_email}
                      </a>
                    )}
                  </div>
                  
                  <div>
                    <div className="flex items-center gap-2 text-gray-500 mb-1">
                      <Calendar className="h-4 w-4" /> <span className="text-[11px] font-bold uppercase tracking-wide">Last Updated</span>
                    </div>
                    <p className="text-gray-900 font-bold">{new Date(artifact.updated_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                  </div>
                </div>
              </div>

              {/* Tag Sections */}
              <div className="space-y-6 border-t border-gray-200 pt-6 pb-8">
                <div>
                  <h4 className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-3">Service Lines</h4>
                  <div className="flex flex-wrap gap-2">
                    {artifact.service_line.map(sl => (
                      <span key={sl} className="text-[13px] font-medium text-gray-700 bg-gray-50 border border-gray-200 px-3 py-1.5 rounded-lg flex items-center gap-1.5">
                        <Tag className="h-3.5 w-3.5 text-gray-400" /> {sl}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-3">Industries</h4>
                  <div className="flex flex-wrap gap-2">
                    {artifact.industry.length > 0 ? artifact.industry.map(ind => (
                      <span key={ind} className="text-[13px] font-medium text-gray-700 bg-gray-50 border border-gray-200 px-3 py-1.5 rounded-lg">
                        {ind}
                      </span>
                    )) : <span className="text-[13px] text-gray-400 italic">Not specified</span>}
                  </div>
                </div>
                
                <div>
                  <h4 className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-3">Audience</h4>
                  <div className="flex flex-wrap gap-2">
                    {artifact.audience.map(aud => (
                      <span key={aud} className="text-[13px] font-medium text-gray-700 bg-gray-50 border border-gray-200 px-3 py-1.5 rounded-lg">
                        {aud}
                      </span>
                    ))}
                  </div>
                </div>
                
                {artifact.tech_tags && artifact.tech_tags.length > 0 && (
                  <div>
                    <h4 className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-3">Tech Stack / Tags</h4>
                    <div className="flex flex-wrap gap-2">
                      {artifact.tech_tags.map(tag => (
                        <span key={tag} className="text-[12px] font-semibold text-blue-700 bg-blue-50 border border-blue-200 px-2.5 py-1 rounded-md font-mono">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
