import { SetMetadata } from "@nestjs/common";

export const NeedLogin = () => SetMetadata('needLogin', true)