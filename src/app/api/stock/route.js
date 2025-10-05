import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const trees = await prisma.treeStock.findMany();
    const accessories = await prisma.accessoryStock.findMany();

    return NextResponse.json({ trees, accessories });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const { trees, accessories } = await request.json();

    // Update tree stock
    if (trees) {
      for (const tree of trees) {
        await prisma.treeStock.upsert({
          where: {
            type_size: {
              type: tree.type,
              size: tree.size
            }
          },
          update: {
            quantity: tree.quantity,
            price: parseFloat(tree.price)
          },
          create: {
            type: tree.type,
            size: tree.size,
            quantity: tree.quantity,
            price: parseFloat(tree.price)
          }
        });
      }
    }

    // Update accessory stock
    if (accessories) {
      for (const accessory of accessories) {
        await prisma.accessoryStock.upsert({
          where: {
            name: accessory.name
          },
          update: {
            quantity: accessory.quantity,
            price: parseFloat(accessory.price)
          },
          create: {
            name: accessory.name,
            quantity: accessory.quantity,
            price: parseFloat(accessory.price)
          }
        });
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}