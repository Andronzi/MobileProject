import { Coordinates, Size } from "./../types/Types";
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
    index: number;
}

function binarySearch(content: ButchObj[], landingСoords: Coordinates): BinarySearchReturn {
    let left = 0;
    let right = content.length - 1;
    let mid = ~~((left + right) / 2);

    while (left <= right) {
        const bObjCoords =
            (content[mid].extension.coordinates as Coordinates) ??
            DRErrors.unexpectedUndefined("content[mid].extension.coordinates");
        const bObjSize =
            (content[mid].extension.size as Size) ??
            DRErrors.unexpectedUndefined("content[mid].extension.size");

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

export function findCoordinates(bObj: ButchObj, landingСoords: Coordinates) {
    if (bObj.content === undefined) return;
    
    // const bObjCoords =
    //     (bObj?.extension.coordinates as Coordinates) ??
    //     DRErrors.unexpectedUndefined("bObj.extension.coordinates");
    // const bObjSize =
    //     (bObj?.extension.size as Size) ?? DRErrors.unexpectedUndefined("bObj.extension.size");

    const bsResult = binarySearch(bObj.content, landingСoords);
}
