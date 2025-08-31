export function getDrivetrainConstants(
    fConstants: string
): Record<string, string> {
    const constants: Record<string, string> = {}

    const pattern = /FollowerConstants\.(\w+)\s*=\s*(.+);/g;
    const matches = fConstants.matchAll(pattern);
    for (const match of matches) {
        if (validDrivetrainConstants.includes(match[1])) {
            constants[match[1]] = match[2];
        } else if (validDrivetrainConstants.filter(constant => typeof constant !== "string").map(constant => constant.old).includes(match[1])) {
            constants[validDrivetrainConstants.filter(constant => typeof constant !== "string").find(constant => constant.old === match[1])!.new] = match[2];
        }
    }

    return constants;
}

const validDrivetrainConstants: (string | { old: string, new: string })[] = [
    {old: "xMovement", new: "xVelocity"},
    {old: "yMovement", new: "yVelocity"},
    "leftFrontMotorName",
    "rightFrontMotorName",
    "leftRearMotorName",
    "rightRearMotorName",
    "leftFrontMotorDirection",
    "rightFrontMotorDirection",
    "leftRearMotorDirection",
    "rightRearMotorDirection",
    "motorCachingThreshold",
    "useBrakeModeInTeleOp",
    {old: "useVoltageCompensationInAuto", new: "useVoltageCompensation"},
    "nominalVoltage"
]