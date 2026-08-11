import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Seeding test data for Portfolio X-Ray...');

    const testUserId = 'user_test_sebi_sprint';

    // 1. Create or upsert a test User
    const user = await prisma.user.upsert({
        where: { id: testUserId },
        update: {},
        create: {
            id: testUserId,
            clerkId: testUserId,
            email: 'tester@aartha.fin',
            firstName: 'SEBI',
            lastName: 'Sprint Tester',
        },
    });

    // 2. Clear existing holdings and portfolios for clean execution
    await prisma.holding.deleteMany({ where: { portfolio: { userId: user.id } } });
    await prisma.portfolio.deleteMany({ where: { userId: user.id } });

    // 3. Create a test Portfolio (institution + accountMasked are required by schema)
    const portfolio = await prisma.portfolio.create({
        data: {
            userId: user.id,
            name: 'Core Growth Portfolio',
            institution: 'Zerodha (Account Aggregator)',
            accountMasked: 'XXXX1234',
        },
    });

    // 4. Create Securities in Security Master (unique field is `symbol`, not `ticker`)
    const reliance = await prisma.security.upsert({
        where: { symbol: 'RELIANCE' },
        update: {},
        create: {
            id: 'SEC_RELIANCE',
            symbol: 'RELIANCE',
            name: 'Reliance Industries Ltd.',
            sector: 'Energy',
        },
    });

    const hdfc = await prisma.security.upsert({
        where: { symbol: 'HDFCBANK' },
        update: {},
        create: {
            id: 'SEC_HDFC',
            symbol: 'HDFCBANK',
            name: 'HDFC Bank Ltd.',
            sector: 'Financials',
        },
    });

    // 5. Create Funds in Fund Master (symbol + issuer are required by schema)
    const niftyEtf = await prisma.fund.upsert({
        where: { id: 'FUND_NIFTYETF' },
        update: {},
        create: {
            id: 'FUND_NIFTYETF',
            symbol: 'NIFTYBEES',
            name: 'Nippon India Nifty 50 BeES ETF',
            type: 'ETF',
            issuer: 'Nippon India Mutual Fund',
        },
    });

    const ppfas = await prisma.fund.upsert({
        where: { id: 'FUND_PPFAS' },
        update: {},
        create: {
            id: 'FUND_PPFAS',
            symbol: 'PPFAS',
            name: 'Parag Parikh Flexi Cap Fund',
            type: 'MUTUAL_FUND',
            issuer: 'PPFAS Mutual Fund',
        },
    });

    // 6. Create Fund Constituents (schema uses `weight`, not `weightPercentage`)
    await prisma.fundConstituent.upsert({
        where: { fundId_securityId: { fundId: niftyEtf.id, securityId: reliance.id } },
        update: {},
        create: { fundId: niftyEtf.id, securityId: reliance.id, weight: 9.8 },
    });
    await prisma.fundConstituent.upsert({
        where: { fundId_securityId: { fundId: niftyEtf.id, securityId: hdfc.id } },
        update: {},
        create: { fundId: niftyEtf.id, securityId: hdfc.id, weight: 11.5 },
    });
    await prisma.fundConstituent.upsert({
        where: { fundId_securityId: { fundId: ppfas.id, securityId: reliance.id } },
        update: {},
        create: { fundId: ppfas.id, securityId: reliance.id, weight: 4.1 },
    });
    await prisma.fundConstituent.upsert({
        where: { fundId_securityId: { fundId: ppfas.id, securityId: hdfc.id } },
        update: {},
        create: { fundId: ppfas.id, securityId: hdfc.id, weight: 7.5 },
    });

    // 7. Add Holdings to User Portfolio (schema: quantity + averagePrice + currentPrice + investedValue + currentValue + assetType + assetName)
    await prisma.holding.createMany({
        data: [
            {
                portfolioId: portfolio.id,
                symbol: reliance.symbol,
                assetName: reliance.name,
                assetType: 'STOCK',
                quantity: 10,
                averagePrice: 2900.00,
                currentPrice: 2950.50,
                investedValue: 29000.00,
                currentValue: 29505.00,
            },
            {
                portfolioId: portfolio.id,
                fundId: niftyEtf.id,
                symbol: niftyEtf.symbol,
                assetName: niftyEtf.name,
                assetType: 'ETF',
                quantity: 100,
                averagePrice: 240.00,
                currentPrice: 245.50,
                investedValue: 24000.00,
                currentValue: 24550.00,
            },
            {
                portfolioId: portfolio.id,
                fundId: ppfas.id,
                symbol: ppfas.symbol,
                assetName: ppfas.name,
                assetType: 'MUTUAL_FUND',
                quantity: 500,
                averagePrice: 70.00,
                currentPrice: 72.80,
                investedValue: 35000.00,
                currentValue: 36400.00,
            },
        ],
    });

    console.log('✅ Seeding complete! Mock user portfolio ready for X-Ray Engine test.');
}

main()
    .catch((e) => {
        console.error('❌ Seeding failed:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });