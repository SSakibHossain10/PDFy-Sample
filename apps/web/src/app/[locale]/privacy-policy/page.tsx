const PrivacyPage = () => {
  return (
    <main className="overflow-x-hidden overflow-y-auto">
      <div className="px-4 sm:px-5 md:px-6 lg:px-7 xl:px-8 py-6 flex flex-col gap-8 sm:gap-9 md:gap-10 lg:gap-11 xl:gap-12 w-full max-w-5xl mx-auto bg-primary-50/10 rounded-lg">
        <h1 className="text-center">Privacy Policy</h1>

        <section>
          <h6 className="mb-1">
            <span className="text-sm font-semibold mr-1">Effective Date:</span>{" "}
            <time dateTime="2025-02-28">28 February 2025</time>
          </h6>
          <p>
            <span className="text-sm font-semibold mr-1">Last Updated:</span>{" "}
            <time dateTime="2025-02-28">28 February 2025</time>
          </p>
        </section>

        <h5>
          Welcome to <span className="text-sm font-semibold">PDFy - The Ultimate PDF Editor!</span> Your privacy is
          important to us. This Privacy Policy explains how we collect, use, store, and protect your information when
          you use our services.{" "}
        </h5>

        <section>
          <h2 className="text-lg font-semibold mb-1">Information We Collect</h2>
          <h6 className="text-primary-400 mb-4">When you use PDFy, we may collect the following data:</h6>
          <ul className="list-disc pl-6 text-sm flex flex-col gap-3">
            <li>Uploaded Files: PDFs and other documents that you upload for editing.</li>
            <li>
              Device & Usage Data: Information such as device type, operating system, and general app usage analytics
              (collected anonymously).
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-1">How We Use Your Information</h2>
          <h6 className="text-primary-400 mb-4">We use the collected data to:</h6>
          <ul className="list-disc pl-6 text-sm flex flex-col gap-3">
            <li>Provide, maintain, and improve PDF editing services.</li>
            <li>Allow users to resume their editing progress on uploaded PDFs.</li>
            <li>Enhance user experience with personalized features.</li>
            <li>Ensure security, prevent fraud, and comply with legal obligations.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-4">Data Storage & Security</h2>
          <ul className="list-disc pl-6 text-sm flex flex-col gap-3">
            <li>We parse formatted data from your uploaded PDFs and securely store it in our database.</li>
            <li>
              We protect your data from unauthorized access through{" "}
              <span className="text-sm font-semibold">authentication</span> and security measures.
            </li>
            <li>
              Your uploaded media files are securely stored in a CDN and are{" "}
              <span className="text-sm font-semibold">not shared or sold</span> to any third parties.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-4">Data Sharing & Third-Party Services</h2>
          <ul className="list-disc pl-6 text-sm flex flex-col gap-3">
            <li>
              We do <span className="text-sm font-semibold">not</span> sell, trade, or rent user data to third parties.
            </li>
            <li>
              Some third-party services (e.g., cloud storage, analytics) may be used to enhance performance, always
              adhering to strict privacy standards.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-4">User Control & Data Deletion</h2>
          <ul className="list-disc pl-6 text-sm flex flex-col gap-3">
            <li>
              Users can delete their PDF and media files at any time through the app or by contacting us at{" "}
              <a href={`mailto:${process.env.NEXT_PUBLIC_SUPPORT_EMAIL}`} className="text-sm font-semibold">
                {process.env.NEXT_PUBLIC_SUPPORT_EMAIL}
              </a>
            </li>
            <li>
              If you wish to delete your stored data permanently, contact our support team, and we will process the
              request within few days.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-2">Changes to This Policy</h2>
          <h6 className="text-primary-400">
            We may update this Privacy Policy as needed. Any changes will be posted here, and we encourage users to
            review it periodically.
          </h6>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-1.5">Contact Us</h2>
          <h6 className="text-primary-400 mb-1.5">For any questions regarding this policy, contact us at:</h6>
          <a href={`mailto:${process.env.NEXT_PUBLIC_SUPPORT_EMAIL}`} className="text-sm font-semibold">
            ✉️ {process.env.NEXT_PUBLIC_SUPPORT_EMAIL}
          </a>
        </section>
      </div>
    </main>
  );
};

export default PrivacyPage;
