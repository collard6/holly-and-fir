import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request) {
  try {
    const { items, total, discount, paymentMethod, email, soldBy } = await request.json();

    const sale = await prisma.sale.create({
      data: {
        total: parseFloat(total),
        discount: discount || 0,
        paymentMethod,
        email: email || null,
        soldBy: soldBy || null,
        items: {
          create: items.map(item => ({
            tree: item.tree,
            size: item.size || null,
            metalStand: item.accessories?.metalStand || 0,
            plasticStand: item.accessories?.plasticStand || 0,
            artificialWreath: item.accessories?.artificialWreath || 0,
            handmadeWreath: item.accessories?.handmadeWreath || 0,
            hollyWreath: item.accessories?.hollyWreath || 0,
            smallReindeer: item.accessories?.smallReindeer || 0,
            mediumReindeer: item.accessories?.mediumReindeer || 0,
            largeReindeer: item.accessories?.largeReindeer || 0,
            price: parseFloat(item.price)
          }))
        }
      },
      include: {
        items: true
      }
    });

    return NextResponse.json(sale);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET() {
  try {
    const sales = await prisma.sale.findMany({
      include: {
        items: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json(sales);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}