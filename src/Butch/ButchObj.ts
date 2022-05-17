import { ThemeConsumer } from "react-native-elements";

/**
 * wraper of encoded object
 * gives easier interaction with it
 */
export type B_ObjPayload = string | string[] | { [key: string]: B_ObjPayload }[];
export type B_Obj = { [key: string]: B_ObjPayload };

const stringFields = ["type", "name", "value"] as const;
type StringField = typeof stringFields[number];

const stringArrayFields = ["nameSeq"] as const;
type StringArrayField = typeof stringArrayFields[number];

const recursiveFields = ["content"];
type RecursiveField = typeof recursiveFields[number];

function isStringField(value: any): value is StringField {
    return stringFields.includes(value);
}

function isStringArrayField(value: any): value is StringArrayField {
    return stringArrayFields.includes(value);
}

function isRecursiveField(value: any): value is RecursiveField {
    return recursiveFields.includes(value);
}

export default class ButchObj {
    public data: B_Obj;
    public codes: { [key: string]: string };
    // any extension your middleware could apply
    public extension: { [key: string]: any } = {};

    constructor(obj: { [key: string]: any }, codes: { [key: string]: string }) {
        this.codes = codes;
        this.data = obj;
    }

    /**
     * recursive ButchObj finder
     */
    static goToNode(
        obj: B_Obj,
        path: number[],
        codes: { [key: string]: string },
    ): B_Obj | undefined {
        let node: any = obj;
        for (let i = 0; i < path.length; ++i) {
            if (!(node[codes.content] instanceof Array)) {
                return undefined;
            } else {
                node = node[codes.content][path[i]];
            }
        }
        return node;
    }

    // __getString(key: string): string {
    //     const item = this.data[this.codes[key]];
    //     return typeof item === "string" ? item : "";
    // }

    // __getStringArray(key: string): string[] {
    //     const item = this.data[this.codes[key]];
    //     return Array.isArray(item) ? item : [""];
    // }

    get(key: string): B_ObjPayload {
        return this.data[this.codes[key]];
    }

    content(): B_Obj[] | undefined {
        const content: any = this.data[this.codes.content];
        return content instanceof Array ? content : undefined;
    }

    set(key: string, value: B_ObjPayload) {
        this.data[this.codes[key]] = value;
    }

    goTo(...indexes: number[]): ButchObj {
        const obj = ButchObj.goToNode(this.data, indexes, this.codes);
        if (!obj) {
            throw Error("Invalid path to find block");
        }
        return new ButchObj(obj, this.codes);
    }
}

interface Coordinates {
    x?: number;
    y?: number;
}

export class CButchObj extends ButchObj {
    public cContent: CButchObj[] | undefined;
    public coordinates: Coordinates;

    constructor(obj: { [key: string]: any }, codes: { [key: string]: string }) {
        super(obj, codes);

        this.coordinates = {};
        // Возможно этот конструктор не работает
        this.cContent = super.content()?.map(item => new CButchObj(item, codes));
    }

    private getStringType(field: StringField): string {
        const value = this.data[this.codes.field];
        return typeof value === "string"
            ? value
            : (() => {
                  throw new Error(`"${field}" is invalid or undefined`);
              })();
    }

    public get type(): string {
        return this.getStringType("type");
    }
    public set type(value: string) {
        this.data[this.codes.type] = value;
    }

    public get name(): string {
        return this.getStringType("name");
    }
    public set name(value: string) {
        this.data[this.codes.name] = value;
    }

    public get value(): string {
        return this.getStringType("value");
    }
    public set value(value: string) {
        this.data[this.codes.value] = value;
    }

    public get nameSeq(): string[] {
        return [""];
    }
    public set nameSeq(value: string[]) {
        return;
    }

    s(haha: string): number {
        return 3;
    }

    s(hah: string, a: number) {
        return;
    }

    /**
     * recursive ButchObj finder
     */
    static cGoToNode(
        obj: CButchObj,
        path: number[],
        codes: { [key: string]: string },
    ): CButchObj | undefined {
        let node: any = obj;
        for (let i = 0; i < path.length; ++i) {
            if (!(node[codes.content] instanceof Array)) {
                return undefined;
            } else {
                node = node[codes.content][path[i]];
            }
        }
        return node;
    }

    goTo(...indexes: number[]): ButchObj {
        return (
            CButchObj.cGoToNode(this, indexes, this.codes) ??
            (() => {
                throw new Error("Invalid path to find block");
            })()
        );
    }
}
