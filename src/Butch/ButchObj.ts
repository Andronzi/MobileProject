import { BObjError } from "./errors";
import {
    BObjPayload,
    BObj,
    StringArrayField,
    StringField,
    RecursiveField,
    isRecursiveField,
    isStringArrayField,
    isStringField,
} from "../types/BObjFields";
import { ButchCodes } from "src/types/Types"

/**
 * wraper of encoded object
 * gives easier interaction with it
 */
export class ButchObjBase {
    public data: BObj;
    public codes: ButchCodes;
    // any extension your middleware could apply
    public extension: { [key: string]: any } = {};

    constructor(obj: { [key: string]: any }, codes: ButchCodes) {
        this.codes = codes;
        this.data = obj;
    }

    /**
     * recursive ButchObj finder
     */
    static _goToNode(
        obj: BObj,
        path: number[],
        codes: ButchCodes,
    ): BObj | undefined {
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

    get(key: StringField): string;
    get(key: StringArrayField): string[];
    get(key: RecursiveField): BObj[];

    get(key: string): BObjPayload {
        const value: BObjPayload = this.data[this.codes[key]];

        if (isStringField(key)) {
            return typeof value === "string" ? value : BObjError.throwInvalidField(key);
        } else if (isStringArrayField(key)) {
            return value instanceof Array && (!value.length || typeof value[0] === "string")
                ? value
                : BObjError.throwInvalidField(key);
        } else if (isRecursiveField(key)) {
            return value instanceof Array && (!value.length || typeof value[0] === "object")
                ? value
                : BObjError.throwInvalidField(key); 
        }

        BObjError.throwInvalidField(key);
    }

    has(key: string): boolean {
        return !!this.data[this.codes[key]];
    }

    getContent(): BObj[] | undefined {
        const content: any = this.data[this.codes.content];
        return content instanceof Array ? content : undefined;
    }

    set(key: string, value: BObjPayload) {
        this.data[this.codes[key]] = value;
    }

    goTo(...indexes: number[]): ButchObjBase {
        const obj = ButchObjBase._goToNode(this.data, indexes, this.codes);
        if (!obj) {
            throw Error("Invalid path to find block");
        }
        return new ButchObjBase(obj, this.codes);
    }

    public static readonly createEmptyBObj = (codes: ButchCodes) => ({
        [codes["type"]]: codes["program"],
        [codes["__hash"]]: codes.__hash,
        [codes["content"]]: []
    });
}

export class ButchObj extends ButchObjBase {
    // eslint-disable-next-line no-use-before-define
    public content: ButchObj[] | undefined;

    constructor(obj: { [key: string]: any }, codes: ButchCodes) {
        super(obj, codes);

        this.content = super.getContent()?.map(item => new ButchObj(item, codes));
    }

    /**
     * recursive ButchObj finder
     */
    static goToNode(
        obj: ButchObj,
        path: number[],
        codes: ButchCodes,
    ): ButchObj | undefined {
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
            ButchObj.goToNode(this, indexes, this.codes) ??
            (() => {
                throw new Error("Invalid path to find block");
            })()
        );
    }
}

export default ButchObjBase;