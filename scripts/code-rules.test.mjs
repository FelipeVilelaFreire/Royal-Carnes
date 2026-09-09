import test from 'node:test';
import assert from 'node:assert/strict';
import { analyze, introduced } from './code-rules.mjs';

const screen = 'frontend/admin/web/src/screens/Example.tsx';
const rules = (source, file = screen) => analyze(file, source).map((item) => item.rule);
for (const [name, source, expected] of [
  ['inline object', '<Card style={{ color: "red" }} />', 'inline-style'],
  ['inline variable', '<Card style={computed} />', 'inline-style'],
  ['visible text', '<Text>Salvar</Text>', 'ui-copy'],
  ['literal expression', '<Text>{"Salvar"}</Text>', 'ui-copy'],
  ['accessibility text', '<Button aria-label="Salvar" />', 'ui-copy'],
  ['API alias', 'import { api } from "@/api/orders.api";', 'render-import'],
  ['relative API', 'import { api } from "../../../shared-core/api/orders";', 'render-import'],
  ['dynamic mock', 'const data = import("@/mocks/orders");', 'render-import'],
  ['fixed locale', 'import { strings } from "@/locales/pt-BR";', 'fixed-locale'],
  ['network', 'fetch("/orders");', 'render-network'],
  ['cross surface', 'import x from "@royalprime/client/hooks/orders";', 'surface-boundary'],
  ['legacy shell', 'import x from "../transitional/app-shell";', 'legacy-import'],
  ['inline CSS', '<style>{css}</style>', 'inline-visual'],
  ['Unicode icon', '<Text>{"\u{1F4E6}"}</Text>', 'emoji'],
]) test(name, () => assert.ok(rules(source).includes(expected)));

test('semantic UI and CSS Modules pass', () => {
  assert.deepEqual(rules('import styles from "./Example.module.css"; import { useOrders } from "@royalprime/admin/hooks/useOrders"; const view = <Card className={styles.root}><Text>{strings.title}</Text></Card>;'), []);
});
test('native style is supported', () => assert.ok(!rules('<View style={resolved} />', 'frontend/client/mobile/src/Screen.tsx').includes('inline-style')));
test('comments are not UI text', () => assert.deepEqual(rules('// <Text>Salvar</Text>\nconst x = <Text>{strings.title}</Text>;'), []));
test('CSS values require tokens', () => assert.ok(rules('.root { padding: 16px; color: #fff; }', screen.replace('.tsx', '.module.css')).includes('css-token')));
test('CSS token values pass', () => assert.deepEqual(rules('.root { padding: var(--theme--spacing-md); display: grid; }', screen.replace('.tsx', '.module.css')), []));
test('UI CSS cannot read Theme', () => assert.ok(rules('.root { color: var(--theme--color-white); }', 'frontend/foundation/ui/Text/Text.module.css').includes('ui-theme')));
test('new JSX render files are rejected', () => assert.ok(rules('<Card />', screen.replace('.tsx', '.jsx')).includes('tsx-component')));
test('malformed CSS fails closed', () => assert.ok(rules('.x {', screen.replace('.tsx', '.module.css')).includes('syntax')));
test('unchanged debt is tolerated but duplicate violations are blocked', () => {
  const before = analyze(screen, '<Card style={old} />');
  assert.equal(introduced(before, analyze(screen, '\n<Card style={old} />')).length, 0);
  assert.equal(introduced(before, analyze(screen, '<><Card style={old} /><Card style={old} /></>')).length, 1);
  assert.equal(introduced(before, analyze(screen, '<Card style={newValue} />')).length, 1);
});
test('deleted debt is not required to persist', () => assert.deepEqual(introduced(analyze(screen, '<Card style={old} />'), analyze(screen, '<Card />')), []));
test('style hidden in local spread is rejected', () => assert.ok(rules('const props = { style: computed }; const other = {...props}; const x = <Card {...other} />;').includes('inline-style')));
test('cyclic and semantic spreads do not crash', () => assert.deepEqual(rules('const props = {...props, tone: value}; const x = <Card {...props} />;'), []));
test('copy hidden in manifest configuration is rejected', () => assert.ok(rules('export const config = {label: "Salvar"};', 'frontend/admin/shared-core/manifest/pages/example.config.jsx').includes('ui-copy')));
test('configuration label keys pass', () => assert.deepEqual(rules('export const config = {labelKey: "actions.save"};', 'frontend/admin/shared-core/manifest/pages/example.config.jsx'), []));
