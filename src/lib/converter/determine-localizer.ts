import {ConversionError} from "./converter";

export function determineLocalizer(fConstants: string): Localizer | ConversionError {
    const pattern = /FollowerConstants\.localizers\s*=\s*Localizers\.([A-Z_]+)/;
    const match = fConstants.match(pattern);
    if (!match) return new ConversionError("Localizer not found.");
    return Object.values(localizers).find(l => l.enum === match[1]) || new ConversionError("Unknown localizer.");
}

export const localizers = {
    threeWheel: {
        enum: "THREE_WHEEL",
        constants: "ThreeWheelConstants",
        builderFunction: "threeWheelLocalizer"
    },
    twoWheel: {
        enum: "TWO_WHEEL",
        constants: "TwoWheelConstants",
        builderFunction: "twoWheelLocalizer"
    },
    threeWheelImu: {
        enum: "THREE_WHEEL_IMU",
        constants: "ThreeWheelIMUConstants",
        builderFunction: "threeWheelIMULocalizer"
    },
    driveEncoders: {
        enum: "DRIVE_ENCODERS",
        constants: "DriveEncoderConstants",
        builderFunction: "driveEncoderLocalizer"
    },
    pinpoint: {
        enum: "PINPOINT",
        constants: "PinpointConstants",
        builderFunction: "pinpointLocalizer"
    },
    otos: {
        enum: "OTOS",
        constants: "OTOSConstants",
        builderFunction: "OTOSLocalizer"
    }
} as const;

export type Localizer = typeof localizers[keyof typeof localizers];