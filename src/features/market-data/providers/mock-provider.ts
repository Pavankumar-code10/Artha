import { prisma } from "@/lib/prisma";

import { MarketDataProvider } from "./provider";

export class MockMarketDataProvider
    implements MarketDataProvider {

    async getFundConstituents(
        fundSymbol: string
    ) {

        const fund =
            await prisma.fund.findUnique({

                where: {
                    symbol: fundSymbol,
                },

                include: {

                    constituents: {

                        include: {

                            security: true,

                        },

                    },

                },

            });

        if (!fund) {
            return [];
        }

        return fund.constituents.map((item) => ({

            symbol:
                item.security.symbol,

            name:
                item.security.name,

            sector:
                item.security.sector,

            weight:
                item.weight,

        }));

    }

}