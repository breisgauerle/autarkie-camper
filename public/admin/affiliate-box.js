(function () {
  const defaults = ["Bei Fritz Berger ansehen", "Bei Camping Wagner prüfen", "Bei Amazon ansehen"];
  const text = value => typeof value === "string" ? value : "";
  const escape = value => text(value).replace(/[&<>"']/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]);
  function safeUrl(value) {
    try { const url = new URL(text(value).trim()); return url.protocol === "https:" && !url.username && !url.password ? url.href : ""; }
    catch { return ""; }
  }
  CMS.registerEditorComponent({
    id: "produkt-kaufbox",
    label: "Produkt-Kaufbox",
    fields: [
      { name: "product", label: "Produktname", widget: "string" },
      { name: "price", label: "Preis-Hinweis", widget: "string", required: false },
      ...defaults.flatMap((label, index) => [
        { name: `shop${index + 1}_name`, label: `Shop ${index + 1} Name`, widget: "string", default: label, required: false },
        { name: `shop${index + 1}_url`, label: `Link ${index + 1}`, widget: "string", required: false, pattern: ["^$|^https://[^\\s]+$", "Bitte einen vollständigen HTTPS-Link eingeben."] },
      ]),
    ],
    pattern: /^```produkt-kaufbox\r?\n([^\r\n]+)\r?\n```$/m,
    fromBlock: function (match) {
      try { return JSON.parse(match[1]); } catch { return {}; }
    },
    toBlock: function (data) {
      const values = { product: text(data.product), price: text(data.price) };
      defaults.forEach((label, index) => {
        values[`shop${index + 1}_name`] = text(data[`shop${index + 1}_name`]).trim() || label;
        values[`shop${index + 1}_url`] = text(data[`shop${index + 1}_url`]).trim();
      });
      // One JSON line keeps the editor pattern stable, including quotes and line breaks in values.
      return "```produkt-kaufbox\n" + JSON.stringify(values) + "\n```";
    },
    toPreview: function (data) {
      const offers = defaults.map((label, index) => {
        const url = safeUrl(data[`shop${index + 1}_url`]);
        return url ? `<a class="affiliate-shop" href="${escape(url)}" target="_blank" rel="nofollow sponsored noopener noreferrer">${escape(text(data[`shop${index + 1}_name`]).trim() || label)}* ↗</a>` : "";
      }).filter(Boolean);
      return `<aside class="affiliate-box"><p class="affiliate-eyebrow">Produkt-Kaufbox</p><h2>${escape(data.product)}</h2>${data.price ? `<p>${escape(data.price)}</p>` : ""}${offers.length ? `<div class="affiliate-shops">${offers.join("")}</div><small>* Affiliate-Links: Für dich entstehen keine Mehrkosten.</small>` : ""}</aside>`;
    },
  });
})();