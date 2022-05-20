import { Coordinates, Size } from "../types/Types";
import DRErrors from "../Errors";
import { ButchObj } from "../Butch/ButchObj";

function isIntersects(leftTopCorner: Coordinates, size: Size, landingСoords: Coordinates) {
    if (
        landingСoords.x >= leftTopCorner.x &&
        landingСoords.x <= leftTopCorner.x + size.width &&
        landingСoords.y >= leftTopCorner.y &&
        landingСoords.y <= leftTopCorner.y + size.height
    ) {
        return true;
    }

    return false;
}

enum RelativePosition {
    AFTER,
    BEFORE,
    IN,
}

interface InsertionPosition {
    position: RelativePosition;
    index: number;
    parent?: ButchObj;
}

// function binarySearch(content: ButchObj[], landingСoords: Coordinates): InsertionPosition {
//     let left = 0;
//     let right = content.length - 1;
//     let mid = ~~((left + right) / 2);

//     while (left <= right) {
//         while (content[mid].extension.coordinates === undefined && mid <= right) {
//             mid = +1;
//         }

//         const bObjCoords = content[mid].extension.coordinates as Coordinates;
//         const bObjSize = content[mid].extension.size as Size;

//         if (isIntersects(bObjCoords, bObjSize, landingСoords))
//             return { position: RelativePosition.IN, index: mid };
//         else if (landingСoords.y > bObjCoords.y) {
//             left = mid + 1;
//         } else {
//             right = mid - 1;
//         }

//         mid = ~~((left + right) / 2);
//     }

//     if (left > right) {
//         return { position: RelativePosition.AFTER, index: mid };
//     }

//     return { position: RelativePosition.BEFORE, index: mid };
// }

// Здесь мы не можем выбрать элемент
function findCurrentElement(content: ButchObj[], landingСoords: Coordinates): InsertionPosition {
    let result: InsertionPosition = { position: RelativePosition.AFTER, index: 0 };

    for (let i = 0; i < content.length; i++) {
        if (content[i].extension.coordinates === undefined) {
            result.index = i;
            continue;
        }

        const bObjCoords = content[i].extension.coordinates as Coordinates;
        const bObjSize = content[i].extension.size as Size;

        if (isIntersects(bObjCoords, bObjSize, landingСoords)) {
            result = { position: RelativePosition.IN, index: i };
            break;
        } else if (landingСoords.y > bObjCoords.y) {
            result = { position: RelativePosition.AFTER, index: i };
        } else {
            result = { position: RelativePosition.BEFORE, index: i };
            // Не уверен насчёт break;
            break;
        }
    }

    return result;
}

function checkHeight(
    element: ButchObj,
    index: number,
    landingCoords: Coordinates,
): InsertionPosition {
    const yCoords =
        element.extension.coordinates?.y ??
        DRErrors.unexpectedUndefined("element.extension.coordinates");
    const halfHeight =
        element.extension.size?.height ??
        DRErrors.unexpectedUndefined("element.extension.size") / 2;

    if (landingCoords.y > yCoords + halfHeight) {
        return { position: RelativePosition.AFTER, index: index };
    } else {
        return { position: RelativePosition.BEFORE, index: index };
    }
}

// Maybe use indices
function findInsertionPosition(
    parent: ButchObj,
    bObj: ButchObj[] | undefined,
    landingCoords: Coordinates,
): InsertionPosition | undefined {
    if (bObj === undefined) return undefined;

    const bsResult = findCurrentElement(bObj, landingCoords);
    let result: InsertionPosition;
    switch (bsResult.position) {
        case RelativePosition.IN:
            result = findInsertionPosition(
                bObj[bsResult.index],
                bObj[bsResult.index].content,
                landingCoords,
            ) ?? {
                ...checkHeight(bObj[bsResult.index], bsResult.index, landingCoords),
                parent: parent,
            };
            break;

        case RelativePosition.AFTER:
            result = { ...bsResult, parent: parent };
            break;

        // BEFORE
        default:
            result = { ...bsResult, parent: parent };
            break;
    }

    return result;
}

export function deleteElement(globalBObj: ButchObj, deletableElement: ButchObj) {
    if (deletableElement.parent === undefined) {
        if (globalBObj.content === undefined) {
            DRErrors.unexpectedUndefined("deleteElement->globalBObj.content");
        }

        for (let i = 0; i < globalBObj.content.length; i++) {
            if (globalBObj.content[i] == deletableElement) {
                // for (let j = 0; j < i; j++) {

                // }

                // Возможно это не работает

                globalBObj.content.splice(i, 1);
                globalBObj.content = globalBObj.content;
                return;
            }
        }

        return;
    } else if (deletableElement.parent.content === undefined) {
        DRErrors.unexpectedUndefined("deleteElement->deletableElement.parent.content");
    }

    for (let i = 0; i < deletableElement.parent.content.length; i++) {
        if (deletableElement.parent.content[i] == deletableElement) {
            deletableElement.parent.content.splice(i, 1);
            deletableElement.parent.content = deletableElement.parent.content;
            return;
        }
    }

    return;
}

export function changePosition(
    globalBObj: ButchObj,
    elementToAdd: ButchObj,
    landingCoords: Coordinates,
) {
    const result =
        findInsertionPosition(globalBObj, globalBObj.content, landingCoords) ??
        DRErrors.unexpectedUndefined("findCoordinates(bObj.content, landingCoords, bObj)");

    if (result.parent?.content === undefined) return;

    const newContent = [];
    for (let i = 0; i < result.index; i++) {
        newContent.push(result.parent.content[i]);
    }

    // Запушить новый элемент
    newContent.push(elementToAdd);

    for (let i = result.index + 1; i < result.parent.content.length; i++) {
        newContent.push(result.parent.content[i]);
    }
}
