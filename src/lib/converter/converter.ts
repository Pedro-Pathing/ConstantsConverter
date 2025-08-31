import {determineLocalizer} from "./determine-localizer";
import {getDrivetrainConstants} from "./drivetrain";
import {getFollowerConstants} from "./follower";
import {getPathConstraints} from "./constraints";
import {getCoefficients} from "./coefficients";
import {getLocalizerConstants} from "./localizers";
import {buildConstants} from "./builder";

export class ConversionError {
    constructor(public message: string) {}
}

export function convert(
    fConstants: string,
    lConstants: string
): string | ConversionError {
    const localizer = determineLocalizer(fConstants);
    if (localizer instanceof ConversionError) return localizer;

    const drivetrainConstants = getDrivetrainConstants(fConstants);
    const followerConstants = getFollowerConstants(fConstants);
    const pathConstraints = getPathConstraints(fConstants);
    const pidCoefficients = getCoefficients(fConstants, followerConstants);
    const localizerConstants = getLocalizerConstants(localizer, lConstants, drivetrainConstants);

    return buildConstants(drivetrainConstants, followerConstants, localizer, localizerConstants, pathConstraints, pidCoefficients);
}