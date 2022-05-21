// import { FuncBlock, Environment, Block } from "./base"
import * as B from "./blocks"
import ExpressionBlock from "./ExpressionBlock"
import { ButchBuilder, Program } from "./Butch"
import { createButchCodesFile, readButchCodes, readButchCodesSetAssets } from "./utils"
import ButchObjBase from "./ButchObj"
import rnfs from "react-native-fs"

export async function testBchFile(builder: ButchBuilder) {
    const namedTestProg = await rnfs.readFileAssets("bch/testProgram.json");
    const progStr = builder.encodeNamedProgram(namedTestProg)
    const bobj = new ButchObjBase(JSON.parse(progStr), builder.getCodes(), builder.getRCodes());
    
    const program = builder.build(bobj);
    
    try {
        const t = Date.now();
        program.execute();
        console.log(Date.now() - t);
    } catch (e: any) {
        console.log("Finished with exeption :\nIn ", e.blockIndexStack, "\n", e);
    }
}

export function manualTest() {
    const decVar = new B.DeclareBlock("i", new ExpressionBlock("0"));
    const whileBlock = new B.WhileBlock(
        new ExpressionBlock("i < 1000000"),
        new ExpressionBlock("i = i + 1"))
    const main = new B.FuncBlock([decVar, whileBlock, new B.__consolelog(new ExpressionBlock("i"))]);
    const prog = new Program();
    prog.useFunction("main", main);
    
    const t = Date.now();
    prog.execute();
    console.log(Date.now() - t);
}

export function initDefaultBuilder() {
    return readButchCodesSetAssets()
        .then(set => createButchCodesFile(set))
        .then(() => readButchCodes())
        .then(_codes => new ButchBuilder(_codes[0], _codes[1]))
}
