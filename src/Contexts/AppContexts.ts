import { createContext } from "react";
import { ButchGlobals } from "../types/Types";

export const butchGlobContext = createContext<ButchGlobals>({
    builder: null,
    programObj: null,
    program: { name: "", executable: null, isChanged: false },
});
