import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const history = await prisma.stockHistory.findMany({
      orderBy: {
        date: 'desc'
      }
    });

    return NextResponse.json(history);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const { type, item, quantity, notes } = await request.json();

    const historyEntry = await prisma.stockHistory.create({
      data: {
        type,
        item,
        quantity,
        notes: notes || ''
      }
    });

    return NextResponse.json(historyEntry);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}