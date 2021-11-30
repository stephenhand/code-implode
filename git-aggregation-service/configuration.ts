export type Configuration = {
    database: {
        host: string
    }
}

const defaultConfig: Configuration = {
    database: {
        host: "localhost"
    }
}

const environmentVariableOverrides: Record<string, (original:Configuration, value: string) => Configuration> = {
    GIT_AGGREGATION_DB_HOST: (original, value) => ({
        ...original,
        database: {
            ...original.database, host: value
        }
    })
}

function withEnvironmentVariableOverrides(original: Configuration): Configuration {
    return Object.entries(environmentVariableOverrides).reduce((previous, [envVar, mutator]) => {
        const envValue = process.env[envVar];
        if (envValue) {
            return mutator(previous, envValue);
        }
        return previous;
    }, original);
}

export const runtimeConfiguration = withEnvironmentVariableOverrides(defaultConfig);