import * as Bch from "./Butch"
import { verifyVariableName } from "./utils"
import { CompilationError } from "./errors"
import ButchObjBase from "./ButchObj"
import { Block } from "./base"

export const syntaxCheck: Bch.Middleware = 
    function(info: Bch.BlockInfo) {
        if (info.obj.has("name") && !verifyVariableName(info.obj.get("name")) || 
            info.obj.has("nameSeq") && !info.obj.get("nameSeq").every(verifyVariableName)) 
        {
            CompilationError.throwSyntax(info);  
        }
}
/**
 * builds "content" of object and puts result into .extention.builtContent 
 */
export const prebuildInternalBlocks: Bch.Middleware = 
    function(info: Bch.BlockInfo, app: Bch.ButchBuilder) {
        const content = info.obj.getContent();
        if (content && content.length > 0) {
            const newContent: Block[] = new Array<Block>(content.length);
            for (let i = 0; i < content.length; ++i) {
                newContent[i] = app.buildBlock(
                    {obj: new ButchObjBase(content[i], info.obj.codes), location: info.location.concat(i)});
            }
            info.obj.extension .builtContent = newContent;
        } 
    }