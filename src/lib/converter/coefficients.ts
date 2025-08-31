export function getCoefficients(
    fConstants: string,
    followerConstants: Record<string, string>
): AllPIDCoefficients {
    const coefficients: AllPIDCoefficients = {
        heading: {kP: 1, kI: 0, kD: 0, kF: 0.01},
        translational: {kP: 0.1, kI: 0, kD: 0, kF: 0.015},
        drive: {kP: 0.025, kI: 0, kD: 0.00001, kF: 0.01, kT: 0.6}
    }

    checkStandardCoefficients(coefficients, fConstants, followerConstants);
    checkDriveCoefficients(coefficients, fConstants, followerConstants);
    checkFeedforwards(coefficients, fConstants);

    return coefficients;
}

export type PIDFCoefficients = { kP: number, kI: number, kD: number, kF: number };
export type FilteredPIDFCoefficients = { kP: number, kI: number, kD: number, kF: number, kT: number };

export type AllPIDCoefficients = {
    heading: PIDFCoefficients;
    translational: PIDFCoefficients;
    drive: FilteredPIDFCoefficients;
    secondaryHeading?: PIDFCoefficients;
    secondaryTranslational?: PIDFCoefficients;
    secondaryDrive?: FilteredPIDFCoefficients;
}

function checkStandardCoefficients(
    coefficients: AllPIDCoefficients,
    fConstants: string,
    followerConstants: Record<string, string>
) {
    const pattern = /FollowerConstants\s*\.([a-zA-Z]+)\s*\.setCoefficients\(\s*([0-9.]+),\s*([0-9.]+),\s*([0-9.]+),\s*[0-9.]+\s*\);/g
    const matches = fConstants.matchAll(pattern);

    for (const match of matches) {
        switch (match[1]) {
            case "headingPIDFCoefficients":
                coefficients.heading = {
                    kP: parseFloat(match[2]),
                    kI: parseFloat(match[3]),
                    kD: parseFloat(match[4]),
                    kF: 0
                };
                break;
            case "translationalPIDFCoefficients":
                coefficients.translational = {
                    kP: parseFloat(match[2]),
                    kI: parseFloat(match[3]),
                    kD: parseFloat(match[4]),
                    kF: 0
                };
                break;
            case "secondaryHeadingPIDFCoefficients":
                if (followerConstants.useSecondaryHeadingPIDF !== "true") break;
                coefficients.secondaryHeading = {
                    kP: parseFloat(match[2]),
                    kI: parseFloat(match[3]),
                    kD: parseFloat(match[4]),
                    kF: 0
                };
                break;
            case "secondaryTranslationalPIDFCoefficients":
                if (followerConstants.useSecondaryTranslationalPIDF !== "true") break;
                coefficients.secondaryTranslational = {
                    kP: parseFloat(match[2]),
                    kI: parseFloat(match[3]),
                    kD: parseFloat(match[4]),
                    kF: 0
                };
                break;
        }
    }
}

function checkDriveCoefficients(
    coefficients: AllPIDCoefficients,
    fConstants: string,
    followerConstants: Record<string, string>
) {
    const pattern = /FollowerConstants\s*\.([a-zA-Z]+)\s*\.setCoefficients\(\s*([0-9.]+),\s*([0-9.]+),\s*([0-9.]+),\s*([0-9.]+),\s*[0-9.]+\s*\);/g
    const matches = fConstants.matchAll(pattern);

    for (const match of matches) {
        switch (match[1]) {
            case "drivePIDFCoefficients":
                coefficients.drive = {
                    kP: parseFloat(match[2]),
                    kI: parseFloat(match[3]),
                    kD: parseFloat(match[4]),
                    kF: 0,
                    kT: parseFloat(match[5])
                };
                break;
            case "secondaryDrivePIDFCoefficients":
                if (followerConstants.useSecondaryDrivePIDF !== "true") break;
                coefficients.secondaryDrive = {
                    kP: parseFloat(match[2]),
                    kI: parseFloat(match[3]),
                    kD: parseFloat(match[4]),
                    kF: 0,
                    kT: parseFloat(match[5])
                }
                break;
        }
    }
}

function checkFeedforwards(
    coefficients: AllPIDCoefficients,
    fConstants: string
) {
    const pattern = /FollowerConstants\s*\.([a-zA-Z]+)FeedForward\s*=\s*([0-9.]+);/g
    const matches = fConstants.matchAll(pattern);

    for (const match of matches) {
        switch (match[1]) {
            case "headingPIDF":
                coefficients.heading.kF = parseFloat(match[2]);
                break;
            case "translationalPIDF":
                coefficients.translational.kF = parseFloat(match[2]);
                break;
            case "drivePIDF":
                coefficients.drive.kF = parseFloat(match[2]);
                break;
            case "secondaryHeadingPIDF":
                if (coefficients.secondaryHeading) {
                    coefficients.secondaryHeading.kF = parseFloat(match[2]);
                }
                break;
            case "secondaryTranslationalPIDF":
                if (coefficients.secondaryTranslational) {
                    coefficients.secondaryTranslational.kF = parseFloat(match[2]);
                }
                break;
            case "secondaryDrivePIDF":
                if (coefficients.secondaryDrive) {
                    coefficients.secondaryDrive.kF = parseFloat(match[2]);
                }
                break;
        }
    }
}