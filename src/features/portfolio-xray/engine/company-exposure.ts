import { Holding } from "@prisma/client";

import { marketDataService } from "@/features/market-data/services/market-data.service";

import { ExposureMap } from "../types/exposure";

export async function calculateCompanyExposure(
    holdings: Holding[]
) {

    const exposure: ExposureMap = {};

    for (const holding of holdings) {

        if (
            holding.assetType === "STOCK"
            && holding.symbol
        ) {

            if (!exposure[holding.symbol]) {

                exposure[holding.symbol] = {

                    symbol: holding.symbol,

                    name: holding.assetName,

                    sector: "Unknown",

                    value: 0,

                    allocation: 0,

                    source: "Direct",

                };

            }

            exposure[holding.symbol].value +=
                holding.currentValue;

            continue;

        }

        if (
            holding.assetType === "ETF"
            || holding.assetType === "MUTUAL_FUND"
        ) {

            if (!holding.fundId)
                continue;

            const constituents =
                await marketDataService
                    .getFundConstituents(
                        holding.fund.symbol
                    );

            for (const company of constituents) {

                const contribution =

                    holding.currentValue
                    * company.weight
                    / 100;

                if (!exposure[company.symbol]) {

                    exposure[company.symbol] = {

                        symbol: company.symbol,

                        name: company.name,

                        sector: company.sector,

                        value: 0,

                        allocation: 0,

                        source: holding.assetName,

                    };

                }

                exposure[company.symbol].value +=
                    contribution;

            }

        }

    }

    const totalValue =
        Object.values(exposure)
            .reduce(
                (sum, item) =>
                    sum + item.value,
                0
            );

    Object.values(exposure)
        .forEach((company) => {

            company.allocation =
                totalValue === 0
                    ? 0
                    : company.value
                    / totalValue
                    * 100;

        });

    return Object.values(exposure)

        .sort(
            (a, b) =>
                b.value - a.value
        );

}