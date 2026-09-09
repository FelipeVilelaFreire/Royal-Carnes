import ts from 'typescript';
import postcss from 'postcss';
import path from 'node:path';

const copyProps = new Set(['title', 'label', 'placeholder', 'aria-label', 'alt', 'description', 'helperText', 'emptyMessage', 'tooltip', 'text', 'message']);
const emoji = /\p{Extended_Pictographic}|\p{Regional_Indicator}|[0-9#*]\uFE0F?\u20E3/u;
const physical = /#[\da-f]{3,8}\b|\b(?:rgb|rgba|hsl|hsla)\(|(?:^|[^\w.-])-?(?:\d*\.)?\d+(?:px|rem|em|pt|vh|vw|vmin|vmax)\b/i;
const normalize = (value) => value.replace(/\s+/g, ' ').trim();
const isWeb = (file) => /^frontend\/(?:client|admin)\/web\//.test(file) || /^frontend\/(?:foundation|product-components)\//.test(file) && !/(?:^|\/)native\//.test(file);
const isRender = (file) => /^frontend\/(?:client|admin)\/(?:web|mobile)\/src\//.test(file) || file.startsWith('frontend/product-components/');
const isTokenOwner = (file) => /^frontend\/foundation\/tokens\//.test(file) || /\/manifest\/theme(?:\/|\.)/.test(file);

export function analyze(file, source) {
  file = file.replaceAll('\\', '/');
  if (!file.startsWith('frontend/') || /(?:^|\/)(?:node_modules|dist|\.next)\//.test(file)) return [];
  const findings = [];
  const add = (rule, line, text, message) => findings.push({ file, rule, line, signature: `${rule}:${normalize(text)}`, message });
  if (file.endsWith('.css')) {
    if (!isWeb(file)) return [];
    let root;
    try { root = postcss.parse(source, { from: file }); }
    catch (error) { add('syntax', error.line || 1, error.reason, error.reason); return findings; }
    root.walkDecls((decl) => {
      if (!isTokenOwner(file) && physical.test(decl.value)) add('css-token', decl.source.start.line, decl.toString(), 'Use tokens; literal physical values/colors are not allowed here.');
      if (file.startsWith('frontend/foundation/ui/') && /--theme--/.test(decl.value)) add('ui-theme', decl.source.start.line, decl.toString(), 'UI CSS must consume Semi-composed, not Theme directly.');
    });
    return findings;
  }
  if (!/\.[cm]?[jt]sx?$/.test(file) || file.endsWith('.d.ts')) return [];
  const ast = ts.createSourceFile(file, source, ts.ScriptTarget.Latest, true, /\.tsx?$/.test(file) ? (file.endsWith('.tsx') ? ts.ScriptKind.TSX : ts.ScriptKind.TS) : ts.ScriptKind.JSX);
  const report = (rule, node, message) => add(rule, ast.getLineAndCharacterOfPosition(node.getStart(ast)).line + 1, node.getText(ast), message);
  for (const error of ast.parseDiagnostics) add('syntax', ast.getLineAndCharacterOfPosition(error.start || 0).line + 1, ts.flattenDiagnosticMessageText(error.messageText, ' '), 'Invalid source syntax.');
  const literalText = (node) => {
    if (!node) return undefined;
    if (ts.isStringLiteralLike(node)) return node.text;
    if (ts.isJsxExpression(node)) return literalText(node.expression);
    return undefined;
  };
  const variables = new Map();
  const collect = (node) => {
    if (ts.isVariableDeclaration(node) && ts.isIdentifier(node.name) && node.initializer) variables.set(node.name.text, node.initializer);
    ts.forEachChild(node, collect);
  };
  collect(ast);
  const spreadsStyle = (node, seen = new Set()) => {
    if (ts.isIdentifier(node)) {
      if (seen.has(node.text) || !variables.has(node.text)) return false;
      seen.add(node.text);
      return spreadsStyle(variables.get(node.text), seen);
    }
    return ts.isObjectLiteralExpression(node) && node.properties.some((prop) =>
      ts.isSpreadAssignment(prop) ? spreadsStyle(prop.expression, new Set(seen)) : prop.name && (prop.name.getText(ast) === 'style' || literalText(prop.name) === 'style'));
  };
  const checkImport = (node, specifier) => {
    const resolved = specifier.startsWith('.') ? path.posix.normalize(path.posix.join(path.posix.dirname(file), specifier)) : specifier;
    const target = resolved.replace(/^@royalprime\/(client|admin)\//, 'frontend/$1/shared-core/');
    if (isRender(file) && /(?:^|\/)(?:api|mocks|data-sources)(?:\/|$)|\.api(?:\.|$)|\.mock(?:\.|$)/.test(target)) report('render-import', node, 'Render must consume hooks/view-models, not API clients or mocks/data sources.');
    if (isRender(file) && /(?:^|\/)(?:locales|strings)\/[a-z]{2}-[A-Z]{2}(?:[/.]|$)/.test(target)) report('fixed-locale', node, 'Use active strings rather than a fixed locale import.');
    if (/^frontend\/client\//.test(file) && /(?:^|\/)admin\/(?:shared-core|web)/.test(target) || /^frontend\/admin\//.test(file) && /(?:^|\/)client\/(?:shared-core|web)/.test(target)) report('surface-boundary', node, 'Client and admin must not import private code from each other.');
    if (file.startsWith('frontend/foundation/') && /(?:@shared-core|@royalprime|frontend\/(?:shared-core|client|admin))/.test(target)) report('foundation-boundary', node, 'Foundation cannot depend on product shared-core.');
    if (isRender(file) && /(?:legacy|transitional)\/(?:app-shell|design-system)/.test(target)) report('legacy-import', node, 'Use public Foundation rather than introducing legacy dependencies.');
    if (isWeb(file) && /\.css$/.test(target) && !/\.module\.css$/.test(target)) report('css-module', node, 'Use CSS Modules; global reset imports belong to established bootstrap only.');
  };
  const visit = (node) => {
    if (ts.isImportDeclaration(node) || ts.isExportDeclaration(node)) {
      if (node.moduleSpecifier && ts.isStringLiteralLike(node.moduleSpecifier)) checkImport(node, node.moduleSpecifier.text);
    }
    if (ts.isCallExpression(node)) {
      const name = node.expression.getText(ast);
      if ((name === 'require' || node.expression.kind === ts.SyntaxKind.ImportKeyword) && node.arguments[0] && ts.isStringLiteralLike(node.arguments[0])) checkImport(node, node.arguments[0].text);
      if (isRender(file) && /^(?:(?:window|globalThis)\.)?fetch$|^axios(?:\.|$)/.test(name)) report('render-network', node, 'Network access belongs to shared-core API clients.');
    }
    if (isWeb(file) && ts.isJsxAttribute(node) && node.name.getText(ast) === 'style') report('inline-style', node, 'Use CSS Modules or semantic Foundation props; style objects/variables are prohibited.');
    if (isWeb(file) && ts.isJsxSpreadAttribute(node) && spreadsStyle(node.expression)) report('inline-style', node, 'A local props spread contains style; use CSS Modules or semantic props.');
    if (isWeb(file) && (ts.isJsxOpeningElement(node) || ts.isJsxSelfClosingElement(node))) {
      const tag = node.tagName.getText(ast);
      if (tag === 'style' || tag === 'svg') report('inline-visual', node, 'Use CSS Modules and Foundation icons, not local style/SVG tags.');
      if (!file.endsWith('.tsx')) report('tsx-component', node, 'New web JSX components must use .tsx.');
    }
    if (ts.isJsxText(node) && node.text.trim()) report('ui-copy', node, 'UI text must come from active locale keys.');
    if (ts.isJsxAttribute(node) && copyProps.has(node.name.getText(ast)) && literalText(node.initializer)?.trim()) report('ui-copy', node, 'UI labels must come from active locale keys.');
    if ((isRender(file) || file.includes('/manifest/')) && ts.isPropertyAssignment(node) && copyProps.has(literalText(node.name) || node.name.getText(ast)) && literalText(node.initializer)?.trim()) report('ui-copy', node, 'UI copy in configuration must reference locale keys.');
    if (ts.isJsxExpression(node) && !ts.isJsxAttribute(node.parent) && literalText(node)?.trim()) report('ui-copy', node, 'UI text expressions must come from active locale keys.');
    if ((ts.isStringLiteralLike(node) || ts.isJsxText(node)) && emoji.test(node.text)) report('emoji', node, 'Use Foundation semantic icons, not Unicode emoji.');
    ts.forEachChild(node, visit);
  };
  visit(ast);
  return findings;
}

// Multiset comparison preserves unchanged debt, but blocks extra occurrences.
export function introduced(before, after) {
  const counts = new Map();
  for (const item of before) counts.set(item.signature, (counts.get(item.signature) || 0) + 1);
  return after.filter((item) => {
    const count = counts.get(item.signature) || 0;
    if (!count) return true;
    counts.set(item.signature, count - 1);
    return false;
  });
}
