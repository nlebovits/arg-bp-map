#!/usr/bin/env node
import { chromium } from 'playwright';
import AxeBuilder from '@axe-core/playwright';

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

async function runAudit() {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  console.log(`\n🔍 Running accessibility audit on ${BASE_URL}/en\n`);

  await page.goto(`${BASE_URL}/en`, { waitUntil: 'networkidle' });

  // Wait for map to load
  await page.waitForTimeout(3000);

  const results = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
    .analyze();

  console.log('━'.repeat(60));
  console.log('ACCESSIBILITY AUDIT RESULTS');
  console.log('━'.repeat(60));

  if (results.violations.length === 0) {
    console.log('\n✅ No accessibility violations found!\n');
  } else {
    console.log(`\n❌ Found ${results.violations.length} violation(s):\n`);

    for (const violation of results.violations) {
      console.log(`\n🔴 ${violation.id} (${violation.impact})`);
      console.log(`   ${violation.description}`);
      console.log(`   Help: ${violation.helpUrl}`);
      console.log(`   Affected elements (${violation.nodes.length}):`);

      for (const node of violation.nodes.slice(0, 3)) {
        console.log(`   • ${node.target.join(' > ')}`);
        if (node.failureSummary) {
          console.log(`     ${node.failureSummary.split('\n')[0]}`);
        }
      }
      if (violation.nodes.length > 3) {
        console.log(`   ... and ${violation.nodes.length - 3} more`);
      }
    }
  }

  console.log('\n' + '━'.repeat(60));
  console.log(`Passes: ${results.passes.length}`);
  console.log(`Violations: ${results.violations.length}`);
  console.log(`Incomplete: ${results.incomplete.length}`);
  console.log(`Inapplicable: ${results.inapplicable.length}`);
  console.log('━'.repeat(60) + '\n');

  await browser.close();

  // Exit with error code if violations found
  process.exit(results.violations.length > 0 ? 1 : 0);
}

runAudit().catch(err => {
  console.error('Audit failed:', err);
  process.exit(1);
});
