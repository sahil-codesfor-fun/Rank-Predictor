import fs from 'fs';
import path from 'path';

export interface StudentLead {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  academicStatus: 'Class 12th Appearing' | 'Class 12th Passed / Dropper' | 'Class 11th';
  targetYear: '2025' | '2026' | '2027';
  city: string;
  state: string;
  schoolOrCoaching: string;
  exam: string;
  mode: string;
  scoreOrRank: number;
  category: string;
  gender: string;
  homeState: string;
  predictedRank?: number;
  createdAt: string;
}

const DB_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DB_DIR, 'students.json');

function ensureDbFile(): void {
  try {
    if (!fs.existsSync(DB_DIR)) {
      fs.mkdirSync(DB_DIR, { recursive: true });
    }
    if (!fs.existsSync(DB_FILE)) {
      fs.writeFileSync(DB_FILE, JSON.stringify([], null, 2), 'utf-8');
    }
  } catch (err) {
    console.error('Error ensuring database directory/file exists:', err);
  }
}

export function getAllStudents(): StudentLead[] {
  ensureDbFile();
  try {
    const raw = fs.readFileSync(DB_FILE, 'utf-8');
    if (!raw.trim()) return [];
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading students database:', err);
    return [];
  }
}

export function saveStudentLead(studentData: Omit<StudentLead, 'id' | 'createdAt'>): StudentLead {
  ensureDbFile();
  const students = getAllStudents();

  const newStudent: StudentLead = {
    ...studentData,
    id: `student_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    createdAt: new Date().toISOString(),
  };

  // Check if student with same phone or email exists; if so, update their entry, otherwise prepend
  const existingIdx = students.findIndex(
    (s) => s.phone === newStudent.phone || s.email.toLowerCase() === newStudent.email.toLowerCase()
  );

  if (existingIdx !== -1) {
    students[existingIdx] = { ...students[existingIdx], ...newStudent, id: students[existingIdx].id };
  } else {
    students.unshift(newStudent);
  }

  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(students, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing student to database file:', err);
  }

  return newStudent;
}

