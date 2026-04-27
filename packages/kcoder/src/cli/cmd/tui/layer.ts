import { Layer } from "effect"
import { TuiConfig } from "./config/tui"
import { Npm } from "@kcoder/core/npm"
import { Observability } from "@kcoder/core/effect/observability"

export const CliLayer = Observability.layer.pipe(Layer.merge(TuiConfig.layer), Layer.provide(Npm.defaultLayer))
