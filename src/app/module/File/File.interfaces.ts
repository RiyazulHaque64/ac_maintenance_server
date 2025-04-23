export type TImage = { name: string; path: string; cloud_id: string };

export type TFile = {
    fieldname: string;
    originalname: string;
    encoding: string;
    mimetype: string;
    buffer: Buffer;
    size: number;
};

export type TFiles = {
    files?: TFile[];
};