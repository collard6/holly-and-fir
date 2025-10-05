import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request) {
  try {
    const { items, total, discount, paymentMethod, email, soldBy } = await request.json();

    // Create the sale with items
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

    // Reduce stock for each item sold
    for (const item of items) {
      // Reduce tree stock if a tree was purchased
      if (item.tree && item.tree !== 'No Tree' && item.size) {
        const treeType = item.tree.toLowerCase();
        await prisma.treeStock.update({
          where: {
            type_size: {
              type: treeType,
              size: item.size
            }
          },
          data: {
            quantity: {
              decrement: 1
            }
          }
        });

        // Add to stock history
        await prisma.stockHistory.create({
          data: {
            type: 'sale',
            item: `${item.tree} ${item.size}`,
            quantity: -1,
            notes: `Sale #${sale.id}`
          }
        });
      }

      // Reduce accessory stock
      const accessoryMapping = {
        metalStand: 'Metal Stand',
        plasticStand: 'Plastic Stand',
        artificialWreath: 'Artificial Wreath',
        handmadeWreath: 'Handmade Wreath',
        hollyWreath: 'Holly Wreath',
        smallReindeer: 'Small Reindeer',
        mediumReindeer: 'Medium Reindeer',
        largeReindeer: 'Large Reindeer'
      };

      for (const [key, name] of Object.entries(accessoryMapping)) {
        const qty = item.accessories?.[key] || 0;
        if (qty > 0) {
          await prisma.accessoryStock.update({
            where: { name },
            data: {
              quantity: {
                decrement: qty
              }
            }
          });

          // Add to stock history
          await prisma.stockHistory.create({
            data: {
              type: 'sale',
              item: name,
              quantity: -qty,
              notes: `Sale #${sale.id}`
            }
          });
        }
      }
    }

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