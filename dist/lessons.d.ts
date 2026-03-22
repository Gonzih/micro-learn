export interface Lesson {
    id: string;
    domain: string;
    conceptName: string;
    hook: string;
    coreConcept: string;
    appliedExample: string;
    questionRecall: string;
    questionApplication: string;
    keyTakeaway: string;
    estimatedMinutes: number;
}
export declare const LESSONS: Lesson[];
export declare function getLessonById(id: string): Lesson | undefined;
export declare function getLessonsByDomain(domain: string): Lesson[];
export declare function searchLessons(query: string, domain?: string): Lesson[];
