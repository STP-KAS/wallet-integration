/* Withdrawn 17 Sep 2026. STP-KAS does not ship wallet integrations.
 * Why: https://x.com/kaspaglobal/status/2100536064683176270
 */
export function withdrawn() {
  throw new Error("STP-KAS/wallet-integration withdrawn 17 Sep 2026: no in-page inject");
}
withdrawn();
