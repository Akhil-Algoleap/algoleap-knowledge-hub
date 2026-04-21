'use client';

import { Artifact } from '@/lib/types';
import { Pencil, Archive, Trash2, Plus } from 'lucide-react';
import { useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import { ArtifactForm } from './ArtifactForm';

export function AdminTable({ initialArtifacts }: { initialArtifacts: Artifact[] }) {
  const [artifacts, setArtifacts] = useState<Artifact[]>(initialArtifacts);
  const [formOpen, setFormOpen] = useState(false);
  const [editingArtifact, setEditingArtifact] = useState<Artifact | undefined>(undefined);

  const refreshData = async () => {
    const { data } = await supabase.from('artifacts').select('*').order('updated_at', { ascending: false });
    if (data) setArtifacts(data);
    setFormOpen(false);
  };

  const handleOpenForm = (artifact?: Artifact) => {
    setEditingArtifact(artifact);
    setFormOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this artifact? This cannot be undone.')) {
      await supabase.from('artifacts').delete().eq('id', id);
      refreshData();
    }
  };

  const toggleArchive = async (artifact: Artifact) => {
    const newStatus = artifact.status === 'archived' ? 'current' : 'archived';
    await supabase.from('artifacts').update({ status: newStatus }).eq('id', artifact.id);
    refreshData();
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-white">Repository Management</h2>
        <button 
          onClick={() => handleOpenForm()} 
          className="primary-btn flex items-center gap-2"
        >
          <Plus className="h-4 w-4" /> Add Artifact
        </button>
      </div>

      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-black/40 border-b border-white/10 uppercase text-xs font-semibold text-algoleap-muted tracking-wider">
              <tr>
                <th className="px-6 py-4">Title</th>
                <th className="px-6 py-4">Type</th>
                <th className="px-6 py-4">Service Line</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Last Updated</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {artifacts.map(item => (
                <tr key={item.id} className={`hover:bg-white/5 transition-colors ${item.status === 'archived' ? 'opacity-50 grayscale' : ''}`}>
                  <td className="px-6 py-4">
                    <div className="font-medium text-white max-w-[300px] truncate">{item.title}</div>
                    <div className="text-xs text-algoleap-muted mt-0.5">{item.owner_name}</div>
                  </td>
                  <td className="px-6 py-4 text-algoleap-muted">{item.artifact_type}</td>
                  <td className="px-6 py-4 text-algoleap-muted">
                    <div className="flex flex-wrap gap-1">
                      {item.service_line?.slice(0, 2).map((sl, i) => (
                        <span key={i} className="px-1.5 py-0.5 rounded bg-white/10 text-xs truncate max-w-[150px]">{sl}</span>
                      ))}
                      {item.service_line?.length > 2 && (
                        <span className="px-1.5 py-0.5 rounded bg-white/10 text-xs">+{item.service_line.length - 2}</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <select
                      value={item.status}
                      onChange={async (e) => {
                        const newStatus = e.target.value;
                        await supabase.from('artifacts').update({ status: newStatus }).eq('id', item.id);
                        refreshData();
                      }}
                      className={`px-2.5 py-1 rounded-full text-xs font-medium border appearance-none outline-none cursor-pointer pr-6 ${
                        item.status === 'current' ? 'bg-algoleap-green/10 text-algoleap-green border-algoleap-green/20' : 
                        item.status === 'needs-update' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' : 
                        'bg-slate-500/10 text-slate-400 border-slate-500/20'
                      }`}
                      style={{ backgroundImage: 'url(\'data:image/svg+xml;utf8,<svg fill="none" viewBox="0 0 24 24" stroke="currentColor" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>\')', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.5rem center', backgroundSize: '1em 1em' }}
                    >
                      <option value="current" className="bg-algoleap-dark text-white">Current</option>
                      <option value="needs-update" className="bg-algoleap-dark text-white">Needs Update</option>
                      <option value="archived" className="bg-algoleap-dark text-white">Archived</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 text-algoleap-muted">
                    {new Date(item.updated_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => handleOpenForm(item)} className="p-1.5 text-blue-400 hover:bg-blue-400/20 rounded-md transition-colors" title="Edit">
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button onClick={() => toggleArchive(item)} className="p-1.5 text-amber-400 hover:bg-amber-400/20 rounded-md transition-colors" title={item.status === 'archived' ? 'Unarchive' : 'Archive'}>
                        <Archive className="h-4 w-4" />
                      </button>
                      <button onClick={() => handleDelete(item.id)} className="p-1.5 text-red-400 hover:bg-red-400/20 rounded-md transition-colors" title="Delete">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {artifacts.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-algoleap-muted italic">
                    No artifacts found. Click 'Add Artifact' to create one.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <ArtifactForm 
        isOpen={formOpen} 
        onClose={() => setFormOpen(false)} 
        artifact={editingArtifact} 
        onSuccess={refreshData} 
      />
    </div>
  );
}
