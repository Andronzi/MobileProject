export type BObjPayload = string | string[] | { [key: string]: BObjPayload }[];
export type BObj = { [key: string]: BObjPayload };

const stringFields = ["type", "name", "value"] as const;
export type StringField = typeof stringFields[number];

const stringArrayFields = ["nameSeq"] as const;
export type StringArrayField = typeof stringArrayFields[number];

const recursiveFields = ["content"];
export type RecursiveField = typeof recursiveFields[number];

export function isStringField(value: any): value is StringField {
    return stringFields.includes(value);
}

export function isStringArrayField(value: any): value is StringArrayField {
    return stringArrayFields.includes(value);
}

export function isRecursiveField(value: any): value is RecursiveField {
    return recursiveFields.includes(value);
}
