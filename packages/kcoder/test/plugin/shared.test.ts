import { describe, expect, test } from "bun:test"
import { parsePluginSpecifier } from "../../src/plugin/shared"

describe("parsePluginSpecifier", () => {
  test("parses standard npm package without version", () => {
    expect(parsePluginSpecifier("acme")).toEqual({
      pkg: "acme",
      version: "latest",
    })
  })

  test("parses standard npm package with version", () => {
    expect(parsePluginSpecifier("acme@1.0.0")).toEqual({
      pkg: "acme",
      version: "1.0.0",
    })
  })

  test("parses scoped npm package without version", () => {
    expect(parsePluginSpecifier("@kcoder/acme")).toEqual({
      pkg: "@kcoder/acme",
      version: "latest",
    })
  })

  test("parses scoped npm package with version", () => {
    expect(parsePluginSpecifier("@kcoder/acme@1.0.0")).toEqual({
      pkg: "@kcoder/acme",
      version: "1.0.0",
    })
  })

  test("parses package with git+https url", () => {
    expect(parsePluginSpecifier("acme@git+https://github.com/kcoder/acme.git")).toEqual({
      pkg: "acme",
      version: "git+https://github.com/kcoder/acme.git",
    })
  })

  test("parses scoped package with git+https url", () => {
    expect(parsePluginSpecifier("@kcoder/acme@git+https://github.com/kcoder/acme.git")).toEqual({
      pkg: "@kcoder/acme",
      version: "git+https://github.com/kcoder/acme.git",
    })
  })

  test("parses package with git+ssh url containing another @", () => {
    expect(parsePluginSpecifier("acme@git+ssh://git@github.com/kcoder/acme.git")).toEqual({
      pkg: "acme",
      version: "git+ssh://git@github.com/kcoder/acme.git",
    })
  })

  test("parses scoped package with git+ssh url containing another @", () => {
    expect(parsePluginSpecifier("@kcoder/acme@git+ssh://git@github.com/kcoder/acme.git")).toEqual({
      pkg: "@kcoder/acme",
      version: "git+ssh://git@github.com/kcoder/acme.git",
    })
  })

  test("parses unaliased git+ssh url", () => {
    expect(parsePluginSpecifier("git+ssh://git@github.com/kcoder/acme.git")).toEqual({
      pkg: "git+ssh://git@github.com/kcoder/acme.git",
      version: "",
    })
  })

  test("parses npm alias using the alias name", () => {
    expect(parsePluginSpecifier("acme@npm:@kcoder/acme@1.0.0")).toEqual({
      pkg: "acme",
      version: "npm:@kcoder/acme@1.0.0",
    })
  })

  test("parses bare npm protocol specifier using the target package", () => {
    expect(parsePluginSpecifier("npm:@kcoder/acme@1.0.0")).toEqual({
      pkg: "@kcoder/acme",
      version: "1.0.0",
    })
  })

  test("parses unversioned npm protocol specifier", () => {
    expect(parsePluginSpecifier("npm:@kcoder/acme")).toEqual({
      pkg: "@kcoder/acme",
      version: "latest",
    })
  })
})
