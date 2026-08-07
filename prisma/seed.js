const fs = require("fs");
const path = require("path");

const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const SECURITY_MASTER = require("./data/securities.json");
const FUND_CONSTITUENTS = require("./data/fund-constituents.json");

async function seedSecurities() {
    await prisma.security.createMany({
        data: SECURITY_MASTER,
        skipDuplicates: true,
    });
}

async function seedFundConstituents() {

    for (const row of FUND_CONSTITUENTS) {

        const security = await prisma.security.findUnique({
            where: {
                symbol: row.symbol,
            },
        });

        if (!security) continue;

        await prisma.fundConstituent.create({
            data: {
                fundName: row.fundName,
                securityId: security.id,
                weight: row.weight,
            },
        });

    }

}

async function main() {

    await seedSecurities();

    await seedFundConstituents();

    console.log("✅ Security Master Seeded");
    console.log("✅ Fund Constituents Seeded");

}

main()
    .catch(console.error)
    .finally(async () => {
        await prisma.$disconnect();
    });