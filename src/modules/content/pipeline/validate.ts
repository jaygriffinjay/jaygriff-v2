import ts from "typescript";

import {
  CONTENT_ALLOWED_MODULES,
  CONTENT_COMPONENT_NAMES,
} from "../whitelist";

export type ValidationError = {
  line: number;
  message: string;
};

const ALLOWED_NAMES = new Set<string>(CONTENT_COMPONENT_NAMES);
const ALLOWED_MODULES = new Set<string>(CONTENT_ALLOWED_MODULES);

/**
 * Checks that a content file only renders whitelisted components and contains
 * no embedded expressions, so it can be treated as data rather than code.
 *
 * Returns every problem found rather than throwing on the first one.
 */
export function validateContentSource(
  source: string,
  fileName = "content.tsx",
): ValidationError[] {
  const sourceFile = ts.createSourceFile(
    fileName,
    source,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TSX,
  );

  const errors: ValidationError[] = [];

  const lineOf = (node: ts.Node) =>
    sourceFile.getLineAndCharacterOfPosition(node.getStart(sourceFile)).line + 1;

  const visit = (node: ts.Node): void => {
    if (ts.isImportDeclaration(node)) {
      const specifier = node.moduleSpecifier;
      if (ts.isStringLiteral(specifier) && !ALLOWED_MODULES.has(specifier.text)) {
        errors.push({
          line: lineOf(node),
          message: `Import from "${specifier.text}" is not allowed in content.`,
        });
      }
    }

    // Catches both `{expr}` children and `prop={expr}` attribute values.
    if (ts.isJsxExpression(node)) {
      errors.push({
        line: lineOf(node),
        message: "Expressions are not allowed in content; use literal values.",
      });
    }

    if (ts.isJsxElement(node) || ts.isJsxSelfClosingElement(node)) {
      const tagName = ts.isJsxElement(node)
        ? node.openingElement.tagName
        : node.tagName;
      const name = tagName.getText(sourceFile);

      if (!ALLOWED_NAMES.has(name)) {
        errors.push({
          line: lineOf(node),
          message: `<${name}> is not a whitelisted content component.`,
        });
      }
    }

    ts.forEachChild(node, visit);
  };

  ts.forEachChild(sourceFile, visit);

  return errors;
}
