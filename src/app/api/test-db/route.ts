import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
    try {
        await prisma.$connect();

        return NextResponse.json({
            success: true,
            message: "Database connected successfully",
        });
    } catch (error) {
        console.error(error);

        return NextResponse.json(
            {
                success: false,
                message: "Database connection failed",
            },
            { status: 500 }
        );
    }
}