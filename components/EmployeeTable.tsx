'use client';

import { Employee } from '@/lib/types';
import { Pencil, Trash2, Plus, Search, User } from 'lucide-react';
import { useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import { EmployeeForm } from './EmployeeForm';

export function EmployeeTable({ initialEmployees }: { initialEmployees: Employee[] }) {
  const [employees, setEmployees] = useState<Employee[]>(initialEmployees);
  const [formOpen, setFormOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | undefined>(undefined);
  const [searchQuery, setSearchQuery] = useState('');

  const refreshData = async () => {
    const { data } = await supabase.from('employees').select('*').order('created_at', { ascending: false });
    if (data) setEmployees(data);
    setFormOpen(false);
  };

  const handleOpenForm = (employee?: Employee) => {
    setEditingEmployee(employee);
    setFormOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to remove this employee? They will lose access to the Knowledge Hub.')) {
      await supabase.from('employees').delete().eq('id', id);
      refreshData();
    }
  };

  const filteredEmployees = employees.filter(emp => 
    emp.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    emp.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h2 className="text-xl font-bold text-white">Employee Management</h2>
          <p className="text-algoleap-muted text-sm mt-1">Only users in this list can access the platform.</p>
        </div>
        
        <div className="flex w-full md:w-auto gap-3">
          <div className="relative flex-grow md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-algoleap-muted" />
            <input 
              type="text" 
              placeholder="Search employees..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-algoleap-green/20 focus:border-algoleap-green transition-all"
            />
          </div>
          <button 
            onClick={() => handleOpenForm()} 
            className="primary-btn flex items-center gap-2 whitespace-nowrap"
          >
            <Plus className="h-4 w-4" /> Add Employee
          </button>
        </div>
      </div>

      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-black/40 border-b border-white/10 uppercase text-xs font-semibold text-algoleap-muted tracking-wider">
              <tr>
                <th className="px-6 py-4">Employee</th>
                <th className="px-6 py-4">Email</th>
                <th className="px-6 py-4">Added On</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredEmployees.map(emp => (
                <tr key={emp.id} className="hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-algoleap-green/10 flex items-center justify-center text-algoleap-green">
                        <User className="h-4 w-4" />
                      </div>
                      <div className="font-medium text-white">{emp.name}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-algoleap-muted">{emp.email}</td>
                  <td className="px-6 py-4 text-algoleap-muted" suppressHydrationWarning>
                    {new Date(emp.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => handleOpenForm(emp)} className="p-1.5 text-blue-400 hover:bg-blue-400/20 rounded-md transition-colors" title="Edit">
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button onClick={() => handleDelete(emp.id)} className="p-1.5 text-red-400 hover:bg-red-400/20 rounded-md transition-colors" title="Delete">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredEmployees.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-algoleap-muted italic">
                    {searchQuery ? 'No employees match your search.' : 'No employees found. Add your first employee to grant access.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <EmployeeForm 
        isOpen={formOpen} 
        onClose={() => setFormOpen(false)} 
        employee={editingEmployee} 
        onSuccess={refreshData} 
      />
    </div>
  );
}
