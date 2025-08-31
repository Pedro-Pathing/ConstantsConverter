import {type Localizer, localizers} from "./determine-localizer";

export function getLocalizerConstants(
    localizer: Localizer,
    lConstants: string,
    drivetrainConstants: Record<string, string>,
): Record<string, string> {
    const constants: Record<string, string> = {}
    const validConstants = validLocalizerConstants.get(localizer)!;

    const pattern = new RegExp(`${localizer.constants}\\s*\\.([a-zA-Z_]+)\\s*=\\s*(.+);`, "g")

    const matches = lConstants.matchAll(pattern);

    for (const match of matches) {
        if (validConstants.includes(match[1])) {
            constants[match[1]] = match[2];
        } else if (validConstants.filter(constant => typeof constant !== "string").map(constant => constant.old).includes(match[1])) {
            constants[validConstants.filter(constant => typeof constant !== "string").find(constant => constant.old === match[1])!.new] = match[2];
        }
    }

    if (localizer === localizers.driveEncoders) {
        constants.leftFrontMotorName = drivetrainConstants.leftFrontMotorName;
        constants.rightFrontMotorName = drivetrainConstants.rightFrontMotorName;
        constants.leftRearMotorName = drivetrainConstants.leftRearMotorName;
        constants.rightRearMotorName = drivetrainConstants.rightRearMotorName;
    }

    return constants;
}

const validLocalizerConstants = new Map<Localizer, (string | { old: string, new: string })[]>([
    [localizers.driveEncoders, [
        "forwardTicksToInches",
        "strafeTicksToInches",
        "turnTicksToInches",
        {old: "robot_Width", new: "robotWidth"},
        {old: "robot_Length", new: "robotLength"},
        "leftFrontEncoderDirection",
        "rightFrontEncoderDirection",
        "leftRearEncoderDirection",
        "rightRearEncoderDirection"
    ]],
    [localizers.otos, [
        "hardwareMapName",
        "linearUnit",
        "angleUnit",
        "offset",
        "linearScalar",
        "angularScalar"
    ]],
    [localizers.pinpoint, [
        {old: "forwardY", new: "forwardPodY"},
        {old: "strafeX", new: "strafePodX"},
        "distanceUnit",
        "hardwareMapName",
        "yawScalar",
        "encoderResolution",
        "customEncoderResolution",
        "forwardEncoderDirection",
        "strafeEncoderDirection"
    ]],
    [localizers.threeWheel, [
        "forwardTicksToInches",
        "strafeTicksToInches",
        "turnTicksToInches",
        {old: "leftY", new: "leftPodY"},
        {old: "rightY", new: "rightPodY"},
        {old: "strafeX", new: "strafePodX"},
        "leftEncoder_HardwareMapName",
        "rightEncoder_HardwareMapName",
        "strafeEncoder_HardwareMapName",
        "leftEncoderDirection",
        "rightEncoderDirection",
        "strafeEncoderDirection"
    ]],
    [localizers.threeWheelImu, [
        "forwardTicksToInches",
        "strafeTicksToInches",
        "turnTicksToInches",
        {old: "leftY", new: "leftPodY"},
        {old: "rightY", new: "rightPodY"},
        {old: "strafeX", new: "strafePodX"},
        "IMU_HardwareMapName",
        "leftEncoder_HardwareMapName",
        "rightEncoder_HardwareMapName",
        "strafeEncoder_HardwareMapName",
        "leftEncoderDirection",
        "rightEncoderDirection",
        "strafeEncoderDirection",
        "IMU_Orientation"
    ]],
    [localizers.twoWheel, [
        "forwardTicksToInches",
        "strafeTicksToInches",
        {old: "forwardY", new: "forwardPodY"},
        {old: "strafeX", new: "strafePodX"},
        "IMU_HardwareMapName",
        "forwardEncoder_HardwareMapName",
        "strafeEncoder_HardwareMapName",
        "forwardEncoderDirection",
        "strafeEncoderDirection",
        "IMU_Orientation"
    ]]
]);