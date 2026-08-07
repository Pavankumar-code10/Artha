export interface CompanyExposure {

    symbol: string;

    name: string;

    sector: string;

    value: number;

    allocation: number;

    source: string;

}

export interface ExposureMap {

    [symbol: string]: CompanyExposure;

}