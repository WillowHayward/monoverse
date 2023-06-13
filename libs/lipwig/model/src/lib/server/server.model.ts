export type LipwigOptions = {
    port: number;
    roomNumberLimit: number;
    roomSizeLimit: number;
    name: string;
    db: string;
};

export type LipwigConfig = Partial<LipwigOptions>;

