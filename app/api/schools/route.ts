import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const query = searchParams.get("q") || "";
    const district = searchParams.get("district") || "";
    const schoolType = searchParams.get("type") || "";
    const management = searchParams.get("management") || "";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const skip = (page - 1) * limit;

    // Build where clause
    const where: Record<string, unknown> = {
      isActive: true,
    };

    if (query) {
      where.OR = [
        { name: { contains: query } },
        { nameTamil: { contains: query } },
        { emisCode: { contains: query } },
        { village: { contains: query } },
      ];
    }

    if (district) {
      where.district = district;
    }

    if (schoolType) {
      where.schoolType = schoolType;
    }

    if (management) {
      where.management = management;
    }

    // Get total count
    const total = await prisma.school.count({ where });

    // Get schools
    const schools = await prisma.school.findMany({
      where,
      select: {
        id: true,
        emisCode: true,
        name: true,
        nameTamil: true,
        district: true,
        block: true,
        village: true,
        schoolType: true,
        management: true,
        medium: true,
        category: true,
        phone: true,
        pincode: true,
      },
      orderBy: [
        { district: "asc" },
        { name: "asc" },
      ],
      skip,
      take: limit,
    });

    return NextResponse.json({
      schools,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("Failed to fetch schools:", error);
    return NextResponse.json(
      { error: "Failed to fetch schools" },
      { status: 500 }
    );
  }
}

// POST - Bulk import schools (admin only)
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    if (!Array.isArray(data.schools)) {
      return NextResponse.json(
        { error: "Invalid data format. Expected { schools: [...] }" },
        { status: 400 }
      );
    }

    const results = {
      created: 0,
      updated: 0,
      errors: 0,
    };

    for (const school of data.schools) {
      try {
        await prisma.school.upsert({
          where: { emisCode: school.emisCode },
          update: {
            name: school.name,
            nameTamil: school.nameTamil,
            district: school.district,
            districtTamil: school.districtTamil,
            block: school.block,
            blockTamil: school.blockTamil,
            village: school.village,
            villageTamil: school.villageTamil,
            address: school.address,
            pincode: school.pincode,
            schoolType: school.schoolType,
            management: school.management,
            medium: school.medium,
            category: school.category,
            phone: school.phone,
            email: school.email,
            headmaster: school.headmaster,
            studentCount: school.studentCount,
            teacherCount: school.teacherCount,
            updatedAt: new Date(),
          },
          create: {
            emisCode: school.emisCode,
            udiseCode: school.udiseCode,
            name: school.name,
            nameTamil: school.nameTamil,
            district: school.district,
            districtTamil: school.districtTamil,
            block: school.block,
            blockTamil: school.blockTamil,
            village: school.village,
            villageTamil: school.villageTamil,
            address: school.address,
            pincode: school.pincode,
            schoolType: school.schoolType,
            management: school.management,
            medium: school.medium,
            category: school.category,
            phone: school.phone,
            email: school.email,
            headmaster: school.headmaster,
            establishedYear: school.establishedYear,
            studentCount: school.studentCount,
            teacherCount: school.teacherCount,
          },
        });
        results.created++;
      } catch (err) {
        console.error(`Error importing school ${school.emisCode}:`, err);
        results.errors++;
      }
    }

    return NextResponse.json({
      message: "Import completed",
      results,
    });
  } catch (error) {
    console.error("Failed to import schools:", error);
    return NextResponse.json(
      { error: "Failed to import schools" },
      { status: 500 }
    );
  }
}
