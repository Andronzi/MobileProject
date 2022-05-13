/**
 * wraper of encoded object
 * gives easier interaction with it
 */
export type B_ObjPayload = string | string[] | { [key: string]: B_ObjPayload }[];
export type B_Obj = { [key: string]: B_ObjPayload };

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
