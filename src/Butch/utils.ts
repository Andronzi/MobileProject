import rnfs from "react-native-fs";
import { ButchCodes } from "../Types/Types";
import { cyrb53 } from "../Utilities/tools";

const variableCheck = /^[a-zA-Z_]\w*/;
const defaultCodesPath = rnfs.DocumentDirectoryPath + "/bch/codes.json";

export function verifyVariableName(name: string): boolean {
    return variableCheck.exec(name) !== null;
}

function indexCodeNames(codeNames: string[]) {
    const obj: { [key: string]: string } = {};
    codeNames.forEach((name, index) => {
        obj[name] = index.toString(16);
    });
    return obj;
}

export function createBchFolder() {
    return rnfs.exists(rnfs.DocumentDirectoryPath + "/bch").then(res => {
        if (!res) rnfs.mkdir(rnfs.DocumentDirectoryPath + "/bch").catch(e => console.error(e));
    });
}

export const readButchCodesSet = (path: string) =>
    rnfs.readFile(path).then(data => data.split(/\s*\n+\s*/));

export const readButchCodesSetAssets = () =>
    rnfs.readFileAssets("bch/codes.set.txt").then(data => data.split(/\s*\n+\s*/));

export function createButchCodesFile(codesSet: string[], outPath = "") {
    return createBchFolder().then(() =>
        rnfs.writeFile(outPath || defaultCodesPath, JSON.stringify(indexCodeNames(codesSet))),
    );
}

function parseButchCodes(data: string) {
    const parsed = JSON.parse(data) as { [key: string]: string };
    Object.entries(parsed).forEach(([name, code]) => (parsed[code] = name));
    parsed.__hash = cyrb53(data).toString();
    return parsed as ButchCodes;
}

export function readButchCodes(path = ""): Promise<ButchCodes> {
    return createBchFolder().then(() =>
        rnfs.readFile(path || defaultCodesPath).then(parseButchCodes),
    );
}

export const readButchCodesAssets = () =>
    rnfs.readFileAssets("bch/codes.json").then(parseButchCodes);
