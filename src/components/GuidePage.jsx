const preparationItems = [
  'Confirm that the client is registering with the SEC, not DTI. SEC covers corporations, OPCs, partnerships, and foreign corporations. Sole proprietorships are DTI registrations.',
  'Choose the vehicle: domestic stock corporation, One Person Corporation, non-stock corporation, partnership, or foreign corporation. This guide focuses on ordinary domestic stock corporations and OPCs.',
  'Map Filipino and foreign ownership before filing. Check nationality restrictions, negative-list issues, special permits, and whether the proposed purpose needs endorsement from another agency.',
  'Set the capital structure: authorized capital stock, par value, subscribed shares, paid-up amount, payment mode, share class, and each subscriber allocation.',
  'Identify incorporators, directors, officers, treasurer, corporate secretary, beneficial owners, nominee and alternate nominee for OPCs, and the authorized representative.',
  'Prepare official and alternate email addresses, mobile numbers, TINs, residential addresses, valid IDs, and eSECURE accounts for signatories where digital authentication is required.',
  'Draft or review the primary purpose, secondary purposes, principal office, corporate term, fiscal year, arbitration clause, nominee provisions for OPCs, and transfer restrictions if foreign ownership limits apply.',
];

const oneSecChecks = [
  'Use OneSEC/ZERO only for qualifying domestic stock corporations or OPCs with 2 to 15 incorporators, directors, and stockholders where allowed.',
  'Incorporators, directors, and subscribers must be natural persons of legal age.',
  'The primary purpose is selected from SEC predetermined business activities and is not freely modified.',
  'Shares are common shares with par value, par value is at least PHP 1.00, and subscription payment is cash.',
  'The company is not in an economic zone and does not require SEC department clearance or another agency endorsement.',
  'All required corporate officers can digitally authenticate documents through eSAP using their eSECURE credentials and OTP.',
];

const steps = [
  {
    title: '1. Open eSECURE and prepare user access',
    body: 'Create or confirm credentialed eSECURE accounts for the authorized representative and every person who must authenticate documents. For OneSEC/ZERO, the eSECURE ID is used to auto-populate incorporator and officer information.',
    attorney: 'Check spelling, TIN format, citizenship, address, and signatory capacity before encoding. Mismatches create avoidable SEC compliance notices.',
  },
  {
    title: '2. Select the correct eSPARC route',
    body: 'Go to eSPARC and choose OneSEC/ZERO for eligible domestic stock corporations or OPCs. Choose Regular Processing for non-stock corporations, partnerships, foreign corporations, applications with special circumstances, agency clearances, uploaded notarized/authenticated forms, or non-qualifying OneSEC cases.',
    attorney: 'Do not force OneSEC if the purpose, ownership, economic-zone location, clearance requirement, or share structure does not fit. Regular Processing is slower but safer for nuanced matters.',
  },
  {
    title: '3. Verify and reserve the proposed name',
    body: 'Run name verification in eSPARC. Prepare at least 2 to 3 alternatives. Avoid identical or confusingly similar names, restricted industry terms, geographic names used improperly, and terms that imply regulated activities without clearance.',
    attorney: 'Review against SEC naming rules and the client business model. A clean name saves re-filing time and avoids later amendment work.',
  },
  {
    title: '4. Encode company information',
    body: 'Enter company type, principal office, official email, alternate email, contact number, corporate term, fiscal year, business activity, and purpose clauses. For OneSEC/ZERO, select from available predetermined purposes.',
    attorney: 'Purpose language should be broad enough for planned activities but not so broad that it triggers licensing, foreign ownership, or regulatory problems.',
  },
  {
    title: '5. Encode capital structure and subscriptions',
    body: 'Complete authorized capital stock, par value, share classification, number of shares, subscribed capital, paid-up capital, payment mode, and subscriber details. Under OneSEC/ZERO, common shares with par value and cash subscription are expected.',
    attorney: 'Reconcile totals before moving forward. Confirm paid-up amounts with finance and make sure the structure supports tax, ownership, and control objectives.',
  },
  {
    title: '6. Encode incorporators, directors, officers, and beneficial owners',
    body: 'Input every incorporator, director/trustee, treasurer, corporate secretary, president, and beneficial owner. OPCs must include nominee and alternate nominee details and their acceptance documents where required.',
    attorney: 'Confirm legal capacity, citizenship, residency if relevant, disqualifications, conflict issues, nominee acceptance, and beneficial ownership declarations.',
  },
  {
    title: '7. Review system-generated documents',
    body: 'Open and review the Application Summary Form, Cover Sheet, Articles of Incorporation, By-Laws if generated or required, Treasurer-related declarations, authentication certificate, nominee acceptance documents for OPCs, and other system-generated forms.',
    attorney: 'Treat this as the final legal review. Check every name, address, amount, share count, date, officer title, purpose clause, ownership restriction, and signature block.',
  },
  {
    title: '8. Authenticate or notarize documents',
    body: 'For OneSEC/ZERO, signatories authenticate the system-generated documents through eSAP. Each signatory receives a ready-to-sign notification, logs in, views the document, signs, and completes OTP verification. For Regular Processing, upload signed and authenticated or notarized documents when required.',
    attorney: 'Digital authentication removes the hard-copy submission requirement for qualifying ZERO applications. Regular Processing may still require originally signed and authenticated or notarized hard copies within the SEC-prescribed period.',
  },
  {
    title: '9. Pay SEC registration fees',
    body: 'After the application qualifies for payment, use the Payment Assessment Form reference number in eSPAYSEC, select the payment option, proceed to payment, and keep the electronic official receipt and proof of payment.',
    attorney: 'Check the PAF details against the application before paying. Some payment channels charge convenience fees.',
  },
  {
    title: '10. Download the certificate and registration documents',
    body: 'After successful payment and completion, download the digitally signed Certificate of Incorporation and authenticated system-generated documents from eSPARC. Save the full registration packet in the corporate records folder.',
    attorney: 'Confirm the certificate name, registration number, issuance date, and document validity. Flag any discrepancy immediately before downstream registrations begin.',
  },
  {
    title: '11. Continue to post-SEC registrations',
    body: 'Use the Philippine Business Hub flow where available for BIR TIN and employer numbers with SSS, Pag-IBIG, and PhilHealth. Then coordinate LGU business permit, barangay clearance, books of accounts, receipts/invoices, bank account opening, and sector permits if applicable.',
    attorney: 'This step is outside the SEC filing but should be tracked in the same closing checklist so the company can legally operate.',
  },
];

const documents = [
  'Approved or verified corporate name',
  'Application Summary Form and Cover Sheet',
  'Articles of Incorporation',
  'By-Laws, if applicable or required by route',
  'Treasurer-related declaration or affidavit, if generated or required',
  'Valid IDs and TIN details of incorporators, directors, officers, and beneficial owners',
  'Nominee and alternate nominee acceptance for OPCs',
  'Agency endorsement or clearance, if the business activity requires it',
  'Proof of payment and electronic official receipt',
  'Final Certificate of Incorporation and authenticated registration documents',
];

const reviewChecks = [
  'Name: legally available, not misleading, and aligned with regulated-industry naming rules.',
  'Purpose: matches the business model without accidentally triggering licensing or foreign ownership issues.',
  'Ownership: compliant with nationality restrictions and any foreign equity limits.',
  'Capital: totals reconcile across authorized, subscribed, paid-up, par value, and subscriber tables.',
  'People: signatories, directors, officers, treasurer, corporate secretary, beneficial owners, nominees, and authorized representative are consistent across forms.',
  'Documents: all forms are signed, digitally authenticated, notarized, or uploaded under the correct route.',
  'Deadlines: payment, hard-copy submission if required, and post-SEC registrations are assigned to owners.',
];

export default function GuidePage() {
  return (
    <div className="flex-1 overflow-y-auto bg-surface-dark">
      <div className="border-b border-surface-border px-4 py-3">
        <div className="max-w-5xl mx-auto">
          <p className="text-xs uppercase tracking-widest text-brand-orange font-semibold">
            Employee Legal Operations Guide
          </p>
          <h1 className="text-2xl font-bold text-white mt-1">
            Registering a Business with the Philippine SEC
          </h1>
          <p className="text-sm text-zinc-400 mt-2 max-w-3xl">
            Detailed working checklist for SEC registration of corporations and OPCs in the Philippines. Current as of July 11, 2026; verify final requirements in eSPARC before filing.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-6 space-y-6">
        <section className="bg-surface-card border border-surface-border rounded-lg p-5">
          <h2 className="text-lg font-semibold text-white">Before You File</h2>
          <ul className="mt-4 space-y-3 text-sm text-zinc-300">
            {preparationItems.map((item) => (
              <li key={item} className="flex gap-3">
                <span className="mt-1 h-2 w-2 rounded-full bg-brand-orange shrink-0" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="bg-surface-card border border-surface-border rounded-lg p-5">
          <h2 className="text-lg font-semibold text-white">Choose OneSEC/ZERO or Regular Processing</h2>
          <p className="mt-2 text-sm text-zinc-400">
            OneSEC/ZERO is the faster, paperless route for qualifying domestic stock corporations and OPCs. Use Regular Processing when the application needs SEC review, document upload, special clearance, or does not meet OneSEC conditions.
          </p>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {oneSecChecks.map((item) => (
              <div key={item} className="rounded-lg border border-surface-border bg-surface-input p-3 text-sm text-zinc-300">
                {item}
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white mb-4">Step-by-Step Filing Procedure</h2>
          <div className="space-y-3">
            {steps.map((step) => (
              <article key={step.title} className="bg-surface-card border border-surface-border rounded-lg p-5">
                <h3 className="font-semibold text-white">{step.title}</h3>
                <p className="mt-2 text-sm text-zinc-300 leading-relaxed">{step.body}</p>
                <div className="mt-3 rounded-lg bg-brand-orange-light border border-brand-orange/30 p-3">
                  <p className="text-xs uppercase tracking-wider text-brand-orange font-semibold">Attorney Review Point</p>
                  <p className="mt-1 text-sm text-zinc-200">{step.attorney}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="grid gap-4 lg:grid-cols-2">
          <div className="bg-surface-card border border-surface-border rounded-lg p-5">
            <h2 className="text-lg font-semibold text-white">Document Packet Checklist</h2>
            <ul className="mt-4 space-y-2 text-sm text-zinc-300">
              {documents.map((item) => (
                <li key={item} className="flex gap-2">
                  <span className="text-brand-orange">-</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-surface-card border border-surface-border rounded-lg p-5">
            <h2 className="text-lg font-semibold text-white">Final Legal QA</h2>
            <ul className="mt-4 space-y-2 text-sm text-zinc-300">
              {reviewChecks.map((item) => (
                <li key={item} className="flex gap-2">
                  <span className="text-brand-orange">-</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="bg-surface-card border border-surface-border rounded-lg p-5">
          <h2 className="text-lg font-semibold text-white">Official References</h2>
          <div className="mt-3 grid gap-2 text-sm">
            <a className="text-brand-orange hover:text-brand-orange-hover" href="https://esparc.sec.gov.ph/application/selection" target="_blank" rel="noreferrer">SEC eSPARC application selection</a>
            <a className="text-brand-orange hover:text-brand-orange-hover" href="https://esparc.sec.gov.ph/docs/SEC%20ZERO%20OneSEC_User%20Guide.pdf" target="_blank" rel="noreferrer">SEC ZERO / OneSEC user guide</a>
            <a className="text-brand-orange hover:text-brand-orange-hover" href="https://espaysec.sec.gov.ph/" target="_blank" rel="noreferrer">SEC eSPAYSEC payment portal</a>
            <a className="text-brand-orange hover:text-brand-orange-hover" href="https://business.gov.ph/" target="_blank" rel="noreferrer">Philippine Business Hub</a>
          </div>
          <p className="mt-4 text-xs text-zinc-500">
            This guide is operational guidance for employees and does not replace matter-specific legal advice, SEC notices, or specialist regulatory clearance.
          </p>
        </section>
      </div>
    </div>
  );
}
