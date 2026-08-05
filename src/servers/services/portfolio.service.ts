export function calculateNetWorth(
    holdings: {
        currentValue: number;
    }[]
) {
    return holdings.reduce(
        (total, holding) =>
            total + holding.currentValue,
        0
    );
}