import { NextRequest, NextResponse } from 'next/server';
import { saveStudentLead, getAllStudents } from '@/lib/db/students';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      fullName,
      email,
      phone,
      academicStatus,
      targetYear,
      city,
      state,
      schoolOrCoaching,
      exam,
      mode,
      scoreOrRank,
      category,
      gender,
      homeState,
      predictedRank,
    } = body;

    // Strict validation for every mandatory field
    if (!fullName || typeof fullName !== 'string' || fullName.trim().length < 2) {
      return NextResponse.json(
        { error: 'Full name is mandatory and must be at least 2 characters.' },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || typeof email !== 'string' || !emailRegex.test(email.trim())) {
      return NextResponse.json(
        { error: 'A valid email address is mandatory.' },
        { status: 400 }
      );
    }

    const cleanPhone = String(phone || '').replace(/[^0-9]/g, '');
    if (cleanPhone.length !== 10) {
      return NextResponse.json(
        { error: 'A valid 10-digit mobile/WhatsApp number is mandatory.' },
        { status: 400 }
      );
    }

    if (!academicStatus || typeof academicStatus !== 'string') {
      return NextResponse.json(
        { error: 'Current academic status is mandatory.' },
        { status: 400 }
      );
    }

    if (!targetYear || typeof targetYear !== 'string') {
      return NextResponse.json(
        { error: 'Target exam year is mandatory.' },
        { status: 400 }
      );
    }

    if (!city || typeof city !== 'string' || city.trim().length === 0) {
      return NextResponse.json(
        { error: 'City is mandatory.' },
        { status: 400 }
      );
    }

    if (!state || typeof state !== 'string' || state.trim().length === 0) {
      return NextResponse.json(
        { error: 'State is mandatory.' },
        { status: 400 }
      );
    }

    if (!schoolOrCoaching || typeof schoolOrCoaching !== 'string' || schoolOrCoaching.trim().length === 0) {
      return NextResponse.json(
        { error: 'School or Coaching institute name is mandatory.' },
        { status: 400 }
      );
    }

    // Save to server database
    const saved = saveStudentLead({
      fullName: fullName.trim(),
      email: email.trim().toLowerCase(),
      phone: cleanPhone,
      academicStatus: academicStatus as any,
      targetYear: targetYear as any,
      city: city.trim(),
      state: state.trim(),
      schoolOrCoaching: schoolOrCoaching.trim(),
      exam: exam || 'jee-main',
      mode: mode || 'marks',
      scoreOrRank: Number(scoreOrRank) || 0,
      category: category || 'OPEN',
      gender: gender || 'Gender-Neutral',
      homeState: homeState || 'Delhi',
      predictedRank: predictedRank ? Number(predictedRank) : undefined,
    });

    return NextResponse.json({
      success: true,
      message: 'Student registration saved successfully to database.',
      student: saved,
    });
  } catch (error: any) {
    console.error('API Error in /api/students:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error while saving student data.' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const students = getAllStudents();
    return NextResponse.json({
      success: true,
      total: students.length,
      students,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to retrieve students from database.' },
      { status: 500 }
    );
  }
}

