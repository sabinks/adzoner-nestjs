import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from 'passport-local'
import { LoginService } from "../login/login.service";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
    constructor(private loginService: LoginService) {
        super({ usernameField: 'email' })
    }

    async validate(email, password) {
        const user = await this.loginService.validateUser({ email, password })
        if (!user) {
            throw new UnauthorizedException()
        }
        return await this.loginService.generateJwt(user)
    }

}