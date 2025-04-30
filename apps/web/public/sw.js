self.addEventListener("fetch", (fetchEvent) => {
  if (fetchEvent.request.url.endsWith("/receive-files/") && fetchEvent.request.method === "POST") {
    return fetchEvent.respondWith(
      (async () => {
        const formData = await fetchEvent.request.formData();
        const pdf = formData.get("pdf");
        const keys = await caches.keys();
        const mediaCache = await caches.open(keys.filter((key) => key.startsWith("media"))[0]);
        await mediaCache.put("shared-pdf", new Response(pdf));

        return Response.redirect(`/dashboard?share-target=${pdf.name}`, 303);
      })()
    );
  }
});
