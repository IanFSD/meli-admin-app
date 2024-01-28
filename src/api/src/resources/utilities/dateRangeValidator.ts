import {
    registerDecorator,
    ValidationArguments,
    ValidationOptions,
    ValidatorConstraint,
    ValidatorConstraintInterface
} from "class-validator";

export interface IHasValidityRestriction {
    start?: Date;
    end?: Date;
}

@ValidatorConstraint({name: "dateRangeValidator", async: false})
export class DateRangeValidator implements ValidatorConstraintInterface {
    constructor(private message: string) {
    }

    validate(value: string, args: ValidationArguments) {
        const o = args.object as IHasValidityRestriction;
        // only when start and end values has been supplied
        if (o.start && o.end) {
            return o.start <= o.end;
        }

        return true;
    }

    defaultMessage(args: ValidationArguments) {
        return this.message;
    }
}

export function DateRangeStart(validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            name: "dateRangeStartValidator",
            target: object.constructor,
            propertyName: propertyName,
            constraints: [],
            options: validationOptions,
            validator: new DateRangeValidator(`${propertyName} must be before date range end`)
        });
    };
}

export function DateRangeEnd(validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            name: "dateRangeEndValidator",
            target: object.constructor,
            propertyName: propertyName,
            constraints: [],
            options: validationOptions,
            validator: new DateRangeValidator(`${propertyName} must be after date range start`)
        });
    };
}
