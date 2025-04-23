import { Request } from "express";

function configureCors(req: Request, callback: (error: Error | null, options: any) => void): void {
    const allowedDomains = ["https://dreamestate-cr.vercel.app", "https://de.smartreach.dev"];
    const origin = req.headers.origin;
    const corsOptions = {
        origin: allowedDomains.includes(origin as string) || origin?.includes("localhost"),
        credentials: true,
    }
    callback(null, corsOptions);
}

export default configureCors; 