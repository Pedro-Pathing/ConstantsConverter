import type {PathConstraints} from "./constraints";
import type {AllPIDCoefficients} from "./coefficients";
import type {Localizer} from "./determine-localizer";

export function buildConstants(
    drivetrainConstants: Record<string, string>,
    followerConstants: Record<string, string>,
    localizer: Localizer,
    localizerConstants: Record<string, string>,
    pathConstraints: PathConstraints,
    pidCoefficients: AllPIDCoefficients
): string {
    let result = "public class Constants {";

    // Follower Constants:
    result += "public static FollowerConstants followerConstants = new FollowerConstants()";
    for (const [name, value] of Object.entries(followerConstants)) {
        result += `.${name}(${value})`;
    }

    // PID Coefficients:
    result += `.translationalPIDFCoefficients(new PIDFCoefficients(${pidCoefficients.translational.kP}, ${pidCoefficients.translational.kI}, ${pidCoefficients.translational.kD}, ${pidCoefficients.translational.kF}))`;
    result += `.headingPIDFCoefficients(new PIDFCoefficients(${pidCoefficients.heading.kP}, ${pidCoefficients.heading.kI}, ${pidCoefficients.heading.kD}, ${pidCoefficients.heading.kF}))`;
    result += `.drivePIDFCoefficients(new PIDFCoefficients(${pidCoefficients.drive.kP}, ${pidCoefficients.drive.kI}, ${pidCoefficients.drive.kD}, ${pidCoefficients.drive.kT}, ${pidCoefficients.drive.kF}))`;
    if (pidCoefficients.secondaryTranslational) {
        result += `.secondaryTranslationalPIDFCoefficients(new PIDFCoefficients(${pidCoefficients.secondaryTranslational.kP}, ${pidCoefficients.secondaryTranslational.kI}, ${pidCoefficients.secondaryTranslational.kD}, ${pidCoefficients.secondaryTranslational.kF}))`;
    }
    if (pidCoefficients.secondaryHeading) {
        result += `.secondaryHeadingPIDFCoefficients(new PIDFCoefficients(${pidCoefficients.secondaryHeading.kP}, ${pidCoefficients.secondaryHeading.kI}, ${pidCoefficients.secondaryHeading.kD}, ${pidCoefficients.secondaryHeading.kF}))`;
    }
    if (pidCoefficients.secondaryDrive) {
        result += `.secondaryDrivePIDFCoefficients(new PIDFCoefficients(${pidCoefficients.secondaryDrive.kP}, ${pidCoefficients.secondaryDrive.kI}, ${pidCoefficients.secondaryDrive.kD}, ${pidCoefficients.secondaryDrive.kT}, ${pidCoefficients.secondaryDrive.kF}))`;
    }
    result += ";\n\n";

    // Drivetrain Constants:
    result += "public static MecanumConstants driveConstants = new MecanumConstants()";
    for (const [name, value] of Object.entries(drivetrainConstants)) {
        result += `.${name}(${value})`
    }
    result += ";\n\n";

    // Localizer Constants:
    result += `public static ${localizer.constants} localizerConstants = new ${localizer.constants}()`;
    for (const [name, value] of Object.entries(localizerConstants)) {
        result += `.${name}(${value})`
    }
    result += ";\n\n";

    // Path Constraints:
    result += `public static PathConstraints pathConstraints = new PathConstraints(${pathConstraints.tValueConstraint}, ${pathConstraints.timeoutConstraint}, ${pathConstraints.brakingStrength}, ${pathConstraints.brakingStart})`;
    result += ";\n\n";

    // Follower Factory:
    result += "public static Follower createFollower(HardwareMap hardwareMap) {"
    result += "return new FollowerBuilder(followerConstants, hardwareMap)"
    result += ".mecanumDrivetrain(driveConstants)";
    result += `.${localizer.builderFunction}(localizerConstants)`;
    result += `.pathConstraints(pathConstraints)`;
    result += `.build();`;
    result += "}}";

    return result;
}