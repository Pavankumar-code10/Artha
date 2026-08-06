import type { ImportedHolding } from "../types/account-aggregator";

export const MOCK_PORTFOLIO: ImportedHolding[] = [
    {
        symbol: "RELIANCE",
        assetName: "Reliance Industries",
        assetType: "STOCK",
        quantity: 15,
        averagePrice: 2510,
        currentPrice: 3025,
        investedValue: 37650,
        currentValue: 45375,
    },
    {
        symbol: "TCS",
        assetName: "Tata Consultancy Services",
        assetType: "STOCK",
        quantity: 8,
        averagePrice: 3450,
        currentPrice: 3895,
        investedValue: 27600,
        currentValue: 31160,
    },
    {
        symbol: "NIFTYBEES",
        assetName: "Nippon India ETF Nifty BeES",
        assetType: "ETF",
        quantity: 120,
        averagePrice: 238,
        currentPrice: 262,
        investedValue: 28560,
        currentValue: 31440,
    },
    {
        symbol: "PARAGPARIKH",
        assetName: "Parag Parikh Flexi Cap Fund",
        assetType: "MUTUAL_FUND",
        quantity: 150,
        averagePrice: 62,
        currentPrice: 74,
        investedValue: 9300,
        currentValue: 11100,
    }
];