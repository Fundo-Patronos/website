export function trackBeginCheckout(eventLabel) {
  if (typeof window !== "undefined" && typeof window.gtag === "function") {
    window.gtag("event", "begin_checkout", {
      event_category: "doacao",
      event_label: eventLabel,
      destination_url: "https://doa.re/patronos",
    });
  }
}
