import { Coordinates, Size } from "../Types/Types";
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

interface BinarySearchReturn {
    position: RelativePosition;
    index?: number;
}

function binarySearch(content: ButchObj[], landingСoords: Coordinates): BinarySearchReturn {
    let left = 0;
    let right = content.length - 1;
    let mid = ~~((left + right) / 2);

    while (left <= right) {
        while (content[mid].extension.coordinates === undefined && mid <= right) {
            mid = +1;
        }

        const bObjCoords = content[mid].extension.coordinates as Coordinates;
        const bObjSize = content[mid].extension.size as Size;

        if (isIntersects(bObjCoords, bObjSize, landingСoords))
            return { position: RelativePosition.IN, index: mid };
        else if (landingСoords.y > bObjCoords.y) {
            left = mid + 1;
        } else {
            right = mid - 1;
        }

        mid = ~~((left + right) / 2);
    }

    if (left > right) {
        return { position: RelativePosition.AFTER, index: mid };
    }

    return { position: RelativePosition.BEFORE, index: mid };
}

function findCurrentElement(content: ButchObj[], landingСoords: Coordinates): BinarySearchReturn {
    let result: BinarySearchReturn;

    for (let i = 0; i < content.length; i++) {
        if (content[i].extension.coordinates === undefined) {
            continue;
        }

        const bObjCoords = content[i].extension.coordinates as Coordinates;
        const bObjSize = content[i].extension.size as Size;

        if (isIntersects(bObjCoords, bObjSize, landingСoords)) {
            result = { position: RelativePosition.IN, index: i };
        }
    }
}

// Maybe use indices
function findCoordinates(
    bObj: ButchObj[] | undefined,
    landingCoords: Coordinates,
): ButchObj | void {
    if (bObj === undefined) return;

    const bsResult = binarySearch(bObj, landingCoords);
    let result: ButchObj;
    switch (bsResult.position) {
        case RelativePosition.IN:
            result =
                findCoordinates(bObj[bsResult.index].content, landingCoords) ??
                bObj[bsResult.index];
            break;

        case RelativePosition.AFTER:
            // result = findCoordinates(bObj[bsResult.index].content, landingCoords);
            break;

        // BEFORE
        default:
            // result = findCoordinates(bObj[bsResult.index].content, landingCoords);
            break;
    }

    return result;
}

export function changePosition(bObj: ButchObj[] | undefined, landingCoords: Coordinates) {}
