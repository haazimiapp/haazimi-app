import { useState, useEffect, useCallback } from 'react';
import { GOOGLE_SCRIPT_URL } from '../data/config';
import { STUDENTS as MOCK_STUDENTS } from '../data/mockData';

const CACHE_KEY = 'haazimi_students_cache';

export default function useStudents(user) {
  const [students, setStudents] = useState(() => {
    try {
      const cached = localStorage.getItem(CACHE_KEY);
      return cached ? JSON.parse(cached) : MOCK_STUDENTS;
    } catch { return MOCK_STUDENTS; }
  });
  const [loading, setLoading] = useState(false);
  const [syncStatus, setSyncStatus] = useState('idle');

  const save = (data) => {
    localStorage.setItem(CACHE_KEY, JSON.stringify(data));
  };

  const fetchStudents = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${GOOGLE_SCRIPT_URL}?type=getStudents&t=${Date.now()}`, { mode: 'cors' });
      const data = await res.json();
      const arr = Array.isArray(data) ? data : (data.students || []);
      if (arr.length > 0) { setStudents(arr); save(arr); }
    } catch { /* keep cache/mock */ }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchStudents(); }, [fetchStudents]);

  const isManager = ['Centre Manager', 'Country Admin', 'Super Admin'].includes(user?.role);

  const myStudents = students.filter(s =>
    isManager
      ? (s.centre === (user?.centre || user?.center) || !user?.centre)
      : s.teacherEmail === user?.email
  );

  const addStudent = async (studentData) => {
    const newS = {
      ...studentData,
      id: `S-${Date.now()}`,
      teacherEmail: user?.email || '',
      centre: user?.centre || user?.center || '',
      country: user?.country || '',
      addedAt: new Date().toISOString(),
    };
    const updated = [...students, newS];
    setStudents(updated); save(updated);
    setSyncStatus('syncing');
    try {
      await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST', mode: 'no-cors',
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify({ action: 'addStudent', ...newS }),
      });
      setSyncStatus('done');
    } catch { setSyncStatus('fail'); }
    return newS;
  };

  const updateStudent = async (id, changes) => {
    const updated = students.map(s => s.id === id ? { ...s, ...changes } : s);
    setStudents(updated); save(updated);
    setSyncStatus('syncing');
    try {
      await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST', mode: 'no-cors',
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify({ action: 'updateStudent', id, ...changes }),
      });
      setSyncStatus('done');
    } catch { setSyncStatus('fail'); }
  };

  const deleteStudent = async (id) => {
    const updated = students.filter(s => s.id !== id);
    setStudents(updated); save(updated);
    setSyncStatus('syncing');
    try {
      await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST', mode: 'no-cors',
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify({ action: 'deleteStudent', id }),
      });
      setSyncStatus('done');
    } catch { setSyncStatus('fail'); }
  };

  return { students, myStudents, loading, syncStatus, fetchStudents, addStudent, updateStudent, deleteStudent };
}
