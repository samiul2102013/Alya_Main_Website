'use client';

import { useState } from 'react';
import Button from '@/components/shared/Button';
import { Loader2, CheckCircle2, AlertCircle } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://127.0.0.1:8000/api';

const USER_TYPE_OPTIONS = [
  { value: 'individual', label: 'Individual' },
  { value: 'couple', label: 'Couple' },
  { value: 'organization', label: 'Organization' },
];

const EMIRATE_OPTIONS = [
  { value: 'Abu Dhabi', label: 'Abu Dhabi' },
  { value: 'Dubai', label: 'Dubai' },
  { value: 'Sharjah', label: 'Sharjah' },
  { value: 'Ajman', label: 'Ajman' },
  { value: 'Umm Al Quwain', label: 'Umm Al Quwain' },
  { value: 'Ras Al Khaimah', label: 'Ras Al Khaimah' },
  { value: 'Fujairah', label: 'Fujairah' },
];

interface InitiativeApplicationFormProps {
  initiativeId: string;
}

export default function InitiativeApplicationForm({ initiativeId }: InitiativeApplicationFormProps) {
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [userType, setUserType] = useState('');
  const [maritalStatus, setMaritalStatus] = useState('');
  const [age, setAge] = useState('');
  const [emirate, setEmirate] = useState('');
  const [income, setIncome] = useState('');
  const [familyMembers, setFamilyMembers] = useState('');
  const [nationality, setNationality] = useState('');
  const [notes, setNotes] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!fullName.trim() || !phone.trim()) {
      setError('Full name and phone are required.');
      return;
    }
    setSubmitting(true);
    setError('');
    try {
      const res = await fetch(`${API_URL}/initiatives/${initiativeId}/apply/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: fullName.trim(),
          phone: phone.trim(),
          email: email.trim(),
          userType,
          maritalStatus,
          age: age ? Number(age) : null,
          emirate,
          income: income.trim(),
          familyMembers: familyMembers ? Number(familyMembers) : null,
          nationality: nationality.trim(),
          notes: notes.trim(),
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.detail || data.message || `Submission failed (${res.status})`);
      }
      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div className="flex flex-col items-center gap-4 py-10 text-center">
        <CheckCircle2 className="h-12 w-12 text-green-600" />
        <p className="text-lg font-semibold text-[#781E36]">Application Submitted Successfully</p>
        <p className="text-sm text-[#6B5B57]">We will review your application and get back to you soon.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      {error && (
        <div className="flex items-center gap-2 rounded-[10px] bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-[#781E36]">Full Name <span className="text-red-500">*</span></label>
          <input
            type="text"
            required
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Enter full name"
            className="h-[48px] rounded-[10px] border border-[#E8CFC1] bg-white px-3 text-sm text-gray-700 outline-none focus:border-[#781E36] transition-colors"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-[#781E36]">Phone <span className="text-red-500">*</span></label>
          <input
            type="tel"
            required
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+971 50 000 0000"
            className="h-[48px] rounded-[10px] border border-[#E8CFC1] bg-white px-3 text-sm text-gray-700 outline-none focus:border-[#781E36] transition-colors"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-[#781E36]">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="email@example.com"
            className="h-[48px] rounded-[10px] border border-[#E8CFC1] bg-white px-3 text-sm text-gray-700 outline-none focus:border-[#781E36] transition-colors"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-[#781E36]">User Type</label>
          <select
            value={userType}
            onChange={(e) => setUserType(e.target.value)}
            className="h-[48px] rounded-[10px] border border-[#E8CFC1] bg-white px-3 text-sm text-gray-700 outline-none focus:border-[#781E36] transition-colors"
          >
            <option value="">Select type</option>
            {USER_TYPE_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-[#781E36]">Marital Status</label>
          <input
            type="text"
            value={maritalStatus}
            onChange={(e) => setMaritalStatus(e.target.value)}
            placeholder="e.g. Single, Married"
            className="h-[48px] rounded-[10px] border border-[#E8CFC1] bg-white px-3 text-sm text-gray-700 outline-none focus:border-[#781E36] transition-colors"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-[#781E36]">Age</label>
          <input
            type="number"
            min={0}
            max={120}
            value={age}
            onChange={(e) => setAge(e.target.value)}
            placeholder="Enter age"
            className="h-[48px] rounded-[10px] border border-[#E8CFC1] bg-white px-3 text-sm text-gray-700 outline-none focus:border-[#781E36] transition-colors"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-[#781E36]">Emirate</label>
          <select
            value={emirate}
            onChange={(e) => setEmirate(e.target.value)}
            className="h-[48px] rounded-[10px] border border-[#E8CFC1] bg-white px-3 text-sm text-gray-700 outline-none focus:border-[#781E36] transition-colors"
          >
            <option value="">Select emirate</option>
            {EMIRATE_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-[#781E36]">Income</label>
          <input
            type="text"
            value={income}
            onChange={(e) => setIncome(e.target.value)}
            placeholder="e.g. Monthly income range"
            className="h-[48px] rounded-[10px] border border-[#E8CFC1] bg-white px-3 text-sm text-gray-700 outline-none focus:border-[#781E36] transition-colors"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-[#781E36]">Family Members</label>
          <input
            type="number"
            min={0}
            value={familyMembers}
            onChange={(e) => setFamilyMembers(e.target.value)}
            placeholder="Number of family members"
            className="h-[48px] rounded-[10px] border border-[#E8CFC1] bg-white px-3 text-sm text-gray-700 outline-none focus:border-[#781E36] transition-colors"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-[#781E36]">Nationality</label>
          <input
            type="text"
            value={nationality}
            onChange={(e) => setNationality(e.target.value)}
            placeholder="Enter nationality"
            className="h-[48px] rounded-[10px] border border-[#E8CFC1] bg-white px-3 text-sm text-gray-700 outline-none focus:border-[#781E36] transition-colors"
          />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-semibold text-[#781E36]">Notes</label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={4}
          placeholder="Any additional information..."
          className="rounded-[10px] border border-[#E8CFC1] bg-white px-3 py-2 text-sm text-gray-700 outline-none focus:border-[#781E36] transition-colors resize-none"
        />
      </div>

      <div className="flex justify-center pt-2">
        <Button type="submit" variant="primary" size="lg" disabled={submitting}>
          {submitting ? (
            <span className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              Submitting...
            </span>
          ) : (
            'Submit Application'
          )}
        </Button>
      </div>
    </form>
  );
}
