export type Configuration = {
    GIT_AGGREGATION_SERVICE_HOST: string
}

const base: Configuration = {
    GIT_AGGREGATION_SERVICE_HOST: "http://localhost:3001"
}

const environmentOverrides = {
    GIT_AGGREGATION_SERVICE_HOST: process.env.REACT_APP_CONFIG_GIT_AGGREGATION_SERVICE_HOST
}

function removeNullOrUndefinedProperties(withBlanks: Record<string, string | undefined>): Record<string, string | undefined> {
    return Object.fromEntries(Object.entries(withBlanks).filter(([, value])=>value != null));
}

const runtime: Configuration = Object.assign<Configuration, Record<string, string | undefined>>(base, removeNullOrUndefinedProperties(environmentOverrides));

export default runtime;