import { injectable } from "inversify";

import { appConfig } from "../../../configuration/app.config";
import { DomainBaseException } from "../../../core/shared/exceptions/domain-base.exception";
import { ConfigKeys, ConfigService } from "./config.interface";

type ConfigMap = Map<ConfigKeys, typeof appConfig[ConfigKeys]>;

@injectable()
export class AppConfigService implements ConfigService {
    private readonly values: ConfigMap;

    public constructor() {
        this.values = new Map(Object.entries(appConfig)) as ConfigMap;
    }

    // todo
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    public get(key: ConfigKeys) {
        const value = this.values.get(key);
        if (!value) {
            throw new DomainBaseException(`ConfigService has no value for key: "${key}"`);
        }

        return value;
    }
}
