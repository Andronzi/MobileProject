/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable no-use-before-define */
/* eslint-disable @typescript-eslint/no-this-alias */
import { Block, Environment, Value, TypeNames, ContainerBlock } from "./base";
import {
    FuncBlock,
    BreakBlock,
    DeclareBlock,
    InvokeBlock,
    ReturnBlock,
    TextBlock,
    IfBlock,
    WhileBlock,
    ForBlock,
    PrintBlock,
    _dereferenceBlock,
    __consolelog,
    SetBlock,
} from "./blocks";
import ExpressionBlock from "./ExpressionBlock";
import { RuntimeError, CompilationError } from "./errors";
import { createButchCodesFile, readButchCodes, readButchCodesSetAssets } from "./utils";
import { syntaxCheck, prebuildInternalBlocks } from "./middleware.bch";
import ButchObjBase from "./ButchObj";

import * as rnfs from "react-native-fs";
import { v4 } from "uuid";
import { ButchCodes } from "../types/Types";

export class Program extends Block {
    private globalEnv: Environment;
    private flusher: { flush: () => void; interval: number } | undefined;
    private write: ((str: string) => void) | undefined;

    constructor() {
        super();
        this.globalEnv = new Environment(this);
    }

    useGlobalVariable(declarator: DeclareBlock) {
        this.pushToContent(declarator);
        declarator.execute(this.globalEnv);
        return this;
    }

    useFunction(name: string, funcBlock: FuncBlock) {
        this.pushToContent(funcBlock);
        this.globalEnv.create(name, new Value(TypeNames.FUNCKBLOCK, funcBlock));
        return this;
    }

    useFlushFunc(flushFunc: () => void, autoFlushInterval: number = NaN) {
        this.flusher = { flush: flushFunc, interval: autoFlushInterval };
    }

    useBufferWriter(write: (str: string) => void) {
        this.write = write;
    }

    setBlock(newBlock: Block, path: number[]) {
        let node: Block = this;
        for (let i = 0; i < path.length - 1; ++i) {
            node = node.getContent()[path[i]];
        }

        const content = node.getContent();
        content[path[path.length - 1]] = newBlock;
        node.setContent(content);
    }

    protected logicsBody(env: Environment): Value {
        let main: Block;
        try {
            main = env.get("main").evaluate(env, TypeNames.FUNCKBLOCK, true);
        } catch (e) {
            RuntimeError.throwIdentifierError(this, "Symbol 'main' must be defined as a function");
        }
        return main.execute(env);
    }

    execute(): Value {
        console.log(this.globalEnv);
        

        const flushInterval =
            this.flusher && Number.isFinite(this.flusher.interval)
                ? setInterval(this.flusher.flush, this.flusher.interval)
                : undefined;
        try {
            super.execute(this.globalEnv);
        } catch (e) {
            if (this.write && e instanceof Error) {
                this.write(e.name + "\n" + e.message);
                if (e instanceof RuntimeError) {
                    e.blockIndexStack.forEach(path => {
                        this.write && this.write(`\nin Block located in ${path.toString()}`);
                    })
                }
            }
        }

        this.write && this.write("_\n_\n_\n_\n_\n_\n_\n_\n_\n_\n_\n_\n_\n_\n_\n_\n")
        
        if (flushInterval) clearInterval(flushInterval);
        
        this.flusher?.flush();

        return Value.Undefined;
    }
}

export type BlockInfo = { obj: ButchObjBase; location: number[] };

export type Middleware = (info: BlockInfo, app: ButchBuilder) => void;

type Builder = (info: BlockInfo) => Block;

export type ExBuilder = (
    info: BlockInfo,
    codes: { [key: string]: string },
    app: ButchBuilder,
) => Block;

export class ButchBuilder {
    static unknownBlockError: Error = new Error("Unknown block type to build");

    // codes dictionary
    private c: ButchCodes;
    private rc: ButchCodes;
    private builders: Map<string, Builder>;
    private exBuilders: Map<string, ExBuilder>;
    private middlewares: Middleware[];

    private streams: { id: string; write: (str: string) => void }[] = [];
    private outPutBuffer = "";
    public readonly flushBuffer = () => {
        console.log(this.outPutBuffer);
        
        this.streams.forEach(({ write }) => write(this.outPutBuffer));
        this.outPutBuffer = "";
    };
    public readonly pushBuffer = (str: string) => {
        this.outPutBuffer += str;
    };

    constructor(codes: ButchCodes, revesedCodes: ButchCodes) {
        this.c = codes;
        this.rc = revesedCodes;

        // bind default builders
        this.builders = new Map<string, Builder>([
            [this.c.invoker, this.buildInvoker],
            [this.c.declare, this.buildDeclare],
            [this.c.function, this.buildFunction],
            [this.c.if, this.buildIf],
            [this.c.while, this.buildWhile],
            [this.c.for, this.buildFor],

            // style 2 builder : inline anonymos
            [this.c.expression, info => new ExpressionBlock(info.obj.get("value"))],
            [this.c.text, info => new TextBlock(info.obj.get("value"))],
            [this.c.deref, info => new _dereferenceBlock(info.obj.get("name"))],
            [this.c.break, () => BreakBlock],
            [this.c.return, info => new ReturnBlock(info.obj.extension.builtContent[0])],
            [this.c.log, info => new __consolelog(info.obj.extension.builtContent[0])],
            [
                this.c.print,
                info => new PrintBlock(info.obj.extension.builtContent[0], this.pushBuffer),
            ],

            [
                this.c.set,
                info =>
                    new SetBlock(
                        info.obj.extension.builtContent[0],
                        info.obj.extension.builtContent[1],
                    ),
            ],

            [this.c.container, info => new ContainerBlock(info.obj.extension.builtContent)],
        ]);

        this.exBuilders = new Map<string, ExBuilder>();
        this.middlewares = [syntaxCheck, prebuildInternalBlocks];
    }

    useBuilder(type: string, builder: ExBuilder) {
        if (!this.c[type]) throw ButchBuilder.unknownBlockError;
        this.exBuilders.set(this.c[type], builder);
    }

    useCode(name: string /*, code: number*/) {
        if (this.c[name]) throw new Error(`Code name "${name}" is already used`);
        this.c[name] = Object.keys(this.c).length.toString(16);
    }

    useMiddleware(middleware: Middleware) {
        this.middlewares.push(middleware);
    }

    useOutStream(stream: { id?: string; write: (str: string) => void }): string {
        const existingIndex = this.streams.findIndex(st => st.id === stream.id);

        if (existingIndex < 0) {
            const newStream = { id: v4(), write: stream.write };
            this.streams.push(newStream);
            return newStream.id;
        }

        this.streams[existingIndex] = { id: stream.id ?? v4(), write: stream.write };
        return this.streams[existingIndex].id;
    }

    saveButchCodes(newName: string | undefined = undefined) {
        const keys = Object.keys(this.c);
        let codesSet: string = keys[0];
        for (let i = 1; i < keys.length; ++i) {
            codesSet += "\n" + keys[i];
        }

        const pathToCodesSet = rnfs.DocumentDirectoryPath + `/.bch/${newName ?? "codes"}.set.txt`;
        return rnfs.writeFile(pathToCodesSet, codesSet).then(() => {
            void createButchCodesFile(
                codesSet.split("\n"),
                rnfs.DocumentDirectoryPath + `/.bch/${newName ?? "codes"}.json`,
            );
        });
    }

    /**
     * only for testing
     * brutely encode named program's string
     */
    encodeNamedProgram(namedProg: string): string {
        Object.entries(this.c).forEach(([key, value]) => {
            namedProg = namedProg.replace(
                new RegExp('"' + key + '"', "g"),
                '"' + value.toString() + '"',
            );
        });
        return namedProg.replace(new RegExp("[ \n\r]+", "g"), "");
    }

    private execMiddlewares(info: BlockInfo) {
        for (let i = 0; i < this.middlewares.length; ++i) {
            this.middlewares[i](info, this);
        }
    }

    // style 1 of builder : private prorety
    private buildDeclare = (info: BlockInfo): DeclareBlock => {
        return new DeclareBlock(info.obj.get("name"), info.obj.extension.builtContent[0]);
    };

    private buildIf = (info: BlockInfo): IfBlock => {
        const content = info.obj.extension.builtContent;
        return new IfBlock(content[0], content[1], content[2]);
    };

    private buildWhile = (info: BlockInfo): WhileBlock => {
        const content = info.obj.extension.builtContent;
        return new WhileBlock(content[0], content[1]);
    };

    private buildFor = (info: BlockInfo): ForBlock => {
        const content = info.obj.extension.builtContent;
        return new ForBlock(content[0], content[1], content[2], content[3]);
    };

    private buildInvoker: Builder = (info: BlockInfo): Block => {
        return new InvokeBlock(info.obj.get("name"), info.obj.extension.builtContent);
    };

    private buildFunction = (info: BlockInfo): FuncBlock => {
        return new FuncBlock(info.obj.extension.builtContent, info.obj.get("nameSeq"));
    };

    buildBlock(info: BlockInfo): Block {
        this.execMiddlewares(info);
        
        const builder = this.exBuilders.get(info.obj.get("type"));
        if (builder) {
            return builder(info, this.c, this);
        } else {
            const builder = this.builders.get(info.obj.get("type"));
            if (builder) return builder(info);
        }
        CompilationError.throwUnknownBlock(info);
    }

    build(programObj: ButchObjBase, autoFlushInterval: number = NaN): Program {
        // if (programObj.get("__codesHash") !== this.c.__hash)
        //     new CompilationError(`Invalid program encoding; builder expects hash :
        //         ${this.c.__hash}, but had hash ${programObj.get("__codesHash")}`)
        const prog = new Program();
        const content = programObj.getContent() ?? CompilationError.throwInvalidFile();

        for (let i = 0; i < content.length; ++i) {
            const info: BlockInfo = {
                obj: new ButchObjBase(content[i], this.c, this.rc),
                location: [i],
            };

            this.execMiddlewares(info);

            switch (content[i][this.c.type]) {
                case this.c.function:
                    prog.useFunction(String(content[i][this.c.name]), this.buildFunction(info));
                    break;

                case this.c.declare:
                    prog.useGlobalVariable(this.buildDeclare(info));
                    break;

                default:
                    CompilationError.throwUnknownBlock(info);
            }
        }

        if (this.streams.length) {
            prog.useFlushFunc(this.flushBuffer, autoFlushInterval);
            prog.useBufferWriter(this.pushBuffer);
        }

        return prog;
    }

    rebuild(prog: Program, programObj: ButchObjBase, targetPathes: number[][]) {
        targetPathes.forEach(path => {
            const block = this.buildBlock({
                obj: programObj.goTo(...path),
                location: path,
            });
            prog.setBlock(block, path);
        });
    }

    getCodes(): Readonly<ButchCodes> {
        return this.c;
    }
    getRCodes(): Readonly<ButchCodes>  {
        return this.rc;
    }

    public static initDefaultBuilder(): Promise<ButchBuilder> {
        return readButchCodesSetAssets()
            .then(set => createButchCodesFile(set))
            .then(() => readButchCodes())
            .then(_codes => new ButchBuilder(_codes[0], _codes[1]));
    }
}



export default Program;
