export interface Domain {
    id: string;
    name: string;
    description: string;
    category: string;
    topics: string[];
}
export declare const DOMAINS: Domain[];
export declare function getDomainById(id: string): Domain | undefined;
export declare function getDomainsByCategory(category: string): Domain[];
export declare function getCategories(): string[];
