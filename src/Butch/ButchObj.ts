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
import { ButchCodes, Coordinates, Size } from "../types/Types";

/**
 * wraper of encoded object
 * gives easier interaction with it
 */
export class ButchObjBase {
    public data: BObj;
    public readonly codes: ButchCodes;
    public readonly rCodes: ButchCodes;
    // any extension your middleware could apply
    public extension: { coordinates?: Coordinates; size?: Size; [key: string]: any } = {};

    constructor(obj: { [key: string]: BObjPayload }, codes: ButchCodes, rCodes: ButchCodes) {
        this.codes = codes;
        this.rCodes = rCodes;
        this.data = obj;
    }

    /**
     * recursive ButchObj finder
     */
    static _goToNode(obj: BObj, path: number[], codes: ButchCodes): BObj | undefined {
        let node: BObj = obj;
        for (let i = 0; i < path.length; ++i) {
            if (!(node[codes.content] instanceof Array)) {
                return undefined;
            } else {
                node = node[codes.content][path[i]] as BObj;
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
        return new ButchObjBase(obj, this.codes, this.rCodes);
    }
}

type ButchObjectCreator = () => ButchObj;

export class ButchObj extends ButchObjBase {
    // eslint-disable-next-line no-use-before-define
    private _content: ButchObj[] | undefined;
    public readonly parent: ButchObj | undefined;
    public get content(): ButchObj[] | undefined {
        return this._content && [...this._content];
    }
    public set content(newContent: ButchObj[] | undefined) {
        if (newContent) this.data[this.codes.content] = newContent.map(value => value.data);
        this._content = newContent;
    }

    public readonly type: string;

    constructor(
        obj: { [key: string]: BObjPayload },
        codes: ButchCodes,
        rCodes: ButchCodes,
        parent: ButchObj | undefined = undefined,
    ) {
        super(obj, codes, rCodes);

        this.parent = parent;
        this.type = rCodes[this.data[this.codes.type] as string];
        this._content = super.getContent()?.map(item => new ButchObj(item, codes, rCodes, this));
    }

    /**
     * recursive ButchObj finder
     */
    static goToNode(obj: ButchObj, path: number[]): ButchObj | undefined {
        let node: ButchObj = obj;
        for (let i = 0; i < path.length; ++i) {
            if (node.content) {
                node = node.content[i];
            } else return undefined;
        }
        return node;
    }

    goTo(...indexes: number[]): ButchObj {
        return (
            ButchObj.goToNode(this, indexes) ??
            (() => {
                throw new Error("Invalid path to find block");
            })()
        );
    }

    public readonly createProgram: ButchObjectCreator = () =>
        new ButchObj(
            {
                [this.codes.type]: this.codes.program,
                [this.codes.__hash]: this.codes.__hash,
                [this.codes.content]: [],
            },
            this.codes,
            this.rCodes,
        );

    public readonly createDeclare: ButchObjectCreator = () =>
        new ButchObj(
            {
                [this.codes.type]: this.codes.declare,
                [this.codes.name]: "",
                [this.codes.content]: [
                    {
                        [this.codes.type]: this.codes.expression,
                        [this.codes.value]: "",
                    },
                ],
            },
            this.codes,
            this.rCodes,
        );

    public readonly createFunction: ButchObjectCreator = () =>
        new ButchObj(
            {
                [this.codes.type]: this.codes.function,
                [this.codes.name]: "",
                [this.codes.nameSeq]: [],
                [this.codes.content]: [],
            },
            this.codes,
            this.rCodes,
        );
}

export default ButchObjBase;
