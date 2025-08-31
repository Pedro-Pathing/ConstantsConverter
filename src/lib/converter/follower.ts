export function getFollowerConstants(
    fConstants: string
): Record<string, string> {
    const constants: Record<string, string> = {}

    const pattern = /FollowerConstants\.(\w+)\s*=\s*(.+);/g;
    const matches = fConstants.matchAll(pattern);
    for (const match of matches) {
        if (match[1] === "translationalIntegral") {
            handleTranslationalIntegral(match[2], constants);
            continue;
        }
        if (validFollowerConstants.includes(match[1])) {
            constants[match[1]] = match[2];
        } else if (validFollowerConstants.filter(constant => typeof constant !== "string").map(constant => constant.old).includes(match[1])) {
            constants[validFollowerConstants.filter(constant => typeof constant !== "string").find(constant => constant.old === match[1])!.new] = match[2];
        }
    }

    return constants;
}

const validFollowerConstants: (string | { old: string, new: string })[] = [
    "headingPIDFSwitch",
    "drivePIDFSwitch",
    "holdPointTranslationalScaling",
    "holdPointHeadingScaling",
    "BEZIER_CURVE_SEARCH_LIMIT",
    {old: "useSecondaryTranslationalPID", new: "useSecondaryTranslationalPIDF"},
    {old: "useSecondaryHeadingPID", new: "useSecondaryHeadingPIDF"},
    {old: "useSecondaryDrivePID", new: "useSecondaryDrivePIDF"},
    "translationalPIDFSwitch",
    "turnHeadingErrorThreshold",
    "centripetalScaling",
    "automaticHoldEnd",
    "mass",
    "forwardZeroPowerAcceleration",
    "lateralZeroPowerAcceleration"
]

function handleTranslationalIntegral(integral: string, constants: Record<string, string>) {
    const pattern = /new PIDFCoefficients\([\d.]+,\w*([\d.]+),\w*[\d.]+,\w*[\d.]+\)/;
    const match = integral.match(pattern);
    if (!match) return;
    constants["translationalIntegral"] = match[0];
}