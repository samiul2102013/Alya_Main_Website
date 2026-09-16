'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import Button from '@/components/shared/Button';
import { Loader2, CheckCircle2, AlertCircle } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://127.0.0.1:8000/api';

const EMIRATE_OPTIONS = [
  'Abu Dhabi',
  'Dubai',
  'Sharjah',
  'Ajman',
  'Umm Al Quwain',
  'Ras Al Khaimah',
  'Fujairah',
];

interface InitiativeApplicationFormProps {
  initiativeId: string;
}

export default function InitiativeApplicationForm({ initiativeId }: InitiativeApplicationFormProps) {
  const t = useTranslations('applyForm');

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

  const USER_TYPE_OPTIONS = [
    { value: 'individual', label: t('individual') },
    { value: 'couple', label: t('couple') },
    { value: 'organization', label: t('organization') },
  ];

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!fullName.trim() || !phone.trim()) {
      setError(t('validationError'));
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
      setError(err instanceof Error ? err.message : t('genericError'));
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div className="flex flex-col items-center gap-4 py-10 text-center">
        <CheckCircle2 className="h-12 w-12 text-green-600" />
        <p className="text-lg font-semibold text-[#781E36]">{t('successTitle')}</p>
        <p className="text-sm text-[#6B5B57]">{t('successMessage')}</p>
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
          <label className="text-sm font-semibold text-[#781E36]">{t('fullName')} <span className="text-red-500">*</span></label>
          <input
            type="text"
            required
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder={t('fullNamePlaceholder')}
            className="h-[48px] rounded-[10px] border border-[#E8CFC1] bg-white px-3 text-sm text-gray-700 outline-none focus:border-[#781E36] transition-colors"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-[#781E36]">{t('phone')} <span className="text-red-500">*</span></label>
          <input
            type="tel"
            required
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder={t('phonePlaceholder')}
            className="h-[48px] rounded-[10px] border border-[#E8CFC1] bg-white px-3 text-sm text-gray-700 outline-none focus:border-[#781E36] transition-colors"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-[#781E36]">{t('email')}</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t('emailPlaceholder')}
            className="h-[48px] rounded-[10px] border border-[#E8CFC1] bg-white px-3 text-sm text-gray-700 outline-none focus:border-[#781E36] transition-colors"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-[#781E36]">{t('userType')}</label>
          <select
            value={userType}
            onChange={(e) => setUserType(e.target.value)}
            className="h-[48px] rounded-[10px] border border-[#E8CFC1] bg-white px-3 text-sm text-gray-700 outline-none focus:border-[#781E36] transition-colors"
          >
            <option value="">{t('selectType')}</option>
            {USER_TYPE_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-[#781E36]">{t('maritalStatus')}</label>
          <input
            type="text"
            value={maritalStatus}
            onChange={(e) => setMaritalStatus(e.target.value)}
            placeholder={t('maritalStatusPlaceholder')}
            className="h-[48px] rounded-[10px] border border-[#E8CFC1] bg-white px-3 text-sm text-gray-700 outline-none focus:border-[#781E36] transition-colors"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-[#781E36]">{t('age')}</label>
          <input
            type="number"
            min={0}
            max={120}
            value={age}
            onChange={(e) => setAge(e.target.value)}
            placeholder={t('agePlaceholder')}
            className="h-[48px] rounded-[10px] border border-[#E8CFC1] bg-white px-3 text-sm text-gray-700 outline-none focus:border-[#781E36] transition-colors"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-[#781E36]">{t('emirate')}</label>
          <select
            value={emirate}
            onChange={(e) => setEmirate(e.target.value)}
            className="h-[48px] rounded-[10px] border border-[#E8CFC1] bg-white px-3 text-sm text-gray-700 outline-none focus:border-[#781E36] transition-colors"
          >
            <option value="">{t('selectEmirate')}</option>
            {EMIRATE_OPTIONS.map((em) => (
              <option key={em} value={em}>{em}</option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-[#781E36]">{t('income')}</label>
          <input
            type="text"
            value={income}
            onChange={(e) => setIncome(e.target.value)}
            placeholder={t('incomePlaceholder')}
            className="h-[48px] rounded-[10px] border border-[#E8CFC1] bg-white px-3 text-sm text-gray-700 outline-none focus:border-[#781E36] transition-colors"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-[#781E36]">{t('familyMembers')}</label>
          <input
            type="number"
            min={0}
            value={familyMembers}
            onChange={(e) => setFamilyMembers(e.target.value)}
            placeholder={t('familyMembersPlaceholder')}
            className="h-[48px] rounded-[10px] border border-[#E8CFC1] bg-white px-3 text-sm text-gray-700 outline-none focus:border-[#781E36] transition-colors"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-[#781E36]">{t('nationality')}</label>
          <input
            type="text"
            value={nationality}
            onChange={(e) => setNationality(e.target.value)}
            placeholder={t('nationalityPlaceholder')}
            className="h-[48px] rounded-[10px] border border-[#E8CFC1] bg-white px-3 text-sm text-gray-700 outline-none focus:border-[#781E36] transition-colors"
          />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-semibold text-[#781E36]">{t('notes')}</label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={4}
          placeholder={t('notesPlaceholder')}
          className="rounded-[10px] border border-[#E8CFC1] bg-white px-3 py-2 text-sm text-gray-700 outline-none focus:border-[#781E36] transition-colors resize-none"
        />
      </div>

      <div className="flex justify-center pt-2">
        <Button type="submit" variant="primary" size="lg" disabled={submitting}>
          {submitting ? (
            <span className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              {t('submitting')}
            </span>
          ) : (
            t('submit')
          )}
        </Button>
      </div>
    </form>
  );
}
