export type PathConstraints = {
    tValueConstraint: number;
    timeoutConstraint: number;
    brakingStrength: number;
    brakingStart: number;
}

export function getPathConstraints(
    fConstants: string
): PathConstraints {
    return {
        tValueConstraint: getTValueConstraint(fConstants),
        timeoutConstraint: getTimeoutConstraint(fConstants),
        brakingStrength: getBrakingStrength(fConstants),
        brakingStart: 1
    }
}

function getTValueConstraint(fConstants: string): number {
    const pattern = /FollowerConstants\.pathEndTValueConstraint\s*=\s*([\d.]+);/;
    const match = fConstants.match(pattern);
    if (!match) return 0.99;
    return parseFloat(match[1]);
}

function getTimeoutConstraint(fConstants: string): number {
    const pattern = /FollowerConstants\.pathEndTimeoutConstraint\s*=\s*([\d.]+);/;
    const match = fConstants.match(pattern);
    if (!match) return 100;
    return parseFloat(match[1]);
}

function getBrakingStrength(fConstants: string): number {
    const pattern  = /FollowerConstants\.zeroPowerAccelerationMultiplier\s*=\s*([\d.]+);/;
    const match = fConstants.match(pattern);
    if (!match) return 1;
    return parseFloat(match[1]) / 4;
}