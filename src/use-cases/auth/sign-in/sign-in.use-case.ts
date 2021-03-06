import { inject, injectable } from "inversify";
import { pick } from "lodash";

import { User } from "../../../core/components/user/entities/user.entity";
import { FindUserService } from "../../../core/components/user/services/find-user.service";
import { DomainBaseException } from "../../../core/shared/exceptions/domain-base.exception";
import { JwtService, JwtServiceInjectionToken } from "../../../secondary-adapters/services/jwt/jwt-service.interface";
import { BaseUseCase } from "../../base.use-case";
import { SignInValidationSchema } from "./sign-in.validation-schema";

const PublicFields: Readonly<Array<keyof User>> = [
    "email",
    "entityId",
    "login",
] as const;

interface Input {
    login: string;
    password: string;
    email: string;
}

export type SignInUseCaseResult = Pick<User, typeof PublicFields[number]> & { accessToken: string };

@injectable()
export class SignInUseCase extends BaseUseCase<Input, SignInUseCaseResult> {
    public constructor(
        @inject(FindUserService) private readonly userService: FindUserService,
        @inject(JwtServiceInjectionToken) private readonly jwtService: JwtService,
    ) {
        super();
    }

    protected async validate({ login, password, }: Pick<User, "login"> & { password: string }): Promise<void> {
        await SignInValidationSchema.validateAsync({ login,
            password, });
    }

    protected async handleRequest({ login, password, }) {
        const user = await this.userService.findByUsername(login);
        if (!user) {
            throw new DomainBaseException("User not found");
        }

        const isPasswordValid = await user.validatePassword(password, user.passwordHash);
        if (!isPasswordValid) {
            throw new DomainBaseException("Invalid password");
        }

        const token = await this.jwtService.sign({ userId: user.entityId, });

        return {
            ...user,
            access_token: token,
        };
    }

    protected trimResultData(data: User & { access_token: string }): SignInUseCaseResult {
        return {
            ...pick<User, typeof PublicFields[number]>(data, PublicFields),
            accessToken: data.access_token,
        };
    }
}
