import { readdirSync, readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import path from "node:path";

const require = createRequire(import.meta.url);
const ts = require("typescript");
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const pagesDirectory = path.join(root, "frontend/admin/shared-core/manifest/pages");
const errors = [];

function propertyName(property) {
  return ts.isPropertyAssignment(property) && (ts.isIdentifier(property.name) || ts.isStringLiteral(property.name))
    ? property.name.text
    : "";
}

function objectProperty(object, name) {
  return object.properties.find((property) => propertyName(property) === name);
}

function objectValue(object, name) {
  const property = objectProperty(object, name);
  return property && ts.isPropertyAssignment(property) ? property.initializer : undefined;
}

function objectFrom(expression) {
  return expression && ts.isObjectLiteralExpression(expression) ? expression : undefined;
}

function arrayFrom(expression) {
  return expression && ts.isArrayLiteralExpression(expression) ? expression : undefined;
}

function stringFrom(expression) {
  return expression && ts.isStringLiteral(expression) ? expression.text : undefined;
}

function report(file, node, message) {
  const position = node.getSourceFile().getLineAndCharacterOfPosition(node.getStart());
  errors.push(`${path.relative(root, file)}:${position.line + 1}:${position.character + 1} ${message}`);
}

function verifySection(file, section) {
  const type = stringFrom(objectValue(section, "type"));
  const fields = arrayFrom(objectValue(section, "fields"));
  const itemsKey = stringFrom(objectValue(section, "itemsKey"));
  const columns = objectValue(section, "columns");

  if (type !== "fields" && type !== "lineItems") {
    report(file, section, 'Detail section must declare type: "fields" or type: "lineItems".');
    return;
  }

  if (type === "fields") {
    if (!fields) report(file, section, 'A fields section must declare a fields array.');
    if (fields?.elements.some((field) => objectFrom(field) && stringFrom(objectValue(objectFrom(field), "type")) === "lineItems")) {
      report(file, section, 'A fields section cannot contain type: "lineItems"; declare a lineItems section instead.');
    }
    return;
  }

  if (fields) report(file, section, 'A lineItems section cannot declare fields; use itemsKey and columns.');
  if (!itemsKey) report(file, section, 'A lineItems section must declare itemsKey.');
  if (!columns) report(file, section, 'A lineItems section must declare columns.');
}

for (const fileName of readdirSync(pagesDirectory).filter((name) => name.endsWith(".config.jsx"))) {
  const file = path.join(pagesDirectory, fileName);
  const source = ts.createSourceFile(file, readFileSync(file, "utf8"), ts.ScriptTarget.Latest, true, ts.ScriptKind.JSX);
  source.forEachChild((statement) => {
    if (!ts.isVariableStatement(statement)) return;
    statement.declarationList.declarations.forEach((declaration) => {
      const config = objectFrom(declaration.initializer);
      const detailPage = config && objectFrom(objectValue(config, "detailPage"));
      const tabs = detailPage && arrayFrom(objectValue(detailPage, "tabs"));
      tabs?.elements.forEach((tabExpression) => {
        const tab = objectFrom(tabExpression);
        const sections = tab && arrayFrom(objectValue(tab, "sections"));
        sections?.elements.forEach((sectionExpression) => {
          const section = objectFrom(sectionExpression);
          if (section) verifySection(file, section);
        });
      });
    });
  });
}

if (errors.length) {
  console.error(`Admin detail contract: ${errors.length} violation(s).`);
  errors.forEach((error) => console.error(error));
  process.exitCode = 1;
} else {
  console.log("Admin detail contract: all configured detail sections are explicit and valid.");
}
