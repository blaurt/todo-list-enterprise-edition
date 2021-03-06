import { DomainBaseException } from "src/core/shared/exceptions/domain-base.exception";

export interface ErrorMapper {
    mapException<T extends Error>(exception: DomainBaseException): T;
}

export const ErrorMapperInjectionToken = Symbol("ErrorMapper");
