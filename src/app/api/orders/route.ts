import { NextResponse } from "next/server";
import { dbStore, OrderItem } from "@/lib/db";

export async function GET() {
  const orders = dbStore.getOrders();
  return NextResponse.json({ orders });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      userId,
      customerName,
      phone,
      orderType,
      tableNumber,
      deliveryAddress,
      coordinates,
      items,
      totalAmount,
      specialRequests,
    } = body;

    if (!items || items.length === 0) {
      return NextResponse.json({ error: "Cart items cannot be empty" }, { status: 400 });
    }

    const newOrder: OrderItem = {
      id: `ord-${Date.now()}`,
      orderNumber: `VR-ORD-${Math.floor(100 + Math.random() * 900)}`,
      userId,
      customerName: customerName || "VIP Diners Club",
      phone: phone || "+91 98000 00000",
      orderType: orderType || "DineIn",
      tableNumber: orderType === "DineIn" ? tableNumber : undefined,
      deliveryAddress: orderType === "Delivery" ? deliveryAddress : undefined,
      coordinates: orderType === "Delivery" ? coordinates : undefined,
      items,
      totalAmount,
      paymentId: `pay_RzpSim_${Date.now()}`,
      status: orderType === "DineIn" ? "Received" : "Preparing",
      specialRequests,
      createdAt: new Date().toISOString(),
    };

    dbStore.addOrder(newOrder);

    return NextResponse.json({ success: true, order: newOrder });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to create order" }, { status: 500 });
  }
}
