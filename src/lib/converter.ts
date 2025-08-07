export class ConversionError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "ConversionError";
    }
}

export function convert(
    fConstants: string,
    lConstants: string
): string {
    const parsedFConstants = getConstants(fConstants, "FollowerConstants");
    const pidfCoefficients = getPIDFCoefficients(fConstants);
    if (!parsedFConstants["localizers"]) throw new ConversionError("Localizer not found");
    let localizer: [string, string];
    switch (parsedFConstants["localizers"]) {
        case "Localizers.DRIVE_ENCODERS":
            localizer = ["DriveEncoderConstants", "driveEncoderLocalizer"];
            break;
        case "Localizers.TWO_WHEEL":
            localizer = ["TwoWheelConstants", "twoWheelLocalizer"];
            break;
        case "Localizers.THREE_WHEEL":
            localizer = ["ThreeWheelConstants", "threeWheelLocalizer"];
            break;
        case "Localizers.THREE_WHEEL_IMU":
            localizer = ["ThreeWheelIMUConstants", "threeWheelIMULocalizer"];
            break;
        case "Localizers.OTOS":
            localizer = ["OTOSConstants", "OTOSLocalizer"];
            break;
        case "Localizers.PINPOINT":
            localizer = ["PinpointConstants", "pinpointLocalizer"];
            break;
        default:
            throw new ConversionError("Invalid localizer.");
    }
    const parsedLConstants = getConstants(lConstants, localizer[0]);
    return buildConstants(parsedFConstants, pidfCoefficients, localizer, parsedLConstants);
}

function getConstants(
    text: string,
    constantsName: string
): Record<string, string> {
    const pattern = new RegExp(`${constantsName}\\.(\\w+)\\s*=\\s*([^;]+);`, "g")

    return [...text.matchAll(pattern)]
        .map(([, key, raw]) => [key, raw.trim()])
        .reduce((acc, [key, value]) => {
            acc[key] = value;
            return acc;
        }, {});
}

function getPIDFCoefficients(
    fConstants: string
): Record<string, string> {
    const pattern = /([a-zA-Z_$][\\w$]*)\\.setCoefficients(\\([^)]*\\))/g

    return [...fConstants.matchAll(pattern)]
        .map(([, key, raw]) => [key, raw.trim()])
        .reduce((acc, [key, value]) => {
            acc[key] = value;
            return acc;
        }, {});
}

const validFollowerConstants = [
    "translationalPIDFCoefficients",
    "translationalIntegral",
    "translationalPIDFFeedForward",
    "headingPIDFCoefficients",
    "headingPIDFFeedForward",
    "drivePIDFCoefficients",
    "drivePIDFFeedForward",
    "secondaryTranslationalPIDFCoefficients",
    "secondaryTranslationalIntegral",
    "secondaryTranslationalPIDFFeedForward",
    "headingPIDFSwitch",
    "secondaryHeadingPIDFCoefficients",
    "secondaryHeadingPIDFFeedForward",
    "drivePIDFSwitch",
    "secondaryDrivePIDFCoefficients",
    "secondaryDrivePIDFFeedForward",
    "holdPointTranslationalScaling",
    "holdPointHeadingScaling",
    "BEZIER_CURVE_SEARCH_LIMIT",
    "useSecondaryTranslationalPIDF",
    "useSecondaryHeadingPIDF",
    "useSecondaryDrivePIDF",
    "translationalPIDFSwitch",
    "turnHeadingErrorThreshold",
    "centripetalScaling",
    "automaticHoldEnd",
    "mass",
    "forwardZeroPowerAcceleration",
    "lateralZeroPowerAcceleration"
]

const validMecanumConstants = [
    "xMovement",
    "yMovement",
    "maxPower",
    "leftFrontMotorName",
    "leftRearMotorName",
    "rightFrontMotorName",
    "rightRearMotorName",
    "leftFrontMotorDirection",
    "leftRearMotorDirection",
    "rightFrontMotorDirection",
    "rightRearMotorDirection",
    "motorCachingThreshold",
    "useBrakeModeInTeleOp"
]

function buildConstants(
    fConstants: Record<string, string>,
    pidfCoefficients: Record<string, string>,
    localizer: [string, string],
    lConstants: Record<string, string>
): string {
    let result = "public class Constants {";
    result += "public static FollowerConstants followerConstants = new FollowerConstants()";
    for (const [name, value] of Object.entries(fConstants)) {
        if (validFollowerConstants.includes(name)) result += `.${name}(${value})`
    }
    for (const [name, value] of Object.entries(pidfCoefficients)) {
        result += `.${name}(new PIDFCoefficients${value})`
    }
    result += ";\n\n";
    result += "public static MecanumConstants driveConstants = new MecanumConstants()";
    for (const [name, value] of Object.entries(fConstants)) {
        if (validMecanumConstants.includes(name)) result += `.${name}(${value})`
    }
    result += ";\n\n";
    result += `public static ${localizer[0]} localizerConstants = new ${localizer[0]}()`;
    for (const [name, value] of Object.entries(lConstants)) {
        result += `.${name}(${value})`
    }
    result += ";\n\n";
    const tValueConstraint = fConstants["pathEndTValueConstraint"] ?? "0.995"
    const velocityConstraint = fConstants["pathEndVelocityConstraint"] ?? "0.1"
    const translationalConstraint = fConstants["pathEndTranslationalConstraint"] ?? "0.1"
    const headingConstraint = fConstants["pathEndHeadingConstraint"] ?? "0.007"
    const timeoutConstraint = fConstants["pathEndTimeoutConstraint"] ?? "100"
    const zeroPowerAccelerationMultiplier = fConstants["zeroPowerAccelerationMultiplier"] ?? "4"
    const BEZIER_CURVE_SEARCH_LIMIT = fConstants["BEZIER_CURVE_SEARCH_LIMIT"] ?? "10"
    const decelerationStartMultiplier = "1";
    result += `public static PathConstraints pathConstraints = new PathConstraints(${tValueConstraint}, ${velocityConstraint}, ${translationalConstraint}, ${headingConstraint}, ${timeoutConstraint}, ${zeroPowerAccelerationMultiplier}, ${BEZIER_CURVE_SEARCH_LIMIT}, ${decelerationStartMultiplier});\n\n`;
    result += "public static Follower createFollower(HardwareMap hardwareMap) {"
    result += "return new FollowerBuilder(followerConstants, hardwareMap)"
    result += ".mecanumDrivetrain(driveConstants)"
    result += `.${localizer[1]}(localizerConstants)`
    result += `.pathConstraints(pathConstraints)`
    result += `.build();`
    result += "}}"
    result = result
    .replace(/\.forwardY\(/g, ".forwardPodY(")
    .replace(/\.strafeX\(/g, ".strafePodX(");
    return result;
}
